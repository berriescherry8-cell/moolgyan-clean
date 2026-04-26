'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState, useCallback } from 'react';
import type { DailyWisdom } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

// Get Supabase client
export const getSupabase = () => {
  if (typeof window === 'undefined') {
    console.warn('Supabase client called server-side');
    return null;
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Map camelCase collection names to snake_case table names
const getTableName = (collection: string): string => {
  const tableMap: { [key: string]: string } = {
    'googleForms': 'google_forms',
    'referenceItems': 'reference_items',
    'satguruBhajans': 'satguru_bhajan',
    'wisdomQuotes': 'wisdom_quotes',
    'liveSatsangs': 'live_satsangs',
    'bookOrders': 'book_orders',
    'newsItems': 'news_items',
    'photoItems': 'photo_items',
    'videoItems': 'video_items',
    'memberData': 'member_data'
  };
  return tableMap[collection] || collection;
};

// Supabase-based data manager for real persistence
export const dataManager = {
  // Create or update a document
  setDoc: async (collection: string, data: any, id?: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      
      const timestamp = new Date().toISOString();
      const tableName = getTableName(collection);
      
      if (id) {
        // Update existing document - only add updated_at if it exists in the table
        const updateData = { ...data };
        
        // Always include for_sale field if present in data
        if ('for_sale' in data) {
          updateData.for_sale = data.for_sale;
        }
        
        try {
          const { error } = await supabase
            .from(tableName)
            .update({ ...updateData, updated_at: timestamp })
            .eq('id', id);
          
          if (error && error.code === 'PGRST204') {
            // Column doesn't exist, try without it
            const { error: error2 } = await supabase
              .from(tableName)
              .update(updateData)
              .eq('id', id);
            if (error2) throw error2;
          } else if (error) {
            throw error;
          }
        } catch (updateError) {
          // If update with updated_at fails, try without it
          const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq('id', id);
          if (error) throw error;
        }
        
        return id;
      } else {
        // Create new document - always include all required fields
        const insertData = { ...data };
        
        // Ensure for_sale field is always included for new documents
        if (!('for_sale' in insertData)) {
          insertData.for_sale = false;
        }
        
        // Try to add timestamps, but don't fail if columns don't exist
        try {
          const { data: newDoc, error } = await supabase
            .from(tableName)
            .insert([{ ...insertData, created_at: timestamp, updated_at: timestamp }])
            .select()
            .single();
          
          if (error && error.code === 'PGRST204') {
            // Columns don't exist, try without timestamps
            const { data: newDoc2, error: error2 } = await supabase
              .from(tableName)
              .insert([insertData])
              .select()
              .single();
            if (error2) throw error2;
            return newDoc2.id;
          } else if (error) {
            throw error;
          }
          
          return newDoc.id;
        } catch (insertError) {
          // If insert with timestamps fails, try without them
          const { data: newDoc, error } = await supabase
            .from(collection)
            .insert([insertData])
            .select()
            .single();
          if (error) throw error;
          return newDoc.id;
        }
      }
    } catch (error) {
      console.error(`[DataManager] Error setting document in ${collection}:`, error);
      throw error;
    }
  },

  // Delete a document
  deleteDoc: async (collection: string, id: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      
      const tableName = getTableName(collection);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`[DataManager] Error deleting document from ${collection}:`, error);
      throw error;
    }
  },

  // Get a single document by ID
  getDoc: async (collection: string, id: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      
      const tableName = getTableName(collection);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`[DataManager] Error getting document from ${collection}:`, error);
      throw error;
    }
  },

  // Query documents with filters
  query: async (collection: string, filters?: Record<string, any>) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      
      const tableName = getTableName(collection);
      let query = supabase.from(tableName).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`[DataManager] Error querying ${collection}:`, error);
      throw error;
    }
  }
};

// Hook to fetch and subscribe to collection changes
export function useCollection<T>(collection: string, filters?: Record<string, any>): T[] {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        console.warn(`[useCollection] Supabase client not available for ${collection}`);
        setData([]);
        setLoading(false);
        return;
      }

      const tableName = getTableName(collection);
      let query = supabase.from(tableName).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data: fetchedData, error } = await query;
      if (error) {
        console.error(`[useCollection] Supabase error for ${collection}:`, error);
        setData([]);
        return;
      }
      
      setData(fetchedData || []);
    } catch (error) {
      console.error(`[useCollection] Error fetching ${collection}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [collection, filters]);

  useEffect(() => {
    fetchData();

    const supabase = getSupabase();
    if (!supabase) return;

    // Subscribe to real-time changes
    const tableName = getTableName(collection);
    const channelName = `${collection}_changes_${Date.now()}`; // Unique channel name
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload: { eventType: string; new: any; old: any }) => {
            console.log(`[Realtime] Change in ${collection}:`, payload);
            
            if (payload.eventType === 'INSERT') {
              setData(prev => [...prev, payload.new as T]);
            } else if (payload.eventType === 'UPDATE') {
              setData(prev => prev.map(item => 
                (item as any).id === payload.new.id ? { ...item, ...payload.new } : item
              ));
            } else if (payload.eventType === 'DELETE') {
              setData(prev => prev.filter(item => (item as any).id !== payload.old.id));
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Realtime] Subscribed to ${collection}`);
          } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
            console.warn(`[Realtime] Subscription failed for ${collection}:`, status);
          }
        });

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn(`[Realtime] Error removing channel for ${collection}:`, error);
        }
      };
    } catch (error) {
      console.error(`[Realtime] Error setting up subscription for ${collection}:`, error);
      return () => {}; // Return empty cleanup function
    }
  }, [collection, fetchData]);

  return data;
}

// Hook for single document with real-time updates
export function useDocument<T>(collection: string, id: string): T | null {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          setData(null);
          setLoading(false);
          return;
        }

        const tableName = getTableName(collection);
        const { data: fetchedData, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setData(fetchedData);
      } catch (error) {
        console.error(`[useDocument] Error fetching ${collection}/${id}:`, error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const supabase = getSupabase();
    if (!supabase) return;

    // Subscribe to changes for this specific document
    const tableName = getTableName(collection);
    const channelName = `${collection}_${id}_changes_${Date.now()}`; // Unique channel name
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload: { eventType: string; new: any; old: any }) => {
            if (payload.eventType === 'UPDATE' && payload.new.id === id) {
              setData(payload.new as T);
            } else if (payload.eventType === 'DELETE' && payload.old.id === id) {
              setData(null);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Realtime] Subscribed to ${collection}/${id}`);
          } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
            console.warn(`[Realtime] Subscription failed for ${collection}/${id}:`, status);
          }
        });

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn(`[Realtime] Error removing channel for ${collection}/${id}:`, error);
        }
      };
    } catch (error) {
      console.error(`[Realtime] Error setting up subscription for ${collection}/${id}:`, error);
      return () => {}; // Return empty cleanup function
    }
  }, [collection, id]);

  return data;
}


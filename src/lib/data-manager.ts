<<<<<<< HEAD
/**
 * Simple data management system to replace Firebase Firestore
 * Uses localStorage for persistence and provides similar API patterns
 */

import type { DailyWisdom } from './types';
import React from 'react';

export interface BaseEntity {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class DataManager {
  private static instance: DataManager;
  private listeners: Map<string, Set<(data: any[]) => void>> = new Map();

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private getCollectionKey(collectionName: string): string {
    return `mool-gyan-${collectionName}`;
  }

  private notifyListeners(collectionName: string, data: any[]): void {
    const listeners = this.listeners.get(collectionName);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Get all documents from a collection
   */
  getCollection<T extends BaseEntity>(collectionName: string): T[] {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const key = this.getCollectionKey(collectionName);
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data).map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      }));
    } catch (error) {
      console.error(`Error parsing collection ${collectionName}:`, error);
      return [];
    }
  }

  /**
   * Get a specific document by ID
   */
  getDoc<T extends BaseEntity>(collectionName: string, docId: string): T | null {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const collection = this.getCollection<T>(collectionName);
    return collection.find(item => item.id === docId) || null;
  }

  /**
   * Add or update a document
   */
  setDoc<T extends BaseEntity>(collectionName: string, data: Partial<T>, docId?: string): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('localStorage is not available in this environment');
    }

    const key = this.getCollectionKey(collectionName);
    const existingData = this.getCollection<T>(collectionName);
    const id = docId || data.id || this.generateId();
    
    const now = new Date();
    const docData: T = {
      ...data as T,
      id,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    const index = existingData.findIndex(item => item.id === id);
    if (index > -1) {
      existingData[index] = docData;
    } else {
      existingData.push(docData);
    }

    try {
      localStorage.setItem(key, JSON.stringify(existingData));
      this.notifyListeners(collectionName, existingData);
      return id;
    } catch (error) {
      console.error(`Error saving to ${collectionName}:`, error);
      throw new Error(`Failed to save data: ${error}`);
    }
  }

  /**
   * Delete a document
   */
  deleteDoc(collectionName: string, docId: string): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const key = this.getCollectionKey(collectionName);
    const existingData = this.getCollection(collectionName);
    const filteredData = existingData.filter(item => item.id !== docId);
    localStorage.setItem(key, JSON.stringify(filteredData));
    this.notifyListeners(collectionName, filteredData);
  }

  /**
   * Subscribe to collection changes
   */
  onCollectionUpdate<T extends BaseEntity>(
    collectionName: string, 
    callback: (data: T[]) => void
  ): () => void {
    if (!this.listeners.has(collectionName)) {
      this.listeners.set(collectionName, new Set());
    }
    
    this.listeners.get(collectionName)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(collectionName);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(collectionName);
        }
      }
    };
  }

  /**
   * Clear all data for a collection
   */
  clearCollection(collectionName: string): void {
    const key = this.getCollectionKey(collectionName);
    localStorage.removeItem(key);
    this.notifyListeners(collectionName, []);
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mool-gyan-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Notify all listeners
    this.listeners.forEach((callbacks, collectionName) => {
      callbacks.forEach(callback => callback([]));
    });
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance();

// Daily Wisdom specific methods
export async function getDailyWisdom(): Promise<DailyWisdom | null> {
  return dataManager.getDoc<DailyWisdom>('appSettings', 'dailyWisdom');
}

export async function updateDailyWisdom(wisdom: Partial<DailyWisdom>): Promise<void> {
  dataManager.setDoc<DailyWisdom>('appSettings', wisdom, 'dailyWisdom');
}

// Simple hook for React components
export function useCollection<T extends BaseEntity>(collectionName: string): T[] {
  const [data, setData] = React.useState<T[]>(dataManager.getCollection<T>(collectionName));
  
  React.useEffect(() => {
    const unsubscribe = dataManager.onCollectionUpdate(collectionName, setData);
    return unsubscribe;
  }, [collectionName]);
=======
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState, useCallback } from 'react';

// Get Supabase client
export const getSupabase = () => {
  if (typeof window === 'undefined') {
    console.warn('Supabase client called server-side');
    return null;
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase env vars missing - cannot create browser client');
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Supabase-based data manager for real persistence
export const dataManager = {
  // Create or update a document
  setDoc: async (collection: string, data: any, id?: string) => {
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      
      const timestamp = new Date().toISOString();
      
      if (id) {
        // Update existing document - only add updated_at if it exists in the table
        const updateData = { ...data };
        
        // Always include for_sale field if present in data
        if ('for_sale' in data) {
          updateData.for_sale = data.for_sale;
        }
        
        try {
          const { error } = await supabase
            .from(collection)
            .update({ ...updateData, updated_at: timestamp })
            .eq('id', id);
          
          if (error && error.code === 'PGRST204') {
            // Column doesn't exist, try without it
            const { error: error2 } = await supabase
              .from(collection)
              .update(updateData)
              .eq('id', id);
            if (error2) throw error2;
          } else if (error) {
            throw error;
          }
        } catch (updateError) {
          // If update with updated_at fails, try without it
          const { error } = await supabase
            .from(collection)
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
            .from(collection)
            .insert([{ ...insertData, created_at: timestamp, updated_at: timestamp }])
            .select()
            .single();
          
          if (error && error.code === 'PGRST204') {
            // Columns don't exist, try without timestamps
            const { data: newDoc2, error: error2 } = await supabase
              .from(collection)
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
      
      const { error } = await supabase
        .from(collection)
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
      
      const { data, error } = await supabase
        .from(collection)
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
      
      let query = supabase.from(collection).select('*');
      
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

      let query = supabase.from(collection).select('*');
      
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
    const channel = supabase
      .channel(`${collection}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: collection },
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collection, fetchData]);
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

  return data;
}

<<<<<<< HEAD

=======
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

        const { data: fetchedData, error } = await supabase
          .from(collection)
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
    const channel = supabase
      .channel(`${collection}_${id}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: collection },
        (payload: { eventType: string; new: any; old: any }) => {
          if (payload.eventType === 'UPDATE' && payload.new.id === id) {
            setData(payload.new as T);
          } else if (payload.eventType === 'DELETE' && payload.old.id === id) {
            setData(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collection, id]);

  return data;
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

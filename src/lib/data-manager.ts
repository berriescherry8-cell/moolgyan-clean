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

  return data;
}



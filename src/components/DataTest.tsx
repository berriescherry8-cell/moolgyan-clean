'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/lib/data-manager';

export default function DataTest() {
  const [testResult, setTestResult] = useState<string>('');

  const testDataManager = async () => {
    try {
      // Test saving data
      const testData = {
        id: 'test-1',
        name: 'Test User',
        email: 'test@example.com',
        submittedAt: new Date().toISOString()
      };

      // Save to test collection
      dataManager.setDoc('testCollection', testData);
      
      // Retrieve data
      const savedData = dataManager.getCollection('testCollection');
      
      setTestResult(`Success! Saved ${savedData.length} items to testCollection`);
      
      // Clean up
      dataManager.deleteDoc('testCollection', 'test-1');
      
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Data Manager Test</h3>
      <Button onClick={testDataManager}>Test Data Manager</Button>
      <p className="mt-2 text-sm">{testResult}</p>
    </div>
  );
}
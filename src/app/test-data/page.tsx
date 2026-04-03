'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/lib/data-manager';
import DebugTest from '@/components/DebugTest';

export default function TestDataPage() {
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

  const testOrderForm = async () => {
    try {
      // Test order form data
      const orderData = {
        id: Date.now().toString(),
        bookId: 'test-book',
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        bookPrice: 100,
        quantity: 10,
        totalAmount: 1000,
        customerName: 'Test Customer',
        mobile: '1234567890',
        address: 'Test Address',
        pinCode: '123456',
        orderDate: new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      dataManager.setDoc('orders', orderData);
      
      const orders = dataManager.getCollection('orders');
      setTestResult(`Order test: Saved ${orders.length} orders`);
      
    } catch (error) {
      setTestResult(`Order test error: ${error}`);
    }
  };

  const testJoinForm = async () => {
    try {
      // Test join form data
      const memberData = {
        id: Date.now().toString(),
        name: 'Test Member',
        fathersName: 'Test Father',
        mobile: '1234567890',
        email: 'test@member.com',
        joinedAt: new Date().toISOString(),
      };
      
      dataManager.setDoc('kgfMembers', memberData);
      
      const members = dataManager.getCollection('kgfMembers');
      setTestResult(`Join test: Saved ${members.length} members`);
      
    } catch (error) {
      setTestResult(`Join test error: ${error}`);
    }
  };

  const clearAllData = () => {
    dataManager.clearAll();
    setTestResult('All data cleared');
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Data Manager Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Basic Test</h3>
          <Button onClick={testDataManager}>Test Data Manager</Button>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Order Form Test</h3>
          <Button onClick={testOrderForm}>Test Order Form</Button>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Join Form Test</h3>
          <Button onClick={testJoinForm}>Test Join Form</Button>
        </div>
        
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">Clear All Data</h3>
          <Button onClick={clearAllData} variant="destructive">Clear All</Button>
        </div>
      </div>
      
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-2">Test Result</h3>
        <p className="text-sm">{testResult}</p>
      </div>

      <DebugTest />
    </div>
  );
}

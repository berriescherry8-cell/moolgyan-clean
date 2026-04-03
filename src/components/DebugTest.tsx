'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/lib/data-manager';

export default function DebugTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<string>('');

  const runFullTest = async () => {
    try {
      setTestResult('Starting full test...');
      
      // Test 1: Basic localStorage access
      localStorage.setItem('test-key', 'test-value');
      const testValue = localStorage.getItem('test-key');
      setTestResult(prev => prev + `\n✓ localStorage access: ${testValue}`);
      
      // Test 2: Data manager basic operations
      const testData = {
        id: 'debug-test-1',
        name: 'Debug User',
        email: 'debug@test.com',
        timestamp: new Date().toISOString()
      };

      setTestResult(prev => prev + '\n✓ Creating test data...');
      
      // Save data
      dataManager.setDoc('debugTest', testData);
      setTestResult(prev => prev + '\n✓ Data saved to debugTest collection');
      
      // Retrieve data
      const retrievedData = dataManager.getCollection('debugTest');
      setTestResult(prev => prev + `\n✓ Retrieved ${retrievedData.length} items from debugTest`);
      
      // Test 3: Test order form data
      const orderData = {
        id: 'debug-order-1',
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
      setTestResult(prev => prev + `\n✓ Orders test: ${orders.length} orders saved`);
      
      // Test 4: Test join form data
      const memberData = {
        id: 'debug-member-1',
        name: 'Debug Member',
        fathersName: 'Debug Father',
        mobile: '1234567890',
        email: 'debug@member.com',
        joinedAt: new Date().toISOString(),
      };
      
      dataManager.setDoc('kgfMembers', memberData);
      const members = dataManager.getCollection('kgfMembers');
      setTestResult(prev => prev + `\n✓ Members test: ${members.length} members saved`);
      
      // Test 5: Test FAQ form data
      const faqData = {
        id: 'debug-faq-1',
        name: 'Debug User',
        email: 'debug@faq.com',
        question: 'Test question for FAQ',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      dataManager.setDoc('faqQuestions', faqData);
      const faqs = dataManager.getCollection('faqQuestions');
      setTestResult(prev => prev + `\n✓ FAQ test: ${faqs.length} FAQ questions saved`);
      
      // Show all localStorage data
      const allData: Record<string, any> = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('mool-gyan-')) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch (e) {
            allData[key] = 'Error parsing';
          }
        }
      });
      
      setLocalStorageData(JSON.stringify(allData, null, 2));
      
      setTestResult(prev => prev + '\n\n✅ All tests completed successfully!');
      
    } catch (error) {
      setTestResult(`❌ Test failed: ${error}`);
    }
  };

  const clearAllData = () => {
    dataManager.clearAll();
    setTestResult('All data cleared');
    setLocalStorageData('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-4">Debug Test</h3>
        <div className="space-y-2">
          <Button onClick={runFullTest}>Run Full Test</Button>
          <Button onClick={clearAllData} variant="destructive" className="ml-2">Clear All Data</Button>
        </div>
      </div>
      
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-2">Test Results</h3>
        <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
      </div>
      
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-2">LocalStorage Data</h3>
        <pre className="text-sm whitespace-pre-wrap">{localStorageData}</pre>
      </div>
    </div>
  );
}
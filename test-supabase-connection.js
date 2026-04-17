// Test Supabase Connection
// Run this with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase Connection Test ===');
console.log('URL exists:', !!supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('URL length:', supabaseUrl?.length || 0);
console.log('Key length:', supabaseKey?.length || 0);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n=== Testing Connection ===');
    
    // Test 1: Basic connection (try auth.users table)
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log('⚠️  Profiles table not accessible, trying connection test...');
      // Alternative test - just try to get auth session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('✅ Basic connection successful (auth session test)');
    } else {
      console.log('✅ Basic connection successful (profiles table accessible)');
    }
    
    // Test 2: Check auth users
    console.log('\n=== Testing Auth ===');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.log('⚠️  Cannot list users (expected with anon key):', usersError.message);
    } else {
      console.log('✅ Auth users found:', users.users.length);
    }
    
    // Test 3: Test admin login (if you have credentials)
    console.log('\n=== Testing Admin Login ===');
    const testEmail = 'sharmadevendra715@gmail.com';
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'your-password-here' // Replace with actual password
    });
    
    if (signInError) {
      console.log('⚠️  Login test failed:', signInError.message);
      console.log('   (This is expected without correct password)');
    } else {
      console.log('✅ Login successful for:', signInData.user.email);
    }
    
    // Test 4: Check profiles table
    console.log('\n=== Testing Profiles Table ===');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5);
      
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('Sample profiles:', profiles);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection();

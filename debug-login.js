// Debug Login Script
// Run this to test actual login credentials

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('=== Testing Login Credentials ===');
  
  // Test with your admin emails
  const adminEmails = [
    'sharmadevendra715@gmail.com',
    'kpdeora1986@gmail.com', 
    'berriescherry8@gmail.com'
  ];
  
  for (const email of adminEmails) {
    console.log(`\n--- Testing ${email} ---`);
    
    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
      
    if (profileError) {
      console.log('Profile error:', profileError.message);
    } else if (profile) {
      console.log('Profile found:', { id: profile.id, email: profile.email, role: profile.role });
    } else {
      console.log('Profile not found');
    }
  }
  
  // Test actual login (you need to provide password)
  console.log('\n=== Manual Login Test ===');
  console.log('To test actual login, uncomment and add your password:');
  console.log('// const { data, error } = await supabase.auth.signInWithPassword({');
  console.log('//   email: "your-email@gmail.com",');
  console.log('//   password: "your-password"');
  console.log('// });');
}

testLogin().catch(console.error);

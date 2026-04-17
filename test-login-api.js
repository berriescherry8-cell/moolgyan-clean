// Test Login API Directly
// Run this to test the actual API endpoint

const testLogin = async (email, password) => {
  try {
    console.log(`\n=== Testing Login API ===`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password ? '[REDACTED]' : 'NOT PROVIDED'}`);
    
    const response = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log(`Response data:`, data);
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error('API test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test cases - replace with your actual password
const testCases = [
  { email: 'sharmadevendra715@gmail.com', password: 'your-password-here' },
  { email: 'kpdeora1986@gmail.com', password: 'your-password-here' },
  { email: 'berriescherry8@gmail.com', password: 'your-password-here' },
  { email: 'wrong@email.com', password: 'wrong-password' }, // Should fail
];

console.log('To test the login API:');
console.log('1. Make sure your Next.js dev server is running (npm run dev)');
console.log('2. Replace "your-password-here" with actual passwords');
console.log('3. Run: node test-login-api.js');

// Uncomment this function to actually test
/*
async function runTests() {
  for (const testCase of testCases) {
    await testLogin(testCase.email, testCase.password);
  }
}
runTests();
*/

module.exports = { testLogin };

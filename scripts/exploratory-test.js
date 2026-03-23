const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'https://greenops-auto-tuner-nnil0prjr-jacuzzi8888s-projects.vercel.app';
const API_TOKEN = process.env.MCP_API_TOKEN || crypto.randomBytes(32).toString('hex');

async function runTests() {
  console.log(`Starting exploratory tests against ${BASE_URL}...`);
  
  try {
    // 1. Health check
    console.log('\n--- 1. Testing /health ---');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('Health check successful:', health.data);
    
    // 2. Unauthenticated SSE connection
    console.log('\n--- 2. Testing unauthenticated /sse ---');
    try {
      await axios.get(`${BASE_URL}/sse`);
      console.error('FAIL: Unauthenticated SSE should have failed.');
    } catch (e) {
      console.log('PASS: Unauthenticated SSE failed as expected with status', e.response?.status);
    }
    
    // 3. Unauthenticated /message
    console.log('\n--- 3. Testing unauthenticated /message ---');
    try {
      await axios.post(`${BASE_URL}/message`);
      console.error('FAIL: Unauthenticated /message should have failed.');
    } catch (e) {
      console.log('PASS: Unauthenticated /message failed as expected with status', e.response?.status);
    }

    // 4. Authenticated but missing sessionId /message
    console.log('\n--- 4. Testing missing sessionId /message ---');
    try {
      await axios.post(`${BASE_URL}/message`, {}, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      console.error('FAIL: Missing sessionId should have failed.');
    } catch (e) {
      console.log('PASS: Missing sessionId failed as expected with status', e.response?.status);
    }

    // 5. Malformed payload
    console.log('\n--- 5. Testing malformed payload /message ---');
    try {
      await axios.post(`${BASE_URL}/message?sessionId=fake-session`, "this is not json", {
        headers: { 
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.error('FAIL: Malformed payload should have failed.');
    } catch (e) {
      console.log('PASS: Malformed payload failed as expected with status', e.response?.status);
    }

    console.log('\nAll exploratory edge case tests completed.');
  } catch (error) {
    console.error('Test script encountered an error:', error.message);
  }
}

runTests();

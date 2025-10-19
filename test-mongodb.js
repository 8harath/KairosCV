// Test MongoDB connection
// Run this with: node test-mongodb.js

const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://kairos-cv-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kairos-cv?retryWrites=true&w=majority';
  
  console.log('🔄 Testing MongoDB connection...');
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = client.db('kairos-cv');
    const collection = db.collection('test');
    
    // Insert a test document
    await collection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful!' 
    });
    
    console.log('✅ Successfully inserted test document!');
    
    // Find the test document
    const result = await collection.findOne({ test: true });
    console.log('✅ Successfully retrieved test document:', result);
    
    // Clean up - remove test document
    await collection.deleteOne({ test: true });
    console.log('✅ Cleaned up test document!');
    
    await client.close();
    console.log('🎉 MongoDB connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your MONGODB_URI in .env.local');
    console.log('2. Verify your database user password');
    console.log('3. Ensure your IP address is whitelisted');
    console.log('4. Check if your cluster is running');
  }
}

testConnection();


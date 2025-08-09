const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // List all databases
    const adminDb = client.db('admin');
    const result = await adminDb.admin().listDatabases();
    console.log('📊 Available databases:');
    result.databases.forEach(db => console.log(`- ${db.name}`));
    
    // Test the specific database from the connection string
    const dbName = new URL(uri).pathname.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    console.log(`\n🔍 Testing database: ${dbName}`);
    
    // List collections in the database
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections in the database:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('bad auth')) {
      console.log('\n🔑 Authentication failed. Please check your MongoDB username and password.');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n🌐 Network error: Could not resolve the hostname. Please check your internet connection.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🚫 Connection refused. The server might be down or the port might be blocked.');
    } else if (error.message.includes('MongoServerSelectionError')) {
      console.log('\n🔌 Could not connect to the MongoDB server. Please check your connection string and network settings.');
      console.log('Make sure your IP is whitelisted in MongoDB Atlas Network Access.');
    }
  } finally {
    await client.close();
  }
}

testConnection();

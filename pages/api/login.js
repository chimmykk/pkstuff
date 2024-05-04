import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri =
  'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, role = false } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
      await client.connect();
      const db = client.db('attendance-admin');
      const collection = db.collection('password');
      
      // Check if the username already exists
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Insert the new document
      const result = await collection.insertOne({ username, password: hash, role });
      console.log('Document inserted with _id:', result.insertedId);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.error('Error inserting document:', error);
      res.status(500).json({ message: 'Error inserting document' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

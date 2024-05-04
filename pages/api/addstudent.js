// pages/api/student.js

import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, rrn, GuardianGmail, phonenumber } = req.body;

    try {
      await client.connect();
      const db = client.db('attendance-admin');
      const collection = db.collection('students');

      // Check if the RRN already exists in the database
      const existingStudent = await collection.findOne({ rrn });
      if (existingStudent) {
        return res.status(400).json({ message: 'RRN already exists' });
      }

      const result = await collection.insertOne({ name, rrn, GuardianGmail, phonenumber });
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

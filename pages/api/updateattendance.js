// pages/api/updateattendance.js

import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rrn, subject, status } = req.body;

    try {
      await client.connect();
      const db = client.db('attendance-admin');
      const collection = db.collection('attendance');

      // Create the attendance collection if it doesn't exist
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map((c) => c.name);
      if (!collectionNames.includes('attendance')) {
        await db.createCollection('attendance');
      }

      // Check if the rrn document exists and insert it if it doesn't
      const rrnDocument = await collection.findOne({ rrn });
      if (!rrnDocument) {
        await collection.insertOne({
          rrn,
          createdAt: new Date(),
        });
      }

      // Update the attendance record
      const result = await collection.updateOne(
        { rrn },
        {
          $set: {
            [subject]: status,
            updatedAt: new Date(),
          },
        }
      );

      console.log('Document updated:', result);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ message: 'Error updating document' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

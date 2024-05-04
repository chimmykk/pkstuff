// pages/api/username.js

import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export default async function handler(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('attendance-admin');
    const collection = db.collection('attendance');
    const projection = { _id: 0, createdAt: 1 }; // Exclude '_id' and include 'createdAt'
    const data = await collection.find({}, { projection }).toArray();
    const formattedDates = data.map((item) => new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const sortedDates = formattedDates.sort((a, b) => new Date(a) - new Date(b));
    res.status(200).json(sortedDates);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}

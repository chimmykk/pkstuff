import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export default async function handler(req, res) {
  const { rrn } = req.query; // Get the rrn from the request query
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('attendance-admin');
    const collection = db.collection('attendance');
    const data = await collection.findOne({ rrn }, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } }); // Find attendance record with the given rrn and remove unnecessary fields
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
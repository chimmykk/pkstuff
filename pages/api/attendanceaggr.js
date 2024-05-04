import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export default async function handler(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('attendance-admin');
    const collection = db.collection('attendance');

    const studentListResponse = await fetch('http://localhost:3000/api/fetchstudent');
    const studentList = await studentListResponse.json();

    const promises = studentList.map(async (student) => {
      const { rrn } = student;
      const data = await collection.findOne({ rrn }, { projection: { _id: 0, createdAt: 0, updatedAt: 0 } });
      return { ...student, attendance: data };
    });

    const results = await Promise.all(promises);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}

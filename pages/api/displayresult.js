import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/attendance-admin?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { rrn } = req.query;

        try {
            await client.connect();
            const db = client.db('attendance-admin');
            const collection = db.collection('studentsresult');

            const studentResult = await collection.findOne({ rrn });
            if (!studentResult) {
                return res.status(404).json({ message: 'Result not found' });
            }

            res.status(200).json(studentResult);
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({ message: 'Error fetching document' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

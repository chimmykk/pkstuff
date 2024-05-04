import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://chimmykk:3KZAwpHiJIhuKHfc@cluster0.34aq0nl.mongodb.net/attendance-admin?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const subjectsList = [
    'English',
    'Python',
    'JavaScript',
    'Data Structures',
    'Cloud Computing',
    'German/Tamil'
];

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, rrn, cgpa, subjects } = req.body;

        try {
            await client.connect();
            const db = client.db('attendance-admin');
            const collection = db.collection('studentsresult');

            const existingStudent = await collection.findOne({ rrn });
            if (existingStudent) {
                return res.status(400).json({ message: 'RRN already exists' });
            }

            // Create an object to hold the subjects' details
            const subjectsObject = {};
            subjectsList.forEach((subject) => {
                const subjectData = subjects[subject];
                if (subjectData) {
                    subjectsObject[subject.toLowerCase().replace(/\s/g, '')] = {
                        grade: subjectData.grade,
                        result: subjectData.result
                    };
                }
            });

            const result = await collection.insertOne({ name, rrn, cgpa, subjects: subjectsObject });
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

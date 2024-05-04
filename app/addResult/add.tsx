"use client"
import { useState } from 'react';

const subjectsList = [
    'English',
    'Python',
    'JavaScript',
    'Data Structures',
    'Cloud Computing',
    'German/Tamil'
];

export default function Add() {
    const [formData, setFormData] = useState<any>({
        name: '',
        rrn: '',
        cgpa: '',
        subjects: subjectsList.reduce((acc, subject) => {
            acc[subject] = { grade: '', result: '' };
            return acc;
        }, {})
    });

    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

    const handleSubjectChange = (subject: string, field: string, value: string) => {
        setFormData({
            ...formData,
            subjects: {
                ...formData.subjects,
                [subject]: {
                    ...formData.subjects[subject],
                    [field]: value
                }
            }
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const resultData = {
                name: formData.name,
                rrn: formData.rrn,
                cgpa: parseFloat(formData.cgpa),
                subjects: formData.subjects
            };

            const resultResponse = await fetch('/api/addresult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resultData)
            });

            if (resultResponse.ok) {
                setShowSuccessAlert(true);
                setFormData({
                    name: '',
                    rrn: '',
                    cgpa: '',
                    subjects: subjectsList.reduce((acc, subject) => {
                        acc[subject] = { grade: '', result: '' };
                        return acc;
                    }, {})
                });
            } else {
                console.error('Failed to add result');
            }
        } catch (error) {
            console.error('Error adding result:', error);
        }
    };

    return (
        <div>
            {showSuccessAlert && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Result added successfully.</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg onClick={() => setShowSuccessAlert(false)} className="fill-current h-6 w-6 text-green-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path
                                fillRule="evenodd"
                                d="M14.348 5.652a.5.5 0 01.707.708l-8.101 8.101a.5.5 0 01-.708-.708l8.102-8.101z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M5.652 5.652a.5.5 0 00-.707.708l8.101 8.101a.5.5 0 00.708-.708L5.652 5.652z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </div>
            )}
            <h1 className='text-lg font-medium mb-8 text-blue-600'>Add Result</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-gray-600">Student Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter Student Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="rrn" className="text-gray-600">RRN</label>
                    <input type="text" id="rrn" name="rrn" placeholder="Enter RRN" value={formData.rrn} onChange={(e) => setFormData({ ...formData, rrn: e.target.value })} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="cgpa" className="text-gray-600">CGPA</label>
                    <input type="text" id="cgpa" name="cgpa" placeholder="Enter CGPA" value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
                </div>
                {subjectsList.map((subject) => (
                    <div key={subject} className='flex flex-col gap-2 ml-6'>
                        <label htmlFor={`grade${subject}`} className="text-gray-600">{subject}</label>
                        <input type="text" id={`grade${subject}`} name={`grade${subject}`} placeholder="Enter Grade" value={formData.subjects[subject].grade} onChange={(e) => handleSubjectChange(subject, 'grade', e.target.value)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
                        <input type="text" id={`result${subject}`} name={`result${subject}`} placeholder="Enter Result" value={formData.subjects[subject].result} onChange={(e) => handleSubjectChange(subject, 'result', e.target.value)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
                    </div>
                ))}
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>
            </form>
        </div>
    );
}

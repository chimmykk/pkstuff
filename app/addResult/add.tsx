
"use client"


import { useState } from 'react';

export default function Add() {
    const [formData, setFormData] = useState<any>({
        name: '',
        rrn: '',
        sgpa: '',
        subjects: [] // Array to store multiple subjects
    });

    const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;

        const newSubjects: { [key: string]: string }[] = [...formData.subjects];

        newSubjects[index][name] = value;
        setFormData({ ...formData, subjects: newSubjects });
    };

    const handleAddSubject = () => {
        setFormData({
            ...formData,
            subjects: [...formData.subjects, { subject: '', grade: '', credit: '', gradePoint: '', result: '' }]
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const resultData = {
                name: formData.name,
                rrn: formData.rrn,
                sgpa: parseFloat(formData.sgpa), // Convert sgpa to number
                subjects: formData.subjects
            };

            const resultResponse = await fetch('https://attendance-app-node.onrender.com/add-result', {
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
                    sgpa: '',
                    subjects: []
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
        <label htmlFor="sgpa" className="text-gray-600">SGPA</label>
        <input type="text" id="sgpa" name="sgpa" placeholder="Enter SGPA" value={formData.sgpa} onChange={(e) => setFormData({ ...formData, sgpa: e.target.value })} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
    </div>
    {formData.subjects.map((subject:any, index:number) => (
        <div key={index} className='flex flex-col gap-2 ml-6'>
            <label htmlFor={`subject${index}`} className="text-gray-600">Subject</label>
            <input type="text" id={`subject${index}`} name="subject" placeholder="Enter Subject" value={subject.subject} onChange={(e) => handleChange(e, index)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
            <label htmlFor={`grade${index}`} className="text-gray-600">Grade</label>
            <input type="text" id={`grade${index}`} name="grade" placeholder="Enter Grade" value={subject.grade} onChange={(e) => handleChange(e, index)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
            <label htmlFor={`credit${index}`} className="text-gray-600">Credit</label>
            <input type="number" id={`credit${index}`} name="credit" placeholder="Enter Credit" value={subject.credit} onChange={(e) => handleChange(e, index)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
            <label htmlFor={`gradePoint${index}`} className="text-gray-600">Grade Point</label>
            <input type="number" id={`gradePoint${index}`} name="gradePoint" placeholder="Enter Grade Point" value={subject.gradePoint} onChange={(e) => handleChange(e, index)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
            <label htmlFor={`result${index}`} className="text-gray-600">Result</label>
            <input type="text" id={`result${index}`} name="result" placeholder="Enter Result" value={subject.result} onChange={(e) => handleChange(e, index)} className="border-b-2 border-gray-300 focus:outline-none bg-transparent  focus:border-blue-500" />
        </div>
    ))}
    <button type="button" onClick={handleAddSubject} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Subject</button>
    <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Submit</button>
</form>

        </div>
    );
}

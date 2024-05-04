"use client"
import { useEffect, useState } from 'react';

interface Student {
    _id?: string;
    id?: string; // Optional since we're adding it manually
    name?: string;
    age?: number;
    // Assuming these are the properties you need to include:
    rrn?: string;
    GuardianGmail?: string;
    phonenumber?: string;
}

export default function List() {
    const [students, setStudents] = useState<Student[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student>({ name: '', rrn: '', GuardianGmail: '' }); // To keep track of the student being edited or added

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const response = await fetch('http://localhost:3000/api/fetchstudent');
        const data = await response.json();
        setStudents(data);
    };

    const handleAddOrUpdateStudent = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const { name, rrn, GuardianGmail, phonenumber } = currentStudent;
        const studentData = { name, rrn, GuardianGmail, phonenumber };

        try {
            const response = await fetch('/api/addstudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                fetchStudents();
                setShowModal(false);
                setEditMode(false);
                setCurrentStudent({});
            } else {
                console.error('Failed to add/update student:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding/updating student:', error);
        }
    };

    const handleEditClick = (student: Student) => {
        // Ensure all required properties are strings
        const studentWithId = {
            id: student._id,
            name: student.name ?? '', // Provide a default empty string if undefined
            rrn: student.rrn ?? 'default-rrn', // Provide a default value if undefined
            GuardianGmail: student.GuardianGmail ?? 'default-contact', // Provide a default value if undefined
        };

        // Now, studentWithId should satisfy the expected type, assuming setCurrentStudent expects a type without optional (undefined) properties
        setCurrentStudent(studentWithId);
        setEditMode(true); // Enable edit mode
        setShowModal(true); // Show the modal for editing
    };

    const handleDeleteStudent = async () => {
        if (currentStudent.id) {
            const response = await fetch(`https://attendance-app-node.onrender.com/delete-student/${currentStudent.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowModal(false); // Close the modal
                setEditMode(false); // Reset edit mode
                setCurrentStudent({ name: '', rrn: '', GuardianGmail: '', phonenumber: '' }); // Reset current student
                fetchStudents(); // Refresh the list to reflect the deletion
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="mb-4">
                    <button
                        onClick={() => { setShowModal(true); setEditMode(false); setCurrentStudent({ name: '', rrn: '', GuardianGmail: '', phonenumber: '' }); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add Student
                    </button>
                </div>
                <div className=" p-4 rounded-lg overflow-x-auto shadow mb-4">
                    {/* Student List as Table */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    RRN
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Guardian's email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Phone Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" ">
                            {students.map((student: Student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rrn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.GuardianGmail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.phonenumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleEditClick(student)} className="text-blue-600 hover:text-blue-900">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Student' : 'Add a New Student'}</h2>
                        <form onSubmit={handleAddOrUpdateStudent} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Student Name"
                                value={currentStudent?.name}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="RRN"
                                value={currentStudent?.rrn}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, rrn: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Guardian's email"
                                value={currentStudent?.GuardianGmail}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, GuardianGmail: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={currentStudent?.phonenumber}
                                onChange={(e) => setCurrentStudent({ ...currentStudent, phonenumber: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <div className="flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                                >
                                    {editMode ? 'Update' : 'Submit'}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteStudent}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition duration-200 mr-2"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditMode(false); setCurrentStudent({ name: '', rrn: '', GuardianGmail: '', phonenumber: '' }); }}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

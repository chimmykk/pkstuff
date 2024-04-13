"use client"
import { useEffect, useState } from 'react';
import { BsPencilSquare } from "react-icons/bs";

interface Student {
    _id?: string;
    id?: string; // Optional since we're adding it manually
    name?: string;
    age?: number;
    // Assuming these are the properties you need to include:
    rrn?: string;
    GuardianGmail?: string;
  }
  

export default function List() {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student>({ name: '', rrn: '', GuardianGmail: '' }); // To keep track of the student being edited or added

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const response = await fetch('https://attendance-app-node.onrender.com/students');
        const data = await response.json();
        setStudents(data);
    };

    const handleAddOrUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Exclude the id field from the data sent to the server
        const { id, ...studentDataWithoutId } = currentStudent as Student;
        const url = editMode ? `https://attendance-app-node.onrender.com/update-student/${id}` : 'https://attendance-app-node.onrender.com/add-student';
        const method = editMode ? 'PUT' : 'POST';
    
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentDataWithoutId),
        });
    
        if (response.ok) {
            setShowModal(false);
            setEditMode(false); // Reset edit mode
            setCurrentStudent({ name: '', rrn: '', GuardianGmail: '' }); // Reset current student
            fetchStudents(); // Refresh the list
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
                setCurrentStudent({ name: '', rrn: '', GuardianGmail: '' }); // Reset current student
                fetchStudents(); // Refresh the list to reflect the deletion
            }
        }
    };
      
    

    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="mb-4">
                    <button
                        onClick={() => { setShowModal(true); setEditMode(false); setCurrentStudent({ name: '', rrn: '', GuardianGmail: '' }); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add Student
                    </button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow mb-4">
    {/* Headings */}
    <div className="grid grid-cols-4 gap-4 py-2 items-center font-bold">
        <div className="col-span-1 text-left">Name</div>
        <div className="col-span-1 text-center">RRN</div>
        <div className="col-span-2 text-right">Guardian's email</div>
    </div>
    {/* Student List Here */}
    {students.map((student: Student) => (
        <div key={student.id} className="grid grid-cols-4 gap-4 py-2 items-center relative">
            <div className="col-span-1 text-left">{student.name}</div>
            <div className="col-span-1 text-center">{student.rrn}</div>
            <div className="col-span-2 flex  gap-2 justify-end text-right">
                <div>
                {student.GuardianGmail}
                </div>
                <button
                onClick={() => handleEditClick(student)}
               className=''
            >
            <BsPencilSquare className='text-soft-blue'/>
            </button>    
            </div>
        </div>
    ))}
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
                                    onClick={() => { setShowModal(false); setEditMode(false); setCurrentStudent({ name: '', rrn: '', GuardianGmail: '' }); }}
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

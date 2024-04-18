
'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define a type for your student objects
interface Student {
  id: number;
  _id: number;
  name: string;
  rrn: string;
  attendance?: string; // Optional because you might not have this information initially
}

interface AttendanceRecord {
  studentId: number;
  status: string;
}

export default function Admin() {
    const [students, setStudents] = useState<Student[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;
    const [tempAttendanceRecords, setTempAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [showModal, setShowModal] = useState(false);
const [submissionStatus, setSubmissionStatus] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setisSubmitted] = useState(false)
const [showTickTooltip, setShowTickTooltip] = useState(false);
const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

    console.log('Temp Attendance Records:', tempAttendanceRecords);

    console.log('students', students)


    useEffect(() => {
        fetchStudents();
        fetchTodaysAttendance();
      }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://attendance-app-node.onrender.com/students'); // Adjust this URL to your API endpoint
      const data = await response.json();
      setStudents(data);
      setIsLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const pageCount = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  console.log('current studnets', currentStudents)

  const markAttendance = (id: number, status: string) => {
    const recordIndex = tempAttendanceRecords.findIndex(record => record.studentId === id);
    if (recordIndex !== -1) {
      const updatedRecords = [...tempAttendanceRecords];
      updatedRecords[recordIndex] = { studentId: id, status };
      setTempAttendanceRecords(updatedRecords);
    } else {
      setTempAttendanceRecords([...tempAttendanceRecords, { studentId: id, status }]);
    }
  };

  const submitAttendance = async () => {
    setIsSubmitting(true); // Start submission, show loading indicator

    const localDate = new Date().toLocaleDateString('en-CA');

    // Map through students to prepare the records
    const attendanceRecords = students.map(student => {
      // Find the attendance record for the current student
      const attendanceRecord = tempAttendanceRecords.find(record => record.studentId === student._id);
      return {
        studentId: student._id, // Include this in your submission
        name: student.name,
        rrn: student.rrn,
        status: attendanceRecord ? attendanceRecord.status : 'absent', // Default to 'absent' if no record is found
        date: localDate, // Include the local date here
      };
    });

     // Count absentees
     const absentees = attendanceRecords.filter(record => record.status === 'absent');
 

    try {
      const response = await fetch('https://attendance-app-node.onrender.com/submit-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceRecords),
      });

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }
       // Simulate a 2-second delay to show loading/spinning
    setTimeout(async () => {
      const result = await response.json();
      console.log('Attendance submitted successfully', result);
      
      setSubmissionStatus('Attendance recorded successfully');
      setShowModal(true); // Show the modal after 2 seconds
      setIsSubmitting(false); // Ensure button re-enables only if an error occurred

      setisSubmitted(true); // Stop showing loading indicator
    }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setIsSubmitting(false); // Ensure button re-enables only if an error occurred
      alert('Failed to submit attendance');
    }


  };

  const fetchTodaysAttendance = async () => {
    try {
      const response = await fetch('https://attendance-app-node.onrender.com/attendance-today');
      const todaysAttendance = await response.json();
      console.log('todays', todaysAttendance);
      // Correctly map and set the tempAttendanceRecords state
      const attendanceRecordsForState = todaysAttendance.map((record: any) => ({
        studentId: record.studentId, // Ensure this matches the student ID field in your attendance records
        status: record.status,
      }));
      setTempAttendanceRecords(attendanceRecordsForState);

       // Check if there are any records for today's date to determine if attendance has already been submitted
    if (todaysAttendance.length > 0) {
        setSubmissionStatus('Attendance for today has been recorded');
        setShowModal(true); // Show modal indicating attendance has been recorded
      }
    
      console.log('todays',todaysAttendance)

    } catch (error) {
      console.error('Failed to fetch today\'s attendance:', error);
      alert('Failed to fetch today\'s attendance');
    }
  };
  

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const today = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });



  return (
    <div className=" mx-auto relative">
      <div className="flex  justify-between gap-10 text-center my-8">
        <h1 className="border-b border-black w-fit text-green-600">Course Name: BCA 2024</h1>
        <p className="border-b text-green-600 border-black w-fit relative">
  {submissionStatus.includes('been recorded') && (
    <span
      style={{ color: 'green' }}
      onMouseEnter={() => setShowTickTooltip(true)}
      onMouseLeave={() => setShowTickTooltip(false)}
    >
      ✓
      {showTickTooltip && (
        <span className="tooltip2">Attendance submitted</span>
      )}
    </span>
  )} 
  {today}
</p>
      </div>
      <div className="hidden sm:flex justify-between items-center my-4">
        <div className="w-1/3 text-left font-semibold">Name</div>
        <div className="w-1/3 text-center font-semibold">RRN</div>
        <div className="w-1/3 text-right font-semibold">STATUS</div>
      </div>
      {isLoading && 
      <div className='flex w-full h-full mt-12 justify-center items-center'>
        <svg viewBox="25 25 50 50" className='svg1'>
          <circle className='circle1' r="20" cy="50" cx="50"></circle>
        </svg>
      </div>} {/* Display loading indicator */}
      {currentStudents.map(student => {
        const attendanceRecord = tempAttendanceRecords.find(record => record.studentId.toString() === student._id.toString());
        const isPresent = attendanceRecord?.status === 'present';
        const isAbsent = attendanceRecord?.status === 'absent';
        return (
          <div key={student.id} className="flex flex-col sm:flex-row justify-between items-center my-2 border-b py-4">
            <div className="w-full sm:w-1/3 text-left mb-2 sm:mb-0">{student.name}</div>
            <div className="w-full sm:w-1/3 text-center mb-2 sm:mb-0">{student.rrn}</div>
            <div className="w-full sm:w-1/3 text-right flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                className={`px-4 py-2 rounded-lg w-full sm:w-auto ${isPresent ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => markAttendance(student._id, 'present')}
                disabled={submissionStatus.includes(' been recorded')}
              >
                Present
              </button>
              <button
                className={`px-4 py-2 rounded-lg w-full sm:w-auto ${isAbsent ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => markAttendance(student._id, 'absent')}
                disabled={submissionStatus.includes(' been recorded')}
              >
                Absent
              </button>
            </div>
          </div>
        );
      })}
      {pageCount === 1 && (
 <div className="relative inline-block"> {/* Wrapper to position the tooltip */}
 <button 
   onClick={submitAttendance}
   disabled={isSubmitting || isSubmitted || submissionStatus.includes('been recorded')}
   className={`px-4 py-2 border  text-white rounded-lg absolute right-0 ${isSubmitting || isSubmitted || submissionStatus.includes('been recorded') ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
 >
   {isSubmitting ? "Submitting..." : "Submit"}
 </button>
</div>

)}
      {pageCount > 1 && (
        <div className="flex justify-between my-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {pageCount}</span>

          {currentPage === pageCount ? (
            <div className="relative w-fit"> {/* Wrapper to position the tooltip */}
            <button 
              onClick={submitAttendance}
              disabled={isSubmitting || isSubmitted || submissionStatus.includes('been recorded')}
              className={`px-4 py-2 text-white rounded-lg absolute right-0 ${isSubmitting || isSubmitted || submissionStatus.includes('been recorded') ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
              
            </button>
          </div>
          
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={goToNextPage}
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          )}
        </div>
      )}
    {showModal && (
  <div className="modal-backdrop">
    <div className="modal px-4 md:p-[20px] py-12 md:px-8 w-10/12 md:w-1/2">
      <h2 className='text-blue-700 mt-8'>Submission Status:</h2>
      <p className='my-4'>{submissionStatus}</p>
      <div className="flex flex-col md:flex-row justify-between"> {/* Adjust layout as needed */}
      
        <Link href={'/attendance-records'} className="px-4 py-1 bg-blue-500 text-white rounded-lg mt-2 text-center" >Check today's attendance</Link>

        <button className="px-4 py-1 bg-red-500 text-white rounded-lg mt-2" onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}

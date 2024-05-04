// pages/student/[name].tsx

import { useRouter } from 'next/router';
import { useState } from 'react';

const StudentDetailsPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const rrn = name;

  const subjects = [
    'English',
    'Python',
    'JavaScript',
    'Data Structures',
    'Cloud Computing',
    'German/Tamil',
  ];

  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});

  const markAttendance = async (subject: string, status: string) => {
    try {
      const res = await fetch('/api/updateattendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rrn,
          subject,
          status,
        }),
      });

      const data = await res.json();
      console.log(data.message);
      
      setAttendance((prevAttendance) => ({
        ...prevAttendance,
        [subject]: status,
      }));

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#89CFF0' }}>Hello Attendance Dashboard of {name}</h1>
      <div className="flex flex-col">
        {subjects.map((subject) => (
          <div key={subject} className="flex justify-between items-center my-2">
            <span>{subject}</span>
            <div className="w-full sm:w-1/3 text-right flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  backgroundColor: attendance[subject] === 'present' ? '#34D399' : '#E5E7EB',
                  color: attendance[subject] === 'present' ? '#FFFFFF' : '#4B5563',
                  border: 'none',
                  marginRight: '0.5rem',
                  pointerEvents: attendance[subject] === 'absent' ? 'none' : 'auto',
                  opacity: attendance[subject] === 'absent' ? 0.5 : 1,
                }}
                onClick={() => markAttendance(subject, 'present')}
                disabled={attendance[subject] === 'absent'}
              >
                Present
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  backgroundColor: attendance[subject] === 'absent' ? '#F87171' : '#E5E7EB',
                  color: attendance[subject] === 'absent' ? '#FFFFFF' : '#4B5563',
                  border: 'none',
                  pointerEvents: attendance[subject] === 'present' ? 'none' : 'auto',
                  opacity: attendance[subject] === 'present' ? 0.5 : 1,
                }}
                onClick={() => markAttendance(subject, 'absent')}
                disabled={attendance[subject] === 'present'}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetailsPage;

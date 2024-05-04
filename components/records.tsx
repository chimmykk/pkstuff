'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  name: string;
  rrn: string;
  status: string;
}

export default function AttendanceRecords() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

  // Fetch available dates
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dates');
        const dates = await response.json();
        setIsLoading(false); // Set loading to false once data is fetched

        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]); // Default to the first available date
        }
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    };

    fetchAvailableDates();
  }, []);

  // Fetch attendance records for the selected date
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!selectedDate) return; // Guard against no selected date

      try {
        const response = await fetch(`http://localhost:3000/api/aggregate`);
        const records = await response.json();
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
    };

    fetchAttendanceRecords();
  }, [selectedDate]);

  // Handler for date selection change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };


  return (
    <main className="">
      <h1 className="text-lg font-medium my-8">Attendance Records</h1>
      <div className="mb-4">
      <div className="relative">
  <select
    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  >
    {availableDates.map(date => (
      <option key={date} value={date}>{date}</option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.707a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1 0 1.414z"/></svg>
  </div>
</div>

      </div>
      <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
          Name
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
          RRN
        </th>
       
      </tr>
    </thead>
    
    <tbody className="bg-white divide-y divide-gray-200">
  {attendanceRecords.map((record, index) => (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex flex-col sm:flex-row justify-between items-center my-2 border-b py-4">
          <div className="w-full sm:w-1/3 text-left mb-2 sm:mb-0">
            <Link href={`/attendance/${encodeURIComponent(record.rrn)}`}>
              <div>{record.name}</div>
            </Link>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {record.rrn}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${record.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
        {record.status}
      </td>
    </tr>
  ))}
</tbody>

  </table>
</div>
{isLoading && 
      <div className='flex w-full h-full mt-12 justify-center items-center'>
        <svg viewBox="25 25 50 50" className='svg1'>
          <circle className='circle1' r="20" cy="50" cx="50"></circle>
        </svg>
      </div>} {/* Display loading indicator */}

    </main>
  );
}

'use client'

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Result() {
  const searchParams = useSearchParams();
  const rrn = searchParams.get("rrn"); // Get RRN from URL parameter

  const [studentResult, setStudentResult] = useState<any>(null); // State to hold the student's result

  useEffect(() => {
    async function fetchStudentResult() {
      try {
        const response = await axios.get(`https://attendance-app-node.onrender.com/result-individual?rrn=${rrn}`);
        setStudentResult(response.data);
      } catch (error) {
        console.error('Error fetching student result:', error);
      }
    }

    if (rrn) {
      fetchStudentResult(); // Fetch the student result if RRN exists
    }
  }, [rrn]);

  return (
    <main className="container mx-auto px-4 py-8">
      {studentResult ? (
        <>
          <h1 className="text-2xl font-semibold mb-4 uppercase">{studentResult.name}</h1>
          <p className=' text-base mb-3'>
            <span className="text-blue-700 font-medium">RRN:</span> <span className='text-black'>{studentResult.rrn}</span>
          </p>
          <p className=' text-base mb-3'>
            <span className="text-blue-700 font-medium">Branch:</span> <span className='text-black'>Cloud Technology and Information Security</span>
          </p>
          <p className=' text-base mb-2'>
            <span className="text-blue-700 font-medium">SGPA:</span> <span className='text-black'>{studentResult.sgpa}</span>
          </p>
          <div className="mt-4">
            {studentResult.subjects?.map((subjectData: any, index: number) => (
             <div key={index} className="border rounded-md p-4 my-4 shadow-md">
             <h3 className="text-lg font-medium text-blue-700 mb-3">{subjectData.subject}</h3>
             <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
               <div className="flex items-center gap-12 md:gap-4">
                 <p className="w-24 text-blue-700">Grade:</p>
                 <p className=''>{subjectData.grade}</p>
               </div>
               <div className="flex items-center gap-12 md:gap-4">
                 <p className="w-24 text-blue-700">Credit:</p>
                 <p>{subjectData.credit}</p>
               </div>
               <div className="flex items-center gap-12 md:gap-4">
                 <p className="w-24 text-blue-700">Grade Point:</p> 
                 <p>{subjectData.gradePoint}</p>
               </div>
               <div className="flex items-center gap-12 md:gap-4">
                 <p className="w-24 text-blue-700">Result:</p>
                 <p className={`${subjectData.result == 'PASS' ? 'text-green-500': 'text-red-500'}`}>{subjectData.result}</p>
               </div>
             </div>
           </div>
           
            ))}
          </div>
        </>
      ) : (
          <div className='flex w-full h-full mt-12 justify-center items-center'>
            <svg viewBox="25 25 50 50" className='svg1'>
              <circle className='circle1' r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
      )}
    </main>
  );
}

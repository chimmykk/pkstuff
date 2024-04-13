
"use client"

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
    <main className="">
      {studentResult ? (
        <>
          <h1 className="text-xl uppercase">{studentResult.name}</h1>
          <p className='text-blue-700 my-2'>RRN: <span className='text-black'>{studentResult.rrn}</span></p>
          <p className='text-blue-700 my-2'>Branch: <span className='text-black'>Cloud Technology and Information Security</span></p>
          <p className='text-blue-700 my-2'>SGPA: <span className='text-black'>{studentResult.sgpa}</span></p>
          <div className="mt-2">
            {studentResult.subjects?.map((subjectData:any, index:number) => ( // Use optional chaining
              <div key={index} className="shadow-md p-4 my-2">
                <h3 className="font-medium text-blue-700">{subjectData.subject}</h3>
                <div className="flex gap-16 my-3 md:gap-32">
                  <p className="flex-shrink-0 w-24">Grade</p>
                  <p>{subjectData.grade}</p>
                </div>
                <div className="flex gap-16 my-3 md:gap-32">
                  <p className="flex-shrink-0 w-24">Credit</p>
                  <p>{subjectData.credit}</p>
                </div>
                <div className="flex gap-16 my-3 md:gap-32">
                  <p className="flex-shrink-0 w-24">Grade Point</p>
                  <p>{subjectData.gradePoint}</p>
                </div>
                <div className="flex gap-16 my-3 md:gap-32">
                  <p className="flex-shrink-0 w-24">Result</p>
                  <p>{subjectData.result}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

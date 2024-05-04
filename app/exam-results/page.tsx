'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

export default function ExamResults() {
  const [results, setResults] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(true); // State variable to track loading status

  console.log('results', results)


  const handleRowClick = (rrn: string) => {
    window.location.href = `/exam-results/result?rrn=${rrn}`;
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(''); // Adjust URL if necessary
        setIsLoading(false); // Set loading to false once data is fetched
        setResults(response.data);
      } catch (error) {
        console.error('', error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="">
      <div className='my-8'>
        <h1 className="text-lg font-medium ">Exam results for BCA 5th sem</h1>
        <h1 className='pb-4 text-gray-700'>(Cloud Technology & Information Security)</h1>
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
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
          SGPA
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {results.map((result:any, index:number) => (
        <tr key={index} className='hover:bg-gray-50 cursor-pointer' onClick={() => handleRowClick(result.rrn)}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <Link
              href={{
                pathname: '/exam-results/result',
                query: { rrn: `${result.rrn}` },
              }}
              className='hover:text-blue-500 w-full'
            >
              {result.name}
            </Link>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {result.rrn}
          </td>
          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600`}>
            {result.sgpa}
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

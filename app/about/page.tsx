
// pages/about.js

import Head from 'next/head';

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>About Us - BCA 5th Semester Class Management System</title>
        <meta name="description" content="Learn more about the BCA 5th Semester Class Management System developed for Crescent Institute of Science and Technology." />
      </Head>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">About The Project</h1>
        <p className="text-gray-700 mb-8">Welcome to the BCA 5th Semester Class Management System developed for Crescent Institute of Science and Technology.</p>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Daily Attendance Recording with Automated Notifications</h2>
            <p className="text-gray-700">Our platform simplifies the process of recording daily attendance for students. In case of absences, automated notifications are sent to guardians, ensuring timely communication.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attendance and Exam Result Viewing</h2>
            <p className="text-gray-700">Users can easily access and view attendance records as well as exam results through dedicated pages on our platform. This feature promotes transparency and facilitates progress tracking.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comprehensive Admin Dashboard for Student Management</h2>
            <p className="text-gray-700">Administrators have access to a comprehensive dashboard for efficient student management. From adding or removing students to updating information and managing exam records, all tasks can be conveniently performed from one centralized location.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Guest Access for Read-Only Functionality</h2>
            <p className="text-gray-700">We offer guest access functionality, allowing external stakeholders to view attendance records and exam results. This read-only access ensures information accessibility without compromising data integrity.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Integrated Assistant Bot for Navigation Assistance</h2>
            <p className="text-gray-700">An integrated assistant bot provides users with navigation assistance throughout the platform. Whether it's finding relevant information or addressing common queries, the bot enhances user experience and ensures smooth navigation.</p>
          </div>
        </div>
        
        <p className="text-gray-700 mt-8">Our platform offers a range of features tailored to the unique needs of the BCA 5th Semester program at Crescent Institute of Science and Technology. Developed to provide transparency, efficiency, and accountability, our system aims to optimize the educational experience for both students and faculty.</p>
      </main>
    </div>
  )
}

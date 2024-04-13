'use client'
import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { redirect } from 'next/navigation';
import { UserIcon, BookIcon, BookCheck,SquarePlus, LogOut } from 'lucide-react';


export default function NavbarChild({session}: any) {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleLogout = async () => {
        setIsDropdownOpen(!isDropdownOpen)
        try {
          const response = await fetch('/api/logout', { method: 'POST' });
          const data = await response.json();
      
          if (response.ok) {
            // Redirect to home or login page on successful logout
            window.location.href = '/';
          } else {
            // Handle non-200 responses (e.g., method not allowed, internal server error)
            console.error('Logout failed:', data.error);
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
      

    return (
        <nav className={`${pathname == '/' ? 'hidden' : 'flex'} items-center ${pathname === '/authentication' || pathname ==='/guest' ? ' justify-center' : 'justify-between'} py-4 border-b`}>
            <Link href={'/'} className="text-lg uppercase font-bold text-blue-600">
                CLASS-STATS
            </Link>
            <div className={` ${pathname === '/authentication' || pathname ==='/guest' ? 'hidden' : ''} relative`}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`  focus:outline-none`}>
                   
                    <svg className="w-6 h-6 text-gray-800" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                {isDropdownOpen && 
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {session && (
                        <Link href="/student-list" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-4 py-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                            <UserIcon className="w-4  h-4 mr-2" />
                            <span >Student list</span>
                        </Link>
                    )}
                    <Link href="/attendance-records" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-4 py-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                        <BookIcon className="w-4 h-4 mr-2" />
                        <span>Attendance Records</span>
                    </Link>
                    <Link href="/exam-results" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-4 py-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                        <BookCheck className="w-4 h-4 mr-2" />
                        <span>Exam results</span>
                    </Link>
                    {session && (
                        <Link href="/addResult" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-4 py-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                            {/* Choose an appropriate Lucide icon */}
                            <SquarePlus className="w-4 h-4 mr-2" />
                            <span>Add result</span>
                        </Link>
                    )}
                    {session && (
                        <h1 onClick={handleLogout} className="flex items-center px-4 py-4 cursor-pointer text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Log Out</span>
                        </h1>
                    )}
                </div>
                
                }
            </div>
        </nav>
    );
}

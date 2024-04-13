
// pages/api/logout.js
import { NextRequest, NextResponse } from 'next/server';
import { logout } from '../../../lib/lib'; // Adjust the path as necessary

export async function POST() {
  try {
    await logout(); // Assuming logout modifies the response to clear cookies
    
    // Return a simple success response without redirecting
    return new NextResponse(JSON.stringify({ message: "Logout successful" }), {
      status: 200, // OK status
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    // Handle any errors that occur during logout
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500, // Internal Server Error
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

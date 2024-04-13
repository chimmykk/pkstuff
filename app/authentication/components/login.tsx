'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function Login({ action }: any) {
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const password = formData.get('password');
  
      setLoading(true); // Set loading state to true while processing login
  
      if (!password) {
        setErrorMessage('Password is required'); // Set error message if password is empty
        setLoading(false); // Reset loading state
        return;
      }
  
      try {
        const loginResult = await action(formData);

        console.log('message : ', loginResult.message)
        if (!loginResult.success) {
          setErrorMessage(loginResult.message || 'An error occurred'); // Set error message received from the server
        } else {
          // Handle successful login
        }
      } catch (error) {
        setErrorMessage('wrong password'); // Set generic error message for other errors
      }
  
      setLoading(false); // Reset loading state after login attempt
    };
  
    return (
      <form onSubmit={handleSubmit} className="grid gap-8">
        <div className="grid gap-8">
          {/* Input field for password */}
          <Input placeholder="Password" type="password" name="password" />
        </div>
        {/* Display error message if any */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {/* Button to submit the form */}
        <Button className=" bg-soft-blue hover:bg-blue-700" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    );
  }
  
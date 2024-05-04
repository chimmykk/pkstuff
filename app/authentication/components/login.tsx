"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login({ action }: any) {
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        const password = formData.get('password');

        setLoading(true); // Set loading state to true while processing login

        if (!username || !password) {
            setErrorMessage('Username and password are required'); // Set error message if username or password is empty
            setLoading(false); // Reset loading state
            return;
        }

        try {
            const loginResult = await action(formData);

            if (!loginResult.success) {
                setErrorMessage(loginResult.message || 'An error occurred'); // Set error message received from the server
            } else {
                // Handle successful login
            }
        } catch (error) {
            setErrorMessage('An error occurred'); // Set generic error message for other errors
        }

        setLoading(false); // Reset loading state after login attempt
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-8">
            <div className="grid gap-8">
                {/* Input field for username */}
                <Input placeholder="Username" type="text" name="username" />
                {/* Input field for password */}
                <Input placeholder="Password" type="password" name="password" />
            </div>
            {/* Display error message if any */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {/* Button to submit the form */}
            <Button className="bg-soft-blue hover:bg-blue-700" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </Button>
        </form>
    );
}

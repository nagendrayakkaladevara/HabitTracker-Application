import React, { useState } from 'react';
import { WavyBackground } from '@/components/ui/wavy-background';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"; // Ensure the correct path to Checkbox
import { Link } from 'react-router-dom';
import { Base_API_URL } from '@/services/AuthService';

const Signup: React.FC = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState('light');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Please fill out all fields');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email address');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
        
            const response = await fetch(`${Base_API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, preferences: { theme, notificationsEnabled } }),
            });

            if (response.ok) {
                // Handle successful response
                console.log('Created successfully!');
                const data = await response.json();
                console.log("🚀 ~ handleSignup ~ data:", data)
              

            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('Error creating habit:', errorData);
            }




            // if (response.status === 201) {
            //     setSuccessMessage(response.message || "Registration successful!");
            //     // Optional: Redirect after successful signup
            //     // Redirect logic can be placed here if needed
            // } else {
            //     // Handle errors based on response
            //     setError(response.message || "Registration failed. Please try again.");
            // }
        } catch (err: any) {
            // Improved error handling to check if response data exists
            setError(err.response?.data?.message || "Failed to sign up. Please check your connection.");
        }
    };

    return (
        <WavyBackground className="h-screen flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>Sign Up</CardTitle>
                    <CardDescription>If you already have an account, <Link to='/login' className="text-blue-400">Login</Link></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className='flex flex-col gap-3'>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password (min. 8 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="theme"
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                            <label
                                htmlFor="theme"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Dark Theme
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="notifications"
                                checked={notificationsEnabled}
                                onCheckedChange={() => setNotificationsEnabled((checked) => (!checked))}
                            />
                            <label
                                htmlFor="notifications"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Enable Notifications
                            </label>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit">Sign Up</Button>
                    </form>
                </CardContent>
            </Card>
        </WavyBackground>
    );
};

export default Signup;

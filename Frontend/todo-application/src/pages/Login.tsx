import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContextTwo';
import { WavyBackground } from '@/components/ui/wavy-background';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Base_API_URL } from '@/services/AuthService';

const Login: React.FC = () => {
    // const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    localStorage.removeItem('NagendraToDoAPPLogingID');

    // Validation function for email format
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validation function for password strength
    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate email and password before making API call
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            // await login(email, password);
            const response = await fetch(`${Base_API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Handle successful response
                console.log('LogIn successfully!');
                setIsSuccessDialogOpen(true);
                const data = await response.json();
                const userId = data.user.id;
                localStorage.setItem('NagendraToDoAPPLogingID', userId);
                // const user = { id: userId, email };
                // login(user);
                console.log('User ID:', userId);
                console.log('Habit created successfully!');
            } else {
                // Handle errors
                const errorData = await response.json();
                console.error('Error creating habit:', errorData);
            }

            // 
            // Redirect or show success message
        } catch (err: any) {
            setError(err.message || 'Failed to log in');
        }
    };

    return (
        <WavyBackground className="h-screen flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>Log In</CardTitle>
                    <CardDescription>No account? <Link to='/signup' className="text-blue-400">Sign Up</Link></CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className='flex flex-col gap-3'>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit">Log In</Button>
                    </form>
                </CardContent>
            </Card>

            <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                {/* <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger> */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Login successful</AlertDialogTitle>
                        <AlertDialogDescription>
                            Welcome to this application! Now you can start being productive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                        <AlertDialogAction><Link to='/home'>Continue</Link></AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </WavyBackground>
    );
};

export default Login;
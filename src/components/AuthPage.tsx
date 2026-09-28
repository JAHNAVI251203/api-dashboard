import React, { FormEvent, useState } from 'react';
import { api, getSafeAuthMessage } from '../services/api';
import { ThemeToggle } from './ThemeToggle';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthPageProps {
    onAuthenticated: () => void;
}

const strongPasswordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
    const [registering, setRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !password) {
            setError('Please fill in your name, email, and password.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setError('Enter a valid email address.');
            return;
        }

        if (registering && !strongPasswordPattern.test(password)) {
            setError('Use at least 8 characters, one capital letter, one number, and one special character.');
            return;
        }

        setLoading(true);

        try {
            const response = registering
                ? await api.register(name, email, password)
                : await api.login(name, email, password);
            sessionStorage.setItem('apiToken', response.data.data.token);
            onAuthenticated();
        } catch (requestError: unknown) {
            setError(getSafeAuthMessage(requestError, registering));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
            <div className="absolute right-4 top-4"><ThemeToggle /></div>
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-[0.08em] text-primary sm:text-5xl">API Sentinel</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Monitor API health, errors and performance from one workspace.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{registering ? 'Create your account' : 'Sign in to your dashboard'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={submit} noValidate className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="auth-name">Name</Label>
                            <Input id="auth-name" required value={name} onChange={event => setName(event.target.value)} autoComplete="name" className="rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="auth-email">Email</Label>
                            <Input id="auth-email" required type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" className="rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="auth-password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="auth-password"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    autoComplete={registering ? 'new-password' : 'current-password'}
                                    className="rounded-none pr-20"
                                />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-none bg-transparent hover:bg-transparent" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        </div>

                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                        <Button type="submit" className="w-full rounded-none" disabled={loading} aria-busy={loading}>
                            {loading ? 'Please wait...' : registering ? 'Create account' : 'Log in'}
                        </Button>
                        <Button type="button" variant="outline" className="w-full rounded-none" onClick={() => setRegistering(value => !value)}>
                            {registering ? 'Already have an account? Log in' : 'New user? Create an account'}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

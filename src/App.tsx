import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import { AuthPage } from './components/AuthPage';

function App() {
    const [authenticated, setAuthenticated] = useState(
        Boolean(sessionStorage.getItem('apiToken'))
    );

    useEffect(() => {
        const handleAuthExpired = () => setAuthenticated(false);
        window.addEventListener('auth-expired', handleAuthExpired);
        return () => window.removeEventListener('auth-expired', handleAuthExpired);
    }, []);

    if (!authenticated) {
        return <AuthPage onAuthenticated={() => setAuthenticated(true)} />;
    }

    return (
        <>
            <Dashboard />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
        </>
    );
}

export default App;

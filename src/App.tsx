import React from 'react';
import { Dashboard } from './components/Dashboard';
import { ToastContainer } from 'react-toastify';

function App() {
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

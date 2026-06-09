import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);
    
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved) {
            setDarkMode(JSON.parse(saved));
        }
    }, []);
    
    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    };
    
    return { darkMode, toggleDarkMode };
};

/*  // Apply in App.tsx
const { darkMode, toggleDarkMode } = useDarkMode();

<div style={{
    background: darkMode ? '#1a1a1a' : '#f5f5f5',
    color: darkMode ? '#fff' : '#000',
    minHeight: '100vh'
}}>
    <button onClick={toggleDarkMode}>
        {darkMode ? '☀️' : '🌙'}
    </button>
    {/* rest of dashboard */


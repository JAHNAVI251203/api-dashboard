import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'api-sentinel-theme';
const modes: ThemeMode[] = ['light', 'dark', 'system'];

const getStoredTheme = (): ThemeMode => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'system' ? stored : 'light';
};

const prefersDark = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (theme: ThemeMode) => {
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);

        if (theme !== 'system' || typeof window.matchMedia !== 'function') return undefined;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => applyTheme(theme);
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    const nextTheme = () => {
        const next = modes[(modes.indexOf(theme) + 1) % modes.length];
        setTheme(next);
    };

    const nextMode = modes[(modes.indexOf(theme) + 1) % modes.length];

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={nextTheme}
            aria-label={`Use ${nextMode} theme. Current theme: ${theme}.`}
        >
            <ThemeIcon theme={theme} />
        </Button>
    );
};

const ThemeIcon: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
    if (theme === 'dark') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5 8.5 8.5 0 1 0 20.5 14.6Z" />
            </svg>
        );
    }

    if (theme === 'system') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="12" rx="1.5" />
                <path d="M8 20h8M12 16v4" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
    );
};

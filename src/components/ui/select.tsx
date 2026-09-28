import React from 'react';
import { cn } from '../../lib/utils';

interface SelectProps {
    id?: string;
    value?: string;
    name?: string;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
    'aria-label'?: string;
}

export const Select: React.FC<SelectProps> = ({
    id,
    value = '',
    name,
    disabled = false,
    className,
    children,
    onValueChange,
    'aria-label': ariaLabel,
}) => {
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const options = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[];
    const selectedIndex = Math.max(0, options.findIndex(option => String(option.props.value) === value));
    const currentIndex = open ? activeIndex : selectedIndex;
    const selectedOption = options[selectedIndex];

    React.useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const openMenu = () => {
        if (disabled) return;
        setActiveIndex(selectedIndex);
        setOpen(true);
    };

    const choose = (index: number) => {
        const nextValue = String(options[index]?.props.value ?? '');
        onValueChange?.(nextValue);
        setOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
                openMenu();
                return;
            }
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex(index => Math.min(Math.max(index + direction, 0), options.length - 1));
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!open) openMenu();
            else choose(activeIndex);
        }

        if (event.key === 'Escape') setOpen(false);
    };

    return (
        <div ref={rootRef} className="relative w-full">
            <input type="hidden" name={name} value={value} />
            <button
                id={id}
                type="button"
                role="combobox"
                aria-label={ariaLabel}
                aria-expanded={open}
                aria-controls={open && id ? `${id}-listbox` : undefined}
                disabled={disabled}
                className={cn(
                    'relative flex h-10 w-full items-center border border-input bg-background px-3 py-2 pr-10 text-left text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={handleKeyDown}
            >
                <span>{selectedOption?.props.children ?? 'Select an option'}</span>
                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m4 6 4 4 4-4" />
                    </svg>
                </span>
            </button>
            {open && (
                <div id={id ? `${id}-listbox` : undefined} role="listbox" className="absolute z-50 mt-1 w-full border border-border bg-card p-1 text-card-foreground shadow-md">
                    {options.map((option, index) => {
                        const optionValue = String(option.props.value ?? '');
                        const selected = optionValue === value;
                        return (
                            <button
                                key={optionValue}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                className={cn('flex w-full items-center px-3 py-2 text-left text-sm outline-none hover:bg-muted focus:bg-muted', selected && 'bg-muted font-medium', index === currentIndex && 'ring-1 ring-inset ring-primary')}
                                onClick={() => choose(index)}
                            >
                                {option.props.children}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

Select.displayName = 'Select';

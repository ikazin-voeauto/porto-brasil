import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-pb-black text-pb-white hover:bg-pb-darkGray focus:ring-pb-black",
        secondary: "bg-pb-white border border-pb-lightGray text-pb-black hover:bg-pb-offWhite focus:ring-pb-gray",
        ghost: "bg-transparent text-pb-gray hover:text-pb-black hover:bg-pb-lightGray/20",
        danger: "bg-ind-error text-pb-white hover:bg-red-800 focus:ring-ind-error",
    };

    const sizes = {
        sm: "h-8 px-3 text-[10px]",
        md: "h-10 px-4 text-xs",
        lg: "h-12 px-6 text-sm", // Touch-friendly
        icon: "h-10 w-10 p-2",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;

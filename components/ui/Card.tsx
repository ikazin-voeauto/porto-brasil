import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`bg-pb-white border border-pb-lightGray rounded-lg shadow-sm ${noPadding ? '' : 'p-6'} ${className}`}>
            {children}
        </div>
    );
};

export default Card;

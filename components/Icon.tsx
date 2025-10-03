
import React from 'react';

interface IconProps {
  name: 'sparkles' | 'image';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const icons = {
    sparkles: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 00-6.364-6.364l-2.096-1.813L0 9l2.096-1.813a4.5 4.5 0 006.364-6.364L9 0l1.813 2.096a4.5 4.5 0 006.364 6.364L18 9l-2.096 1.813a4.5 4.5 0 00-6.364 6.364zM22.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    ),
    image: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    ),
  };

  const getViewBox = (iconName: keyof typeof icons) => {
    switch(iconName) {
        case 'sparkles':
            return '0 0 24 24'
        case 'image':
            return '0 0 24 24'
        default:
            return '0 0 24 24'
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={getViewBox(name)}
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

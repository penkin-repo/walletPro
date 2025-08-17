import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullscreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, fullscreen = false }) => {
  if (!isOpen) return null;

  const containerClasses = fullscreen 
    ? '' 
    : 'flex items-center justify-center p-4';
  
  const contentClasses = fullscreen 
    ? 'w-full h-full'
    : '';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 z-50 ${containerClasses}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`transform transition-all ${contentClasses}`}
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
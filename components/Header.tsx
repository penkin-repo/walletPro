import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface HeaderProps {
  onAddClick: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onSignOut }) => {
  return (
    <header className="flex justify-between items-center py-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tighter text-white">
        Quick<span className="text-indigo-400">Cards</span>
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={onAddClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
          aria-label="Add new card"
        >
          <PlusIcon />
        </button>
        <button
          onClick={onSignOut}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-colors"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
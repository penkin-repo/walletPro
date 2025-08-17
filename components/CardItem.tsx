
import React from 'react';
import { Card } from '../types';

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="aspect-[3/2] rounded-lg p-3 flex flex-col justify-between text-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400"
      style={{ backgroundColor: card.color }}
    >
      {card.imageUrl ? (
        <div className="flex-grow flex items-center justify-center">
            <img src={card.imageUrl} alt={`${card.name} logo`} className="max-h-16 w-auto object-contain mix-blend-screen" />
        </div>
      ) : (
        <div className="flex-grow"></div>
      )}
      <h3 className="font-bold text-lg text-left truncate" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        {card.name}
      </h3>
    </button>
  );
};

export default CardItem;

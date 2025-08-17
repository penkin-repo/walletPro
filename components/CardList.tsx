
import React from 'react';
import { Card } from '../types';
import CardItem from './CardItem';

interface CardListProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onSelectCard }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-300">Your wallet is empty</h2>
        <p className="text-gray-400 mt-2">Click the '+' button to add your first card!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {cards.map(card => (
        <CardItem key={card.id} card={card} onClick={() => onSelectCard(card)} />
      ))}
    </div>
  );
};

export default CardList;

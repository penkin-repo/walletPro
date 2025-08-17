
import React, { useEffect } from 'react';
import { Card } from '../types';
import Modal from './Modal';
import Barcode from './Barcode';
import QRCode from './QRCode';
import XIcon from './icons/XIcon';
import TrashIcon from './icons/TrashIcon';

interface CardDetailProps {
  card: Card;
  onClose: () => void;
  onDelete: (card: Card) => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onClose, onDelete }) => {
    
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDelete = () => {
    onDelete(card);
  }

  return (
    <Modal isOpen={!!card} onClose={onClose} fullscreen={true}>
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-4 relative text-white"
        style={{ backgroundColor: card.color }}
      >
         <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:opacity-80 transition-opacity z-10 p-2 bg-black bg-opacity-20 rounded-full"
            aria-label="Close card detail"
          >
            <XIcon />
        </button>

        <div className="flex flex-col items-center justify-center text-center min-w-[300px] max-w-[95vw] p-4">
            <h2 
                className="text-3xl sm:text-4xl font-bold mb-8"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
                {card.name}
            </h2>
            
            <div className="bg-white p-6 rounded-xl inline-block mb-6 shadow-2xlmax-w-[95vw]">
            {card.isQRCode ? (
                <QRCode value={card.number} />
            ) : (
                <Barcode value={card.number} />
            )}
            </div>

            <p 
                className="text-xl sm:text-2xl font-mono tracking-wider break-all px-4"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
                {card.number}
            </p>
        </div>

        <button
            onClick={handleDelete}
            className="absolute bottom-4 right-4 text-white opacity-70 hover:opacity-100 transition-opacity p-2 bg-black bg-opacity-20 rounded-full"
            aria-label="Delete card"
        >
            <TrashIcon />
        </button>
      </div>
    </Modal>
  );
};

export default CardDetail;

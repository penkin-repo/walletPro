import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import Modal from './Modal';
import XIcon from './icons/XIcon';
import CameraIcon from './icons/CameraIcon';
import Scanner from './Scanner';

interface AddCardFormProps {
  onClose: () => void;
  onAddCard: (card: Omit<Card, 'id' | 'openCount' | 'createdAt' | 'user_id'>) => void;
}

const COLORS = [
  '#4f46e5', '#db2777', '#d97706', '#059669', '#6d28d9', '#2563eb', '#c026d3', '#be123c'
];

const AddCardForm: React.FC<AddCardFormProps> = ({ onClose, onAddCard }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [isQRCode, setIsQRCode] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (!isQRCode && number) {
        const asciiRegex = /^[\x00-\x7F]*$/;
        if (!asciiRegex.test(number)) {
            setNumberError('Barcode supports ASCII characters only (e.g., A-Z, a-z, 0-9, symbols).');
        } else {
            setNumberError(null);
        }
    } else {
        setNumberError(null);
    }
  }, [number, isQRCode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setNumber(decodedText);
    setIsScannerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numberError) return;
    if (!name.trim() || !number.trim()) {
      alert('Please fill in both card name and number.');
      return;
    }
    onAddCard({ name, number, isQRCode, color, imageUrl });
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Add a New Card</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-300">Card Name</label>
                  <input type="text" id="cardName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number / Data</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input type="text" id="cardNumber" value={number} onChange={e => setNumber(e.target.value)} className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    <button type="button" onClick={() => setIsScannerOpen(true)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md" aria-label="Scan code">
                      <CameraIcon />
                    </button>
                  </div>
                  {numberError && <p className="mt-2 text-sm text-red-400" role="alert">{numberError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Code Type</label>
                  <div className="mt-2 flex rounded-md bg-gray-700 p-1">
                    <button type="button" onClick={() => setIsQRCode(false)} className={`w-1/2 rounded-md py-2 text-sm font-medium ${!isQRCode ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>Barcode</button>
                    <button type="button" onClick={() => setIsQRCode(true)} className={`w-1/2 rounded-md py-2 text-sm font-medium ${isQRCode ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>QR Code</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Color</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button type="button" key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`} style={{ backgroundColor: c }} aria-label={`Select color ${c}`}></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="cardImage" className="block text-sm font-medium text-gray-300">Logo Image (Optional)</label>
                  <input type="file" id="cardImage" accept="image/png, image/jpeg, image/svg+xml" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={!!numberError}>Add Card</button>
              </div>
            </form>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close form">
            <XIcon />
          </button>
        </div>
      </Modal>
      {isScannerOpen && (
        <Scanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </>
  );
};

export default AddCardForm;
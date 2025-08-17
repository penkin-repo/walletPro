import React, { useState, useCallback } from 'react';
import { Card } from './types';
import { useCards } from './hooks/useCards';
import Header from './components/Header';
import CardList from './components/CardList';
import CardDetail from './components/CardDetail';
import AddCardForm from './components/AddCardForm';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import { SUPABASE_CONFIG_ERROR } from './lib/supabase';

const SupabaseConfigError: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl p-8 bg-red-900 border border-red-700 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-center mb-4">Configuration Error</h1>
      <p className="text-lg text-center mb-6">
        Your Supabase URL and Key are not configured correctly. The application cannot connect to the database.
      </p>
      <div className="bg-gray-800 p-4 rounded-md">
        <p className="font-mono text-sm">
          Please open the file <code className="bg-gray-700 px-1 py-0.5 rounded">lib/supabase.ts</code> and replace the placeholder values for{' '}
          <code className="bg-gray-700 px-1 py-0.5 rounded">supabaseUrl</code> and{' '}
          <code className="bg-gray-700 px-1 py-0.5 rounded">supabaseAnonKey</code> with your actual Supabase project credentials.
        </p>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  if (SUPABASE_CONFIG_ERROR) {
    return <SupabaseConfigError />;
  }
  
  const { session, user, signOut, loading: authLoading } = useAuth();
  const { cards, addCard, deleteCard, incrementOpenCount, loading: cardsLoading } = useCards(user);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSelectCard = useCallback((card: Card) => {
    incrementOpenCount(card.id);
    setSelectedCard(card);
  }, [incrementOpenCount]);

  const handleCloseDetail = useCallback(() => {
    setSelectedCard(null);
  }, []);
  
  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleAddCard = useCallback((newCardData: Omit<Card, 'id' | 'openCount' | 'createdAt' | 'user_id'>) => {
    addCard(newCardData);
    setIsAddModalOpen(false);
  }, [addCard]);

  const handleDeleteCard = useCallback((cardToDelete: Card) => {
    if (window.confirm(`Are you sure you want to delete the card "${cardToDelete.name}"?`)) {
      deleteCard(cardToDelete.id);
      setSelectedCard(null);
    }
  }, [deleteCard]);
  
  if (authLoading) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-2xl p-4">
        <Header onAddClick={handleOpenAddModal} onSignOut={signOut} />
        <main>
            {cardsLoading ? (
                <div className="text-center py-20 text-gray-400">Loading cards...</div>
            ) : (
                <CardList cards={cards} onSelectCard={handleSelectCard} />
            )}
        </main>
      </div>

      {selectedCard && (
        <CardDetail 
          card={selectedCard} 
          onClose={handleCloseDetail}
          onDelete={handleDeleteCard} 
        />
      )}

      {isAddModalOpen && (
        <AddCardForm 
          onClose={handleCloseAddModal}
          onAddCard={handleAddCard}
        />
      )}
    </div>
  );
};

export default App;
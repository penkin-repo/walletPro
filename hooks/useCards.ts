import { useState, useEffect, useCallback } from 'react';
import { Card } from '../types';
import { supabase, Database } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

type CardRow = Database['public']['Tables']['cards']['Row'];

const mapRowToCard = (row: CardRow): Card => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  number: row.number,
  isQRCode: row.is_qr_code,
  color: row.color,
  imageUrl: row.image_url ?? undefined,
  openCount: row.open_count,
  createdAt: row.created_at,
});

export const useCards = (user: User | null) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    if (!user || !supabase) {
      setCards([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('open_count', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCards(data ? data.map(mapRowToCard) : []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = useCallback(async (newCardData: Omit<Card, 'id' | 'openCount' | 'createdAt' | 'user_id'>) => {
    if (!user || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{ 
          user_id: user.id,
          name: newCardData.name,
          number: newCardData.number,
          is_qr_code: newCardData.isQRCode,
          color: newCardData.color,
          image_url: newCardData.imageUrl ?? null,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Refetch to get the correctly sorted list
        await fetchCards();
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  }, [user, fetchCards]);

  const deleteCard = useCallback(async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setCards(prevCards => prevCards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }, []);

  const incrementOpenCount = useCallback(async (id: string) => {
    if (!supabase) return;
    try {
        const cardToUpdate = cards.find(c => c.id === id);
        if (!cardToUpdate) return;
        
        const newOpenCount = cardToUpdate.openCount + 1;

        // Update local state immediately for better UX
        const updatedCards = cards.map(card =>
            card.id === id ? { ...card, openCount: newOpenCount } : card
        ).sort((a, b) => {
            if (b.openCount !== a.openCount) {
                return b.openCount - a.openCount;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setCards(updatedCards);

        // Aynchronously update the database
        const { error } = await supabase
            .from('cards')
            .update({ open_count: newOpenCount })
            .eq('id', id);

        if (error) {
            console.error('Error incrementing open count:', error);
            // If DB update fails, revert the state
            fetchCards();
        }

    } catch (error) {
        console.error('Error incrementing open count:', error);
    }
  }, [cards, fetchCards]);
  
  return { cards, addCard, deleteCard, incrementOpenCount, loading };
};
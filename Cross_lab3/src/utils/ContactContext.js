import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleContacts } from '../data/contactsData';

const ContactContext = createContext(null);
export const useContacts = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContacts must be used within ContactProvider');
  return ctx;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem('contacts');
      if (stored) setContacts(JSON.parse(stored));
      else {
        setContacts(sampleContacts);
        await AsyncStorage.setItem('contacts', JSON.stringify(sampleContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts:', e);
      setContacts(sampleContacts);
    } finally {
      setLoading(false);
    }
  };

  const saveContacts = async (next) => {
    setContacts(next);
    try { await AsyncStorage.setItem('contacts', JSON.stringify(next)); }
    catch (e) { console.error('Failed to save contacts:', e); }
  };

  const addContact = async (data) => {
    const newContact = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), favorite: false };
    await saveContacts([...contacts, newContact]);
    return newContact;
  };

  const updateContact = async (id, data) => {
    await saveContacts(contacts.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteContact = async (id) => {
    await saveContacts(contacts.filter((c) => c.id !== id));
  };

  const toggleFavorite = async (id) => {
    await saveContacts(contacts.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));
  };

  return (
    <ContactContext.Provider
      value={{ contacts, loading, addContact, updateContact, deleteContact, toggleFavorite, refreshContacts: loadContacts }}
    >
      {children}
    </ContactContext.Provider>
  );
};

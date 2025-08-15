// src/store/authStore.js

import { create } from 'zustand';
import { auth } from '../library/firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // This is the function that was missing!
  initializeAuth: () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'User',
            },
            loading: false,
            error: null,
          });
        } else {
          set({
            user: null,
            loading: false,
            error: null,
          });
        }
      });

      // Return the unsubscribe function so it can be called in useEffect cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        loading: false,
        error: error.message,
      });
      return null;
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // The onAuthStateChanged listener will handle setting the user state
      set({ loading: false });
      return firebaseUser;
    } catch (error) {
      console.error('Login error:', error);
      set({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },

  signup: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // The onAuthStateChanged listener will handle setting the user state
      set({ loading: false });
      return firebaseUser;
    } catch (error) {
      console.error('Signup error:', error);
      set({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await signOut(auth);
      set({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        loading: false,
        error: error.message,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import type { User as AppUser } from '@shared/schema';

// Local storage keys
const LOCAL_USER_KEY = 'homesync_user';
const LOCAL_USERS_KEY = 'homesync_users';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      // Firebase authentication available
      const { onAuthStateChanged } = require('firebase/auth');
      const { doc, getDoc, setDoc } = require('firebase/firestore');

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
        setUser(firebaseUser);
        
        if (firebaseUser && db) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setAppUser(userDoc.data() as AppUser);
            } else {
              const newUser: Partial<AppUser> = {
                email: firebaseUser.email!,
                name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
                firebaseUid: firebaseUser.uid,
                notificationPreferences: {
                  daily: true,
                  weekly: true,
                  critical: true
                }
              };
              
              await setDoc(userDocRef, newUser);
              setAppUser(newUser as AppUser);
            }
          } catch (error) {
            console.warn('Firebase operation failed, using local storage');
            // Fallback to local storage
            const localUser = createLocalUser(firebaseUser.email, firebaseUser.displayName || 'User');
            setAppUser(localUser);
          }
        } else {
          setAppUser(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Local authentication mode
      const savedUser = localStorage.getItem(LOCAL_USER_KEY);
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAppUser(userData);
      }
      setLoading(false);
    }
  }, []);

  const createLocalUser = (email: string, name: string): AppUser => {
    const userId = Date.now().toString();
    const newUser: AppUser = {
      id: parseInt(userId),
      email,
      name,
      firebaseUid: `local_${userId}`,
      phone: null,
      notificationPreferences: {
        daily: true,
        weekly: true,
        critical: true
      },
      createdAt: new Date(),
    };

    // Store in local storage
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
    
    // Add to users list
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    return newUser;
  };

  const login = async (email: string, password: string) => {
    if (auth) {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      return await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Local authentication
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        setUser(user);
        setAppUser(user);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        return Promise.resolve({ user });
      } else {
        throw new Error('User not found');
      }
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (auth && db) {
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      const { doc, setDoc } = require('firebase/firestore');
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userDoc: Partial<AppUser> = {
        email,
        name,
        firebaseUid: user.uid,
        notificationPreferences: {
          daily: true,
          weekly: true,
          critical: true
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      return user;
    } else {
      // Local signup
      const newUser = createLocalUser(email, name);
      setUser(newUser);
      setAppUser(newUser);
      return Promise.resolve({ user: newUser });
    }
  };

  const logout = async () => {
    if (auth) {
      const { signOut } = require('firebase/auth');
      return await signOut(auth);
    } else {
      // Local logout
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
      setAppUser(null);
      return Promise.resolve();
    }
  };

  return {
    user,
    appUser,
    loading,
    login,
    signup,
    logout,
  };
}

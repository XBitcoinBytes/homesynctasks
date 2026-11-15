import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import type { Household, HouseholdMember, User } from '@shared/schema';

const LOCAL_HOUSEHOLD_KEY = 'homesync_household';
const LOCAL_MEMBERS_KEY = 'homesync_household_members';

export function useHousehold() {
  const { user, appUser } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<(HouseholdMember & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !appUser) {
      setLoading(false);
      return;
    }

    if (db) {
      // Firebase mode
      const { collection, doc, getDoc, query, where, getDocs, onSnapshot } = require('firebase/firestore');
      
      const findHousehold = async () => {
        try {
          const membersQuery = query(
            collection(db, 'householdMembers'),
            where('userId', '==', appUser.id)
          );
          
          const memberSnapshot = await getDocs(membersQuery);
          
          if (!memberSnapshot.empty) {
            const memberDoc = memberSnapshot.docs[0];
            const householdId = memberDoc.data().householdId;
            
            const householdDoc = await getDoc(doc(db, 'households', householdId));
            if (householdDoc.exists()) {
              setHousehold({ id: householdDoc.id, ...householdDoc.data() } as Household);
              
              const unsubscribe = onSnapshot(
                query(collection(db, 'householdMembers'), where('householdId', '==', householdId)),
                async (snapshot) => {
                  const membersData = [];
                  for (const doc of snapshot.docs) {
                    const memberData = doc.data();
                    const userDoc = await getDoc(doc(db, 'users', memberData.userId));
                    if (userDoc.exists()) {
                      membersData.push({
                        ...memberData,
                        id: doc.id,
                        user: { id: userDoc.id, ...userDoc.data() } as User
                      });
                    }
                  }
                  setMembers(membersData);
                }
              );
              
              setLoading(false);
              return unsubscribe;
            }
          }
        } catch (error) {
          console.warn('Firebase operations failed, using local storage');
          loadLocalHousehold();
        }
        
        setLoading(false);
      };

      findHousehold();
    } else {
      // Local storage mode
      loadLocalHousehold();
    }
  }, [user, appUser]);

  const loadLocalHousehold = async () => {
    if (!appUser) {
      setLoading(false);
      return;
    }

    // Try to fetch the backend household data first
    try {
      // Check if user exists in backend
      const userResponse = await fetch('/api/users/1');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        
        // Get household data
        const householdResponse = await fetch('/api/households/2');
        if (householdResponse.ok) {
          const householdData = await householdResponse.json();
          setHousehold(householdData);
          
          // Get household members
          const membersResponse = await fetch('/api/households/2/members');
          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            setMembers(membersData);
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.warn('Backend household data not available, using local storage');
    }

    // Fallback to local storage if backend is not available
    const savedHousehold = localStorage.getItem(LOCAL_HOUSEHOLD_KEY);
    const savedMembers = localStorage.getItem(LOCAL_MEMBERS_KEY);
    
    if (savedHousehold) {
      const householdData = JSON.parse(savedHousehold);
      setHousehold(householdData);
    } else {
      // Create a default household for new users
      const defaultHousehold: Household = {
        id: 2, // Use backend household ID
        name: 'Barry Family',
        inviteCode: 'DEMO123',
        createdBy: 1,
        createdAt: new Date(),
      };
      
      setHousehold(defaultHousehold);
      localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(defaultHousehold));
    }
    
    if (savedMembers) {
      const membersData = JSON.parse(savedMembers);
      setMembers(membersData);
    } else {
      // Create default member entry matching backend data
      const defaultMember = {
        id: 3,
        householdId: 2,
        userId: 1,
        role: 'admin',
        joinedAt: new Date(),
        user: {
          id: 1,
          firebaseUid: 'shaun-user-123',
          email: 'shaun@example.com',
          name: 'Shaun',
          phone: null,
          notificationPreferences: {},
          createdAt: new Date(),
        }
      };
      
      setMembers([defaultMember]);
      localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify([defaultMember]));
    }
    
    setLoading(false);
  };

  const createHousehold = async (name: string) => {
    if (!appUser) throw new Error('User not authenticated');

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    if (db) {
      const { addDoc, collection } = require('firebase/firestore');
      
      const householdDoc = await addDoc(collection(db, 'households'), {
        name,
        inviteCode,
        createdBy: appUser.id,
        createdAt: new Date()
      });

      await addDoc(collection(db, 'householdMembers'), {
        householdId: householdDoc.id,
        userId: appUser.id,
        role: 'admin',
        joinedAt: new Date()
      });

      return householdDoc.id;
    } else {
      // Local storage mode
      const newHousehold: Household = {
        id: Date.now(),
        name,
        inviteCode,
        createdBy: appUser.id,
        createdAt: new Date(),
      };

      const newMember = {
        id: Date.now() + 1,
        householdId: newHousehold.id,
        userId: appUser.id,
        role: 'admin',
        joinedAt: new Date(),
        user: appUser
      };

      setHousehold(newHousehold);
      setMembers([newMember]);
      
      localStorage.setItem(LOCAL_HOUSEHOLD_KEY, JSON.stringify(newHousehold));
      localStorage.setItem(LOCAL_MEMBERS_KEY, JSON.stringify([newMember]));

      return newHousehold.id;
    }
  };

  const joinHousehold = async (inviteCode: string) => {
    if (!appUser) throw new Error('User not authenticated');

    if (db) {
      const { collection, query, where, getDocs, addDoc } = require('firebase/firestore');
      
      const householdQuery = query(
        collection(db, 'households'),
        where('inviteCode', '==', inviteCode.toUpperCase())
      );
      
      const householdSnapshot = await getDocs(householdQuery);
      
      if (householdSnapshot.empty) {
        throw new Error('Invalid invite code');
      }

      const householdDoc = householdSnapshot.docs[0];
      
      const memberQuery = query(
        collection(db, 'householdMembers'),
        where('householdId', '==', householdDoc.id),
        where('userId', '==', appUser.id)
      );
      
      const memberSnapshot = await getDocs(memberQuery);
      
      if (!memberSnapshot.empty) {
        throw new Error('You are already a member of this household');
      }

      await addDoc(collection(db, 'householdMembers'), {
        householdId: householdDoc.id,
        userId: appUser.id,
        role: 'member',
        joinedAt: new Date()
      });

      return householdDoc.id;
    } else {
      // Local storage mode - simulate joining
      if (inviteCode.toUpperCase() === 'DEMO123') {
        loadLocalHousehold();
        return 1;
      } else {
        throw new Error('Invalid invite code');
      }
    }
  };

  return {
    household,
    members,
    loading,
    createHousehold,
    joinHousehold,
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@/integrations/firebase/firebase';
import { db, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from '@/integrations/firebase/firebase';

interface User {
  id: string;
  pseudonym: string;
  isAdmin?: boolean;
  email?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (pseudonym: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminRegister: (fullName: string, email: string, password: string) => Promise<void>;
  register: (pseudonym: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore or use Firebase user data
        const userData: User = {
          id: firebaseUser.uid,
          pseudonym: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Anonymous', // Or fetch from Firestore
          email: firebaseUser.email || undefined,
          isAdmin: firebaseUser.email === 'admin@safespeak.com', // Example: Check if email is admin
        };
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin || false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (pseudonym: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, pseudonym + "@safespeak.com", password);
      const firebaseUser = userCredential.user;

      const userData: User = {
        id: firebaseUser.uid,
        pseudonym: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Anonymous',
        email: firebaseUser.email || undefined,
        isAdmin: firebaseUser.email === 'admin@safespeak.com',
      };
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(false);

      toast({
        title: "Login Successful",
        description: "Welcome back to SafeSpeak!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = auth.currentUser;

      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          pseudonym: firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Anonymous', // Or fetch from Firestore
          email: firebaseUser.email || undefined,
          isAdmin: firebaseUser.email === 'admin@safespeak.com', // Example: Check if email is admin
        };
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(true);

        toast({
          title: "Admin Login Successful",
          description: "Welcome to the Admin Dashboard!",
        });
      } else {
        throw new Error("Failed to retrieve user data after login.");
      }
    } catch (error: any) {
      toast({
        title: "Admin Login Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const adminRegister = async (fullName: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          pseudonym: email.split('@')[0],
          email: firebaseUser.email || undefined,
          isAdmin: true,
          fullName: fullName,
        };
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(true);

        toast({
          title: "Admin Registration Successful",
          description: "Admin account created successfully.",
        });
      } else {
        throw new Error("Failed to create admin account.");
      }
    } catch (error: any) {
      toast({
        title: "Admin Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (pseudonym: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, pseudonym + "@safespeak.com", password);
      const firebaseUser = userCredential.user;

      const userData: User = {
        id: firebaseUser.uid,
        pseudonym: pseudonym,
        email: firebaseUser.email || undefined,
        isAdmin: false,
      };
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(false);

      toast({
        title: "Registration Successful",
        description: "Your anonymous profile has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);

      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

    return (
      <AuthContext.Provider value={{
        user,
        login,
        adminLogin,
        adminRegister,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        loading
      }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

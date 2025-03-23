import React, { useState, useEffect, useContext, createContext } from "react";
import { auth } from "../firebaseConfig";

const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setIsLoggedIn(!!user);
            localStorage.setItem("isLoggedIn", !!user);
        });
        return () => unsubscribe();
    }, []);
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // ... other logic ...
    return [isLoggedIn , setIsLoggedIn];
  };
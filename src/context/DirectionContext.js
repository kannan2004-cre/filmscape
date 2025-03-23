import React, { createContext, useState } from 'react';

// Create the DirectionContext
export const DirectionContext = createContext();

// Create a provider component
export const DirectionProvider = ({ children }) => {
  const [direction, setDirection] = useState('ltr'); // Default direction

  return (
    <DirectionContext.Provider value={direction}>
      {children}
    </DirectionContext.Provider>
  );
}; 
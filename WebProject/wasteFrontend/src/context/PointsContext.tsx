import React, { createContext, useContext, useState, ReactNode } from "react";

interface PointsContextType {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}


// Create the context
const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Create a provider component
export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(0);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

// Custom hook to use the context
export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};

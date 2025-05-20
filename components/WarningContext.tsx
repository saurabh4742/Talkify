"use client";
import React, { createContext, useContext, useState } from "react";

interface WarningContextProps {
  warningCount: number;
  setWarningCount: (count: number) => void;
  incrementWarning: () => void;
  resetWarnings: () => void;
}

const WarningContext = createContext<WarningContextProps | undefined>(undefined);

export const WarningProvider = ({ children }: { children: React.ReactNode }) => {
  const [warningCount, setWarningCount] = useState(0);

  const incrementWarning = () => setWarningCount((prev) => prev + 1);
  const resetWarnings = () => setWarningCount(0);

  return (
    <WarningContext.Provider
      value={{ warningCount, setWarningCount, incrementWarning, resetWarnings }}
    >
      {children}
    </WarningContext.Provider>
  );
};

export const useWarning = () => {
  const context = useContext(WarningContext);
  if (!context) throw new Error("useWarning must be used within a WarningProvider");
  return context;
};

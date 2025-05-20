"use client"
import React, { createContext, useContext, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface ContextType {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  isAlone: boolean;
  setisAlone: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyContext = createContext({} as ContextType);

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [room, setRoom] = useState("");
  const[isAlone,setisAlone]=useState(true);

  return (
    <MyContext.Provider value={{ room, setRoom,isAlone,setisAlone }}>
      {children}
      <Toaster />
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);

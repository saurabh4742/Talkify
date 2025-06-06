"use client"
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context.socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const user = useSession().data?.user;
  const [socket, setSocket] = useState<Socket | null>(null);
//https://chat-app-realtime-socketserver.onrender.com
  useEffect(() => {
    if (user?.id) {
      const newSocket = io('https://talkify-socket-server.onrender.com', { autoConnect: false });
      setSocket(newSocket);
      newSocket.connect();
      newSocket.emit("my_joining", user)
      newSocket.on(
        "user_online_status",
        (data: { userId: string;image:string;name:string; status: boolean }) => {
          if (data.status && !(data.userId===user.id)) {
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={data.image}
                        alt="S"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {data.name}
                      </p>
                      <p className="mt-1 text-sm text-green-500">
                        Online Now
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))
          }
        }
      );
      return () => {
        newSocket.off("user_online_status")
        newSocket.off("profile_status")
        newSocket.disconnect();
      };
    }
  }, [ user?.id]);
;

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
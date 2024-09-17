import {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
    useRef,
  } from "react";
  import io, { Socket } from "socket.io-client";
  import { useSelector } from "react-redux";
  import { selectCurrentAuthUser } from "@/redux/auth/authSlice";
  import { ServerUrl } from "@/constants/ApiUrl";
  import { selectCurrentDatingAuthUser } from "@/redux/datingApp/auth/authSlice";
  
  interface ISocketContext {
    socket: Socket | null;
    onlineUsers: string[];
    onlineDatingUsers: string[];
  }
  
  const SocketContext = createContext<ISocketContext | undefined>(undefined);
  
  export const useSocketContext = (): ISocketContext => {
    const context = useContext(SocketContext);
    if (context === undefined) {
      throw new Error(
        "useSocketContext must be used within a SocketContextProvider"
      );
    }
    return context;
  };
  
  const socketURL =
    import.meta.env.MODE === "development" ? `${ServerUrl}` : "/";
  
  const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
  
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [onlineDatingUsers, setOnlineDatingUsers] = useState<string[]>([]);
    const authUser = useSelector(selectCurrentAuthUser);
    const datingAuthUser = useSelector(selectCurrentDatingAuthUser)
  
    useEffect(() => {
      if (authUser) {
        const socket = io(socketURL, {
          query: {
            userId: authUser.id,
          },
        });
        socketRef.current = socket;
  
        socket.on("getOnlineUsers", (users: string[]) => {
          setOnlineUsers(users);
        });
  
        return () => {
          socket.close();
          socketRef.current = null;
        };
      } else if (!authUser) {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      }
    }, [authUser]);
  
  
    useEffect(()=>{
      if(datingAuthUser){
        const socket = io(socketURL, {
          query: {
            datingUserId: datingAuthUser.datingProfileId,
          },
        });
        socketRef.current = socket;
        socket.on("getOnlineDatingUsers",(users: string[]) => {
          setOnlineDatingUsers(users);
        });
        return () => {
          socket.close();
          socketRef.current = null;
        };
      }else{
        if(socketRef.current){
          socketRef.current.close();
          socketRef.current = null;
        }
      }
  
    },[datingAuthUser])
  
    return (
      <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, onlineDatingUsers }}>
        {children}
      </SocketContext.Provider>
    );
  };
  
  export default SocketContextProvider;
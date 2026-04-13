import { createContext, useContext, useState, ReactNode } from "react";

export interface ScanRecord {
  id: string;
  fileName: string;
  date: string;
  overview: string;
  status: "completed" | "processing";
}

interface User {
  email: string;
  scansUsed: number;
}

interface AuthContextType {
  user: User | null;
  scanHistory: ScanRecord[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  incrementScans: () => void;
  addScanRecord: (record: ScanRecord) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);

  const login = async (email , password) => {
    const res = await fetch("http://localhost:8000/api/login",{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data.message || "login failed");
    }
    setUser({
      email: data.email || email,
      scansUsed: data.scanUsed
    })
  };

  const signup = async (email: string, password: string) => {
    const res = await fetch("http://localhost:8000/api/register",{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data.message || "signup failed");
    }
    setUser({ 
      email: data.email || email,
      scansUsed: 0
    })
  };

  const logout = () => setUser(null);

  const incrementScans = () => {
    setUser((prev) => prev ? { ...prev, scansUsed: prev.scansUsed + 1 } : null);
  };

  const addScanRecord = (record: ScanRecord) => {
    setScanHistory((prev) => [record, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ user, scanHistory, login, signup, logout, incrementScans, addScanRecord }}>
      {children}
    </AuthContext.Provider>
  );
};

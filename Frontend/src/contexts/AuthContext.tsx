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

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (!email) throw new Error("Email is required");
    setUser({ email, scansUsed: 0 });
  };

  const signup = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (!email) throw new Error("Email is required");
    setUser({ email, scansUsed: 0 });
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

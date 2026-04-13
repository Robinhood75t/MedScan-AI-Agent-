import { Activity, Menu, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">MedScan AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" onClick={() => navigate("/history")}>
                <History className="w-4 h-4" /> History
              </Button>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" className="rounded-xl" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 flex flex-col gap-2 animate-fade-in">
          {user ? (
            <>
              <Button variant="ghost" className="justify-start text-muted-foreground gap-2" onClick={() => { navigate("/history"); setMobileOpen(false); }}>
                <History className="w-4 h-4" /> History
              </Button>
              <span className="text-sm text-muted-foreground px-4 py-2">{user.email}</span>
              <Button variant="ghost" className="justify-start text-muted-foreground" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="justify-start text-muted-foreground" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Login</Button>
              <Button className="rounded-xl" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Sign Up</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

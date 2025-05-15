import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut, FilePenLine, Clock, MessageSquare, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-trust-chain-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={user ? (user.isAdmin ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2 text-white">
            <Shield className="h-7 w-7 text-trust-chain-blue" />
            <span className="text-xl font-bold">Trust<span className="text-trust-chain-blue">Chain</span></span>
          </Link>
        </motion.div>

        {user && (
          <motion.nav 
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-safespeak-green"></span>
                <span className="text-sm">{user.pseudonym}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.nav>
        )}

        {user && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-safespeak-dark-accent border-l border-white/10">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-safespeak-blue" />
                    <span className="font-semibold">SafeSpeak</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="py-4">
                  <div className="px-3 py-2 bg-white/5 rounded-lg flex items-center gap-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-safespeak-green"></span>
                    <span className="text-sm">Logged in as: {user.pseudonym}</span>
                  </div>
                  
                  <nav className="flex flex-col gap-1">
                  </nav>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Navbar;

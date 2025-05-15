import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {isLoggedIn ? (
          <div className="pt-20">
            <Dashboard />
          </div>
        ) : (
          <Hero />
        )}
        
        {/* Demo Toggle - In a real app, this would be handled with proper auth */}
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="bg-safespeak-blue/90 hover:bg-safespeak-blue px-4 py-2 rounded-full text-sm shadow-lg"
          >
            Toggle Demo: {isLoggedIn ? "View Homepage" : "View Dashboard"}
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

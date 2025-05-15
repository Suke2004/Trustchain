import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackingForm from "@/components/TrackingForm";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const TrackPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-safespeak-green/15 p-3 rounded-full">
                <Eye className="h-8 w-8 text-safespeak-green" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Track Your Report</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Enter your Report ID below to check the current status of your submitted report. 
              Your anonymity remains protected throughout this process.
            </p>
          </div>
          
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrackingForm />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackPage;

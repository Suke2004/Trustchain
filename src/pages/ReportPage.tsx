import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrimeReportForm from "@/components/CrimeReportForm";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const ReportPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-safespeak-blue/15 p-3 rounded-full">
                <Shield className="h-8 w-8 text-safespeak-blue" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Report a Crime</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Submit your anonymous report securely. All submissions are encrypted and stored on 
              blockchain technology for maximum security and privacy.
            </p>
          </div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CrimeReportForm />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportPage;

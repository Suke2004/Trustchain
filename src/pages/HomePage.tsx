import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-trust-chain-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-trust-chain-dark-accent/30 pointer-events-none" />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="container max-w-4xl z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-trust-chain-blue to-trust-chain-green rounded-full blur opacity-70"></div>
              <div className="relative bg-trust-chain-dark p-5 rounded-full">
                <Shield className="h-20 w-20 text-trust-chain-blue" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            Trust<span className="text-trust-chain-blue">Chain</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 text-center mb-16">
            Built by Rukmini and Team
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div 
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-trust-chain-blue/15 p-4 rounded-full mb-4">
                <User className="h-10 w-10 text-trust-chain-blue" />
              </div>
              <h2 className="text-2xl font-bold mb-3">User Access</h2>
              <p className="text-white/70 mb-6">
                Create an anonymous profile and report crimes securely with complete privacy.
              </p>
              <div className="flex flex-col w-full gap-3">
                <Button asChild className="w-full bg-trust-chain-blue hover:bg-trust-chain-blue/90">
                  <Link to="/login">Login</Link>
                </Button>
                {/* REMOVED: Button asChild variant="outline" for Create Anonymous Profile */}
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-trust-chain-green/15 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-trust-chain-green" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Admin Access</h2>
              <p className="text-white/70 mb-6">
                Authorized personnel login to manage and investigate reported cases.
              </p>
              <div className="flex flex-col w-full gap-3">
                <Button asChild className="w-full bg-trust-chain-green hover:bg-trust-chain-green/90">
                  <Link to="/admin-login">Admin Login</Link>
                </Button>
                {/* REMOVED: Button asChild variant="outline" for Register as Admin */}
              </div>
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
              <Lock className="h-4 w-4 text-trust-chain-blue" />
              <span className="text-sm text-white/60">Blockchain Secured | Zero Data Collection | Anonymous Reporting</span>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;

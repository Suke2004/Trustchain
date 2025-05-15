import { Shield, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center pt-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-trust-chain-dark-accent/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-trust-chain-blue to-trust-chain-green rounded-full blur opacity-70"></div>
            <div className="relative bg-trust-chain-dark p-4 rounded-full">
              <Shield className="h-16 w-16 text-trust-chain-blue" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Secure, Anonymous <span className="text-trust-chain-blue">Crime Reporting</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Report crimes securely and anonymously with blockchain-verified records and AI-powered analysis.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link to="/report" className="btn-primary flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            <span>Report a Crime</span>
          </Link>
          <Link to="/track" className="btn-secondary flex items-center justify-center gap-2">
            <Eye className="h-5 w-5" />
            <span>Track Your Report</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <div className="bg-trust-chain-blue/10 p-3 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-trust-chain-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: Shield,
    title: "Fully Anonymous",
    description: "Your identity remains completely private with zero data collection."
  },
  {
    icon: Lock,
    title: "Blockchain Secured",
    description: "All reports are stored on IPFS for tamper-proof record keeping."
  },
  {
    icon: Eye,
    title: "AI Analysis",
    description: "NLP technology automatically categorizes and processes reports."
  }
];

export default Hero;

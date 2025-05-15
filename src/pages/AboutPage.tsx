import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Database, Award, FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">About SafeSpeak</h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              A secure, anonymous crime reporting platform built with blockchain technology and AI assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-white/80 mb-4">
                SafeSpeak is dedicated to empowering citizens to report crimes without fear of reprisal. 
                We believe that everyone has the right to speak up against injustice while maintaining 
                their privacy and security.
              </p>
              <p className="text-white/80">
                By leveraging blockchain technology and artificial intelligence, we've created a platform 
                that ensures anonymity, security, and efficiency in the crime reporting process.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1581093583449-8255a7d46e66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                alt="Security concept" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
              >
                <div className={`p-3 rounded-full mb-4 ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="glass-card rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-safespeak-blue/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-safespeak-blue">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who have already used SafeSpeak to report crimes and make their communities safer.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/report" className="btn-primary">Report a Crime</a>
              <a href="/track" className="btn-secondary">Track Your Report</a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const features = [
  {
    icon: Shield,
    title: "Complete Anonymity",
    description: "Your identity remains fully protected. No personal data is collected or stored.",
    bgColor: "bg-safespeak-blue/15",
    iconColor: "text-safespeak-blue",
  },
  {
    icon: Lock,
    title: "Blockchain Security",
    description: "Reports are stored on IPFS blockchain for tamper-proof record keeping.",
    bgColor: "bg-safespeak-green/15",
    iconColor: "text-safespeak-green",
  },
  {
    icon: Database,
    title: "AI-Powered Analysis",
    description: "Advanced NLP automatically categorizes and processes reports efficiently.",
    bgColor: "bg-purple-500/15",
    iconColor: "text-purple-500",
  },
];

const steps = [
  {
    title: "Submit Report",
    description: "Fill out the anonymous reporting form with details about the incident.",
  },
  {
    title: "AI Processing",
    description: "Our AI system categorizes your report and extracts key information.",
  },
  {
    title: "Secure Storage",
    description: "Your report is encrypted and stored on blockchain technology.",
  },
  {
    title: "Track Progress",
    description: "Use your Report ID to check investigation status anytime.",
  },
];

export default AboutPage;

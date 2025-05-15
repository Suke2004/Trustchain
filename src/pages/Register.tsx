import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import Footer from '@/components/Footer';

const Register = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!pseudonym || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(pseudonym, password);
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.message || "Failed to create your profile";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-safespeak-dark-accent/30 pointer-events-none" />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md w-full glass-card p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* App Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-safespeak-blue" />
              <span className="text-2xl font-bold">Safe<span className="text-safespeak-blue">Speak</span></span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Create Anonymous Profile</h1>
          
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-md mb-4 text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pseudonym">Choose a Pseudonym</Label>
              <Input
                id="pseudonym"
                placeholder="Enter a pseudonym (not your real name)"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="bg-safespeak-dark-accent border-white/10"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-safespeak-dark-accent border-white/10"
                disabled={isLoading}
              />
              <p className="text-xs text-white/50">Must be at least 6 characters long</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-safespeak-dark-accent border-white/10"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-safespeak-green hover:bg-safespeak-green/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">●</span> Creating Profile...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Create Anonymous Profile
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have a profile? <Link to="/login" className="text-safespeak-blue hover:underline">Login</Link>
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import Footer from '@/components/Footer';

const Login = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(pseudonym, password);
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during login');
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
          
          <h1 className="text-2xl font-bold text-center mb-6">Anonymous Login</h1>
          
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-md mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pseudonym">Pseudonym</Label>
              <Input
                id="pseudonym"
                placeholder="Enter your pseudonym"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="bg-safespeak-dark-accent border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-safespeak-dark-accent border-white/10"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 animate-spin" /> Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Login
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an anonymous profile? <Link to="/register" className="text-safespeak-blue hover:underline">Create one</Link>
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

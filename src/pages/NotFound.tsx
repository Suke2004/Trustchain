import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-safespeak-dark p-4">
      <motion.div 
        className="max-w-md w-full text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="bg-white/5 p-6 rounded-full">
            <ShieldAlert className="h-16 w-16 text-safespeak-blue" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-medium mb-2">Page Not Found</h2>
        <p className="text-white/70">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-6">
          <Button asChild className="bg-safespeak-blue hover:bg-safespeak-blue/90">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

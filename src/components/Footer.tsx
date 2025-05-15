import { Shield, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-trust-chain-dark-accent/50 border-t border-white/5 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-trust-chain-blue" />
              <span className="text-lg font-bold">Trust<span className="text-trust-chain-blue">Chain</span></span>
            </Link>
            <p className="text-white/60 text-sm mt-2 max-w-sm">
              Anonymous crime reporting platform secured by blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div>
              <h4 className="font-medium mb-3">Platform</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Connect</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} SafeSpeak. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with privacy & security in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

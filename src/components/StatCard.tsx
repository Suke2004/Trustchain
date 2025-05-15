import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => {
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -5 }}
    >
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-white/70" />
        
        {trend && (
          <div className={`flex items-center ${trend.isPositive ? 'text-safespeak-green' : 'text-red-400'}`}>
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span className="text-xs font-medium">{trend.value}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      <p className="text-white/70 text-sm">{title}</p>
    </motion.div>
  );
};

export default StatCard;

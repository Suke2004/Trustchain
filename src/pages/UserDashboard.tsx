import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FilePenLine, CheckCircle, Clock, BarChart2, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    solvedCases: 0,
    underInvestigation: 0,
    criticalCases: 0
  });

  useEffect(() => {
    // In a real app, this would fetch user's reports from a database
    // For now, we'll check localStorage for any submitted reports
    const storedReports = localStorage.getItem('userReports');
    const parsedReports = storedReports ? JSON.parse(storedReports) : [];
    setReports(parsedReports);
    
    // Calculate stats based on actual reports
    const reportStats = {
      totalReports: parsedReports.length,
      solvedCases: parsedReports.filter(r => r.status === 'resolved').length,
      underInvestigation: parsedReports.filter(r => r.status === 'under-investigation').length,
      criticalCases: parsedReports.filter(r => r.priority === 'urgent' || r.priority === 'high').length
    };
    
    setStats(reportStats);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome, {user?.pseudonym}</h1>
            <p className="text-white/70">Your anonymous dashboard for crime reporting and tracking.</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Reports" 
              value={stats.totalReports.toString()} 
              icon={FilePenLine} 
              trend={stats.totalReports > 0 ? { value: stats.totalReports, isPositive: true } : undefined}
            />
            <StatCard 
              title="Cases Solved" 
              value={stats.solvedCases.toString()} 
              icon={CheckCircle} 
              trend={stats.solvedCases > 0 ? { value: stats.solvedCases, isPositive: true } : undefined}
            />
            <StatCard 
              title="Under Investigation" 
              value={stats.underInvestigation.toString()} 
              icon={Clock} 
              trend={undefined}
            />
            <StatCard 
              title="Critical Cases" 
              value={stats.criticalCases.toString()} 
              icon={ShieldAlert} 
              trend={undefined}
            />
          </div>
          
          {/* Case Resolution Progress */}
          <motion.div 
            className="glass-card rounded-2xl p-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Case Resolution Progress</h3>
              {reports.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs">
                  <BarChart2 className="h-4 w-4 mr-1" /> View Detailed Stats
                </Button>
              )}
            </div>
            
            {reports.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Cases Solved</div>
                    <div className="text-sm text-white/70">
                      {stats.totalReports > 0 
                        ? Math.round(stats.solvedCases / stats.totalReports * 100)
                        : 0}%
                    </div>
                  </div>
                  <Progress 
                    value={stats.totalReports > 0 
                      ? Math.round(stats.solvedCases / stats.totalReports * 100)
                      : 0
                    } 
                    className="h-2 bg-white/10" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Under Investigation</div>
                    <div className="text-sm text-white/70">
                      {stats.totalReports > 0 
                        ? Math.round(stats.underInvestigation / stats.totalReports * 100)
                        : 0}%
                    </div>
                  </div>
                  <Progress 
                    value={stats.totalReports > 0 
                      ? Math.round(stats.underInvestigation / stats.totalReports * 100)
                      : 0
                    } 
                    className="h-2 bg-white/10" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Critical Cases</div>
                    <div className="text-sm text-white/70">
                      {stats.totalReports > 0 
                        ? Math.round(stats.criticalCases / stats.totalReports * 100)
                        : 0}%
                    </div>
                  </div>
                  <Progress 
                    value={stats.totalReports > 0 
                      ? Math.round(stats.criticalCases / stats.totalReports * 100)
                      : 0
                    } 
                    className="h-2 bg-white/10" 
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50">No reports submitted yet. Submit your first report to see statistics.</p>
              </div>
            )}
          </motion.div>
          
          {/* View Submitted Reports Section */}
          <motion.div
            className="glass-card rounded-2xl p-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Your Submitted Reports</h3>
            
            {reports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-white/60 border-b border-white/10">
                      <th className="p-4 font-medium text-sm">Report ID</th>
                      <th className="p-4 font-medium text-sm">Type</th>
                      <th className="p-4 font-medium text-sm">Date</th>
                      <th className="p-4 font-medium text-sm">Status</th>
                      <th className="p-4 font-medium text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4 font-mono text-sm">{report.id}</td>
                        <td className="p-4">{report.crimeType}</td>
                        <td className="p-4 text-sm text-white/70">{report.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            report.status === 'resolved' ? 'bg-safespeak-green/20 text-safespeak-green' :
                            report.status === 'under-investigation' ? 'bg-safespeak-blue/20 text-safespeak-blue' :
                            'bg-amber-500/20 text-amber-500'
                          }`}>
                            {report.status === 'resolved' ? 'Resolved' :
                             report.status === 'under-investigation' ? 'Under Investigation' :
                             'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link to={`/track/${report.id}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50">You haven't submitted any reports yet.</p>
                <Link to="/report">
                  <Button className="mt-4">Submit Your First Report</Button>
                </Link>
              </div>
            )}
          </motion.div>
          
          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="glass-card rounded-2xl p-6 text-center flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-safespeak-blue/15 p-4 rounded-full mb-4">
                <FilePenLine className="h-8 w-8 text-safespeak-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Report a Crime</h3>
              <p className="text-white/70 text-sm mb-4">Submit a new anonymous crime report securely.</p>
              <Link to="/report" className="btn-primary w-full">Report Now</Link>
            </motion.div>
            
            <motion.div 
              className="glass-card rounded-2xl p-6 text-center flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-safespeak-green/15 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-safespeak-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track a Report</h3>
              <p className="text-white/70 text-sm mb-4">Check the status of your previously submitted report.</p>
              <Link to="/track" className="btn-secondary w-full">Track Report</Link>
            </motion.div>
            
            <motion.div 
              className="glass-card rounded-2xl p-6 text-center flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-purple-500/15 p-4 rounded-full mb-4">
                <ShieldAlert className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Give Feedback</h3>
              <p className="text-white/70 text-sm mb-4">Share your experience with SafeSpeak.</p>
              <Link to="/feedback" className="btn-ghost w-full">Provide Feedback</Link>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;

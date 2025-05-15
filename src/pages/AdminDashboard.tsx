import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, FileText, CheckCircle, AlertTriangle, 
  Clock, MessageSquare, BarChart2, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CaseManagement from '@/components/admin/CaseManagement';
import FeedbackReview from '@/components/admin/FeedbackReview';
import CriticalCases from '@/components/admin/CriticalCases';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { db, collection, getDocs, query, where } from '@/integrations/firebase/firebase';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsCollection = collection(db, "reports");
        const querySnapshot = await getDocs(reportsCollection);
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({
          title: "Error",
          description: "Failed to fetch reports from the database.",
          variant: "destructive",
        });
      }
    };
    
    const fetchFeedback = async () => {
      try {
        const feedbackCollection = collection(db, "feedback");
        const querySnapshot = await getDocs(feedbackCollection);
        const feedbackData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedback(feedbackData as Feedback[]);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast({
          title: "Error",
          description: "Failed to fetch feedback from the database.",
          variant: "destructive",
        });
      }
    };
    
    fetchReports();
    fetchFeedback();
  }, []);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Calculate stats based on actual reports
  const totalReports = reports.length;
  const solvedReports = reports.filter(r => r.status === 'resolved').length;
  const criticalReports = reports.filter(r => r.priority === 'urgent' || r.priority === 'high').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  
  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-safespeak-green/15 p-2 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-safespeak-green" />
                </div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
            <p className="text-white/70">Manage and track anonymous crime reports and user feedback.</p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div 
              className="glass-card p-4 rounded-xl flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/10 p-3 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/70">Total Reports</p>
                <p className="text-2xl font-bold">{totalReports}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 rounded-xl flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-safespeak-green/15 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5 text-safespeak-green" />
              </div>
              <div>
                <p className="text-sm text-white/70">Solved Cases</p>
                <p className="text-2xl font-bold">{solvedReports}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 rounded-xl flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-amber-500/15 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-white/70">Pending Review</p>
                <p className="text-2xl font-bold">{pendingReports}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 rounded-xl flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="bg-red-500/15 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-white/70">Critical Cases</p>
                <p className="text-2xl font-bold">{criticalReports}</p>
              </div>
            </motion.div>
          </div>
          
          {/* Progress Overview */}
          <motion.div 
            className="glass-card rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Case Progress Overview</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Export Analytics
              </Button>
            </div>
            
            {totalReports > 0 ? (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Solved</p>
                    <p className="text-sm text-white/70">
                      {(solvedReports / totalReports * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Progress value={solvedReports / totalReports * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Under Investigation</p>
                    <p className="text-sm text-white/70">
                      {(reports.filter(r => r.status === 'under-investigation').length / totalReports * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Progress 
                    value={reports.filter(r => r.status === 'under-investigation').length / totalReports * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Pending Review</p>
                    <p className="text-sm text-white/70">
                      {(pendingReports / totalReports * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Progress value={pendingReports / totalReports * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Critical Cases</p>
                    <p className="text-sm text-white/70">
                      {(criticalReports / totalReports * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Progress value={criticalReports / totalReports * 100} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50">No reports have been submitted yet.</p>
              </div>
            )}
          </motion.div>
          
          {/* Main Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="cases">
              <TabsList className="mb-6">
                <TabsTrigger value="cases" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>Case Management</span>
                </TabsTrigger>
                <TabsTrigger value="critical" className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Critical Cases</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>User Feedback</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cases">
                <CaseManagement allReports={reports} />
              </TabsContent>
              
              <TabsContent value="critical">
                <CriticalCases />
              </TabsContent>
              
              <TabsContent value="feedback">
                <FeedbackReview />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;

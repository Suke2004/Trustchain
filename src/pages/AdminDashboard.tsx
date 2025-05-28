import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  BarChart2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CaseManagement from "@/components/admin/CaseManagement";
import FeedbackReview from "@/components/admin/FeedbackReview";
import CriticalCases from "@/components/admin/CriticalCases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db, collection, getDocs } from "@/integrations/firebase/firebase";

// Type definition
interface Feedback {
  id: string;
  message: string;
  timestamp: string;
  userId?: string;
  rating?: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reports, setReports] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const feedbackSnapshot = await getDocs(collection(db, "feedback"));

        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const feedbackData = feedbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Feedback[];

        setReports(reportsData);
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data from the database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const totalReports = reports.length;
  const solvedReports = reports.filter((r) => r.status === "resolved").length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const criticalReports = reports.filter((r) =>
    ["urgent", "high"].includes((r.priority || "").toLowerCase())
  ).length;

  return (
    <div className='min-h-screen flex flex-col bg-safespeak-dark'>
      <Navbar />

      <main className='flex-1 pt-20 pb-12'>
        <div className='container mx-auto px-4'>
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-safespeak-green/15 p-2 rounded-full'>
                  <ShieldCheck className='h-6 w-6 text-safespeak-green' />
                </div>
                <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
              </div>
              <Button variant='outline' size='sm' onClick={handleLogout}>
                <LogOut className='h-4 w-4 mr-1' />
                Logout
              </Button>
            </div>
            <p className='text-white/70'>
              Manage and track anonymous crime reports and user feedback.
            </p>
          </div>

          {loading ? (
            <div className='text-center py-24'>
              <p className='text-white/60 text-lg animate-pulse'>
                Loading Dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                {[
                  {
                    icon: <FileText />,
                    label: "Total Reports",
                    value: totalReports,
                  },
                  {
                    icon: <CheckCircle className='text-safespeak-green' />,
                    label: "Solved Cases",
                    value: solvedReports,
                  },
                  {
                    icon: <Clock className='text-amber-500' />,
                    label: "Pending Review",
                    value: pendingReports,
                  },
                  {
                    icon: <AlertTriangle className='text-red-500' />,
                    label: "Critical Cases",
                    value: criticalReports,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className='glass-card p-4 rounded-xl flex items-center gap-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}>
                    <div className='bg-white/10 p-3 rounded-lg'>
                      {stat.icon}
                    </div>
                    <div>
                      <p className='text-sm text-white/70'>{stat.label}</p>
                      <p className='text-2xl font-bold'>{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress Overview */}
              <motion.div
                className='glass-card rounded-xl p-6 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold'>
                    Case Progress Overview
                  </h2>
                  <Button variant='outline' size='sm'>
                    <BarChart2 className='h-4 w-4 mr-1' />
                    Export Analytics
                  </Button>
                </div>

                {totalReports > 0 ? (
                  <div className='space-y-5'>
                    {[
                      {
                        label: "Solved",
                        value: solvedReports,
                      },
                      {
                        label: "Under Investigation",
                        value: reports.filter(
                          (r) => r.status === "under-investigation"
                        ).length,
                      },
                      {
                        label: "Pending Review",
                        value: pendingReports,
                      },
                      {
                        label: "Critical Cases",
                        value: criticalReports,
                      },
                    ].map((item) => {
                      const percent = (
                        (item.value / totalReports) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={item.label}>
                          <div className='flex justify-between mb-2'>
                            <p className='text-sm font-medium'>{item.label}</p>
                            <p className='text-sm text-white/70'>{percent}%</p>
                          </div>
                          <Progress
                            value={parseFloat(percent)}
                            className='h-2'
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className='text-center text-white/60 py-10'>
                    No reports available to analyze yet.
                  </p>
                )}
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <Tabs defaultValue='cases'>
                  <TabsList className='mb-6 overflow-x-auto whitespace-nowrap flex gap-2 px-1 scrollbar-hide'>
                    <TabsTrigger
                      value='cases'
                      className='min-w-[140px] flex items-center gap-1.5'>
                      <FileText className='h-4 w-4' />
                      Case Management
                    </TabsTrigger>
                    <TabsTrigger
                      value='critical'
                      className='min-w-[140px] flex items-center gap-1.5'>
                      <AlertTriangle className='h-4 w-4' />
                      Critical Cases
                    </TabsTrigger>
                    <TabsTrigger
                      value='feedback'
                      className='min-w-[140px] flex items-center gap-1.5'>
                      <MessageSquare className='h-4 w-4' />
                      User Feedback
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value='cases'>
                    <CaseManagement allReports={reports} />
                  </TabsContent>
                  <TabsContent value='critical'>
                    <CriticalCases allReports={reports} />
                  </TabsContent>
                  <TabsContent value='feedback'>
                    <FeedbackReview allFeedback={feedback} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

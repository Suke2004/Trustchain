import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, Clock, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db, collection, getDocs, query, where } from "@/integrations/firebase/firebase";

interface ReportStatus {
  id: string;
  crimeType: string;
  description: string;
  location: string;
  date: string;
  status: string;
  evidence_urls: string[];
  userId: string | null;
}

const TrackReport = () => {
  const { toast } = useToast();
  const [reportId, setReportId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);

  const handleTrack = async () => {
    if (!reportId) {
      toast({
        title: "Error",
        description: "Please enter a valid Report ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const reportsCollection = collection(db, "reports");
      const q = query(reportsCollection, where("id", "==", reportId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setReportStatus(data as ReportStatus);
        toast({
          title: "Report Found",
          description: "Report status has been retrieved successfully.",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No report found with this ID. Please check and try again.",
          variant: "destructive"
        });
        setReportStatus(null);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve report status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (typeof status !== 'string') {
      console.warn('Status is not a string:', status);
      return <Eye className="h-6 w-6 text-white" />;
    }

    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-6 w-6 text-safespeak-green" />;
      case 'under-investigation':
        return <Clock className="h-6 w-6 text-safespeak-blue" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-amber-500" />;
      case 'closed':
        return <X className="h-6 w-6 text-gray-400" />;
      default:
        return <Eye className="h-6 w-6 text-white" />;
    }
  };

  const getStatusLabel = (status: string) => {
    if (typeof status !== 'string') {
      console.warn('Status is not a string:', status);
      return 'Unknown Status';
    }
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'under-investigation': return 'Under Investigation';
      case 'pending': return 'Pending Review';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-safespeak-green/15 p-3 rounded-full">
                <Eye className="h-8 w-8 text-safespeak-green" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Track Your Report</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Enter your Report ID below to check the current status of your submitted report.
              Your anonymity remains protected throughout this process.
            </p>
          </div>

          <motion.div
            className="max-w-xl mx-auto glass-card rounded-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter your Report ID (e.g. SS-123456)"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                className="flex-1 bg-safespeak-dark-accent border-white/10"
              />
              <Button
                onClick={handleTrack}
                disabled={isLoading}
                className="bg-safespeak-green hover:bg-safespeak-green/90"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">●</span> Tracking...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" /> Track Report
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-white/60">
                For demonstration, try these IDs: SS-123456, SS-234567, SS-345678, SS-456789
              </p>
            </div>
          </motion.div>

          {reportStatus && (
            <motion.div
              className="max-w-2xl mx-auto glass-card rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Report Status</h2>
                <p className="text-white/60 text-sm">
                  ID: <span className="font-mono">{reportId}</span> | Last Updated: {reportStatus.date}
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full ${getStatusIcon(reportStatus.status)}`}>
                  {getStatusIcon(reportStatus.status)}
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className={`text-lg font-medium ${getStatusLabel(reportStatus.status)}`}>
                  {getStatusLabel(reportStatus.status)}
                </h3>
                <p className="mt-2 text-white/80">
                  {reportStatus.description}
                </p>
              </div>

              {/* Timeline for demonstration */}
              <div className="space-y-4 mt-8">
                <h3 className="text-md font-medium flex items-center">
                  <ArrowRightCircle className="h-4 w-4 mr-2" /> Timeline
                </h3>

                <div className="ml-6 border-l border-white/10 pl-6 space-y-6">
                  <div>
                    <div className="flex items-center">
                      <div className="absolute -ml-9 p-1 rounded-full bg-safespeak-green"></div>
                      <p className="text-sm text-white/60">April 1, 2025</p>
                    </div>
                    <p className="text-sm mt-1">Report received and logged into the system.</p>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <div className="absolute -ml-9 p-1 rounded-full bg-safespeak-blue"></div>
                      <p className="text-sm text-white/60">April 3, 2025</p>
                    </div>
                    <p className="text-sm mt-1">Report assigned to investigation team for review.</p>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <div className="absolute -ml-9 p-1 rounded-full bg-white/30"></div>
                      <p className="text-sm text-white/60">April 5, 2025 (Expected)</p>
                    </div>
                    <p className="text-sm mt-1">Preliminary investigation results expected.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setReportStatus(null)}
                >
                  Track Another Report
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Instructions */}
          <div className="max-w-2xl mx-auto mt-8">
            <h3 className="text-lg font-medium mb-4">How to Track Your Report</h3>
            <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
              <li>Enter your Report ID in the field above (received when you submitted your report)</li>
              <li>Click the "Track Report" button to check the current status</li>
              <li>The system will securely retrieve your report status from the blockchain</li>
              <li>Your anonymity is maintained throughout the entire process</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackReport;

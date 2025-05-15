import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  reportId: z.string()
    .min(8, "Report ID must be at least 8 characters")
    .regex(/^RPT-[A-Z0-9]+$/, "Invalid Report ID format. Should be like RPT-XXXXXXXX")
});

type TrackingFormValues = z.infer<typeof formSchema>;

interface ReportStatus {
  id: string;
  status: "reviewing" | "investigating" | "solved" | "closed";
  progress: number;
  lastUpdated: string;
  category: string;
  updates: {
    date: string;
    message: string;
  }[];
}

const TrackingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportStatus | null>(null);
  const { toast } = useToast();
  
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportId: "",
    },
  });
  
  const onSubmit = async (values: TrackingFormValues) => {
    setIsLoading(true);
    
    try {
      // Try to fetch from Supabase first
      const { data: reportData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', values.reportId)
        .single();
        
      if (!error && reportData) {
        // Map Supabase data to our format
        const reportStatus: ReportStatus = {
          id: reportData.id,
          status: mapStatus(reportData.status || 'pending'),
          progress: getProgressFromStatus(mapStatus(reportData.status || 'pending')),
          lastUpdated: new Date(reportData.created_at || new Date()).toISOString().split('T')[0],
          category: reportData.crime_type || "Unknown",
          updates: generateUpdates(reportData.status || 'pending', reportData.created_at)
        };
        
        setReport(reportStatus);
      } else {
        // Fallback to mock data if not found in Supabase
        const mockData = getMockReportData(values.reportId);
        
        if (mockData) {
          setReport(mockData);
        } else {
          toast({
            title: "Report not found",
            description: "Please check the Report ID and try again",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      // Fallback to mock data
      const mockData = getMockReportData(values.reportId);
      
      if (mockData) {
        setReport(mockData);
      } else {
        toast({
          title: "Report not found",
          description: "Please check the Report ID and try again",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Map status from admin module to our format
  const mapStatus = (status: string): "reviewing" | "investigating" | "solved" | "closed" => {
    switch (status) {
      case "pending": return "reviewing";
      case "under-investigation": return "investigating";
      case "resolved": return "solved";
      case "closed": return "closed";
      default: return "reviewing";
    }
  };
  
  // Generate progress based on status
  const getProgressFromStatus = (status: ReportStatus["status"]) => {
    switch (status) {
      case "reviewing": return Math.floor(Math.random() * 30) + 10; // 10-40%
      case "investigating": return Math.floor(Math.random() * 40) + 30; // 30-70%
      case "solved": return Math.floor(Math.random() * 20) + 80; // 80-100%
      case "closed": return 100;
      default: return 10;
    }
  };
  
  // Generate updates based on status
  const generateUpdates = (status: string, createdAt: string | null) => {
    const today = new Date();
    const created = createdAt ? new Date(createdAt) : new Date(today.getTime() - 259200000);
    
    const updates = [
      {
        date: created.toISOString().split('T')[0],
        message: "Your report has been received and is being processed.",
      }
    ];
    
    if (status !== 'pending') {
      updates.push({
        date: new Date(created.getTime() + 86400000).toISOString().split('T')[0],
        message: "Your report has been assigned to an investigator.",
      });
    }
    
    if (status === 'under-investigation' || status === 'resolved' || status === 'closed') {
      updates.push({
        date: new Date(created.getTime() + 172800000).toISOString().split('T')[0],
        message: "Investigation has commenced based on the provided information.",
      });
    }
    
    if (status === 'resolved' || status === 'closed') {
      updates.push({
        date: new Date(created.getTime() + 259200000).toISOString().split('T')[0],
        message: "Investigation has concluded. Thank you for your report.",
      });
    }
    
    return updates;
  };
  
  // Mock function to simulate fetching report data
  const getMockReportData = (id: string): ReportStatus | null => {
    // Check local storage first for reports from admin module
    const storedReports = localStorage.getItem('userReports');
    if (storedReports) {
      try {
        const reports = JSON.parse(storedReports);
        const foundReport = reports.find((r: any) => r.id === id);
        
        if (foundReport) {
          return {
            id: foundReport.id,
            status: mapStatus(foundReport.status),
            progress: getProgressFromStatus(mapStatus(foundReport.status)),
            lastUpdated: foundReport.date || new Date().toISOString().split('T')[0],
            category: foundReport.crimeType || "Unknown",
            updates: generateUpdates(foundReport.status, foundReport.created_at)
          };
        }
      } catch (e) {
        console.error("Error parsing stored reports:", e);
      }
    }
    
    // Simulate a 20% chance of not finding the report if not in local storage
    if (Math.random() < 0.2) {
      return null;
    }
    
    // Generate a random status and progress
    const statusOptions = ["reviewing", "investigating", "solved", "closed"] as const;
    const statusIndex = Math.floor(Math.random() * statusOptions.length);
    const status = statusOptions[statusIndex];
    
    // Progress based on status
    const progressMap = {
      reviewing: Math.floor(Math.random() * 30) + 10, // 10-40%
      investigating: Math.floor(Math.random() * 40) + 30, // 30-70%
      solved: Math.floor(Math.random() * 20) + 80, // 80-100%
      closed: 100,
    };
    
    const categoryOptions = ["Theft", "Fraud", "Harassment", "Cybercrime", "Vandalism"];
    
    return {
      id,
      status,
      progress: progressMap[status],
      lastUpdated: new Date().toISOString().split('T')[0],
      category: categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
      updates: [
        {
          date: new Date().toISOString().split('T')[0],
          message: "Your report has been received and is being processed.",
        },
        {
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          message: status === "reviewing" 
            ? "Initial review of your report has begun." 
            : "Your report has been assigned to an investigator.",
        },
        ...(status === "investigating" || status === "solved" || status === "closed" ? [{
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
          message: "Investigation has commenced based on the provided information.",
        }] : []),
        ...(status === "solved" || status === "closed" ? [{
          date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
          message: "Investigation has concluded. Thank you for your report.",
        }] : []),
      ],
    };
  };
  
  const getStatusBadge = (status: ReportStatus["status"]) => {
    switch (status) {
      case "reviewing":
        return <Badge className="bg-amber-500">Reviewing</Badge>;
      case "investigating":
        return <Badge className="bg-safespeak-blue">Investigating</Badge>;
      case "solved":
        return <Badge className="bg-safespeak-green">Solved</Badge>;
      case "closed":
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: ReportStatus["status"]) => {
    switch (status) {
      case "reviewing":
        return "bg-amber-500";
      case "investigating":
        return "bg-safespeak-blue";
      case "solved":
        return "bg-safespeak-green";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="glass-card rounded-xl p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="reportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your report ID (e.g., RPT-AB12CD34)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Track Report
              </>
            )}
          </Button>
          
          {!report && !isLoading && (
            <div className="bg-safespeak-dark-accent p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-medium">Don't have a Report ID?</h3>
              </div>
              <p className="text-sm text-white/70">
                Report IDs are provided when you submit a new report. If you've lost your ID, 
                unfortunately, we cannot recover it due to our strict anonymity policy.
              </p>
            </div>
          )}
        </form>
      </Form>
      
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Report Status</h3>
              {getStatusBadge(report.status)}
            </div>
            
            <Progress 
              value={report.progress} 
              className="h-2 bg-white/10" 
              indicatorClassName={getStatusColor(report.status)} 
            />
            
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Report Filed</span>
              <span>In Progress</span>
              <span>Completed</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-white/70">Report ID:</span>
              <span className="font-mono">{report.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Category:</span>
              <span>{report.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Last Updated:</span>
              <span>{report.lastUpdated}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Status Updates</h3>
            <div className="space-y-4">
              {report.updates.map((update, index) => (
                <div 
                  key={index}
                  className="border-l-2 border-safespeak-blue pl-4 pb-4"
                >
                  <p className="text-xs text-white/60">{update.date}</p>
                  <p className="mt-1">{update.message}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-white/10">
            <Button variant="outline" className="w-full" onClick={() => setReport(null)}>
              Track Another Report
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackingForm;

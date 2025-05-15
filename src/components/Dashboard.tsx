import { useEffect, useState } from "react";
import { FilePenLine, CheckCircle, Clock, BarChart2, ShieldAlert } from "lucide-react";
import StatCard from "./StatCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    solvedCases: 0,
    underInvestigation: 0,
    criticalCases: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from your blockchain/backend
    // For now, we'll use localStorage to retrieve submitted reports
    const storedReports = localStorage.getItem('userReports');
    const reports = storedReports ? JSON.parse(storedReports) : [];
    
    setStats({
      totalReports: reports.length,
      solvedCases: reports.filter(r => r.status === 'resolved').length,
      underInvestigation: reports.filter(r => r.status === 'under-investigation').length,
      criticalCases: reports.filter(r => r.priority === 'urgent' || r.priority === 'high').length
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-white/70">Monitor crime reports and their status.</p>
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
      <div className="glass-card rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Case Resolution Progress</h3>
          {stats.totalReports > 0 && (
            <Button variant="outline" size="sm" className="text-xs">
              <BarChart2 className="h-4 w-4 mr-1" /> View Detailed Stats
            </Button>
          )}
        </div>
        
        {stats.totalReports > 0 ? (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Cases Solved</div>
                <div className="text-sm text-white/70">
                  {Math.round(stats.solvedCases / stats.totalReports * 100)}%
                </div>
              </div>
              <Progress 
                value={Math.round(stats.solvedCases / stats.totalReports * 100)} 
                className="h-2 bg-white/10" 
                indicatorClassName="bg-safespeak-green" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Under Investigation</div>
                <div className="text-sm text-white/70">
                  {Math.round(stats.underInvestigation / stats.totalReports * 100)}%
                </div>
              </div>
              <Progress 
                value={Math.round(stats.underInvestigation / stats.totalReports * 100)} 
                className="h-2 bg-white/10" 
                indicatorClassName="bg-safespeak-blue" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Critical Cases</div>
                <div className="text-sm text-white/70">
                  {Math.round(stats.criticalCases / stats.totalReports * 100)}%
                </div>
              </div>
              <Progress 
                value={Math.round(stats.criticalCases / stats.totalReports * 100)} 
                className="h-2 bg-white/10" 
                indicatorClassName="bg-amber-500" 
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50">No reports have been submitted yet.</p>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center flex flex-col items-center">
          <div className="bg-safespeak-blue/15 p-4 rounded-full mb-4">
            <FilePenLine className="h-8 w-8 text-safespeak-blue" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Report a Crime</h3>
          <p className="text-white/70 text-sm mb-4">Submit a new anonymous crime report securely.</p>
          <Link to="/report" className="btn-primary w-full">Report Now</Link>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center flex flex-col items-center">
          <div className="bg-safespeak-green/15 p-4 rounded-full mb-4">
            <Clock className="h-8 w-8 text-safespeak-green" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Track a Report</h3>
          <p className="text-white/70 text-sm mb-4">Check the status of your previously submitted report.</p>
          <Link to="/track" className="btn-secondary w-full">Track Report</Link>
        </div>
        
        <div className="glass-card rounded-2xl p-6 text-center flex flex-col items-center">
          <div className="bg-purple-500/15 p-4 rounded-full mb-4">
            <ShieldAlert className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Emergency Help</h3>
          <p className="text-white/70 text-sm mb-4">Get immediate assistance for urgent situations.</p>
          <Link to="/emergency" className="btn-ghost w-full">Get Help</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

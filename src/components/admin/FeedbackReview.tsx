import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  AlertTriangle, 
  BarChart2, 
  Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { db, collection, getDocs } from '@/integrations/firebase/firebase';

// Types
interface Feedback {
  id: string;
  reportId: string | null;
  type: 'investigation' | 'admin' | 'resolution' | 'other';
  description: string;
  date: string;
  status: 'unread' | 'read' | 'flagged' | 'resolved';
}

const FeedbackReview = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
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
    
    fetchFeedback();
  }, []);
  
  // Apply filters
  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.reportId && item.reportId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getTypeBadge = (type: Feedback['type']) => {
    switch (type) {
      case 'investigation':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-blue/20 text-safespeak-blue">Investigation</span>;
      case 'admin':
        return <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-500">Admin Behavior</span>;
      case 'resolution':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-green/20 text-safespeak-green">Case Resolution</span>;
      case 'other':
        return <span className="px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400">Other</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };
  
  const getStatusBadge = (status: Feedback['status']) => {
    switch (status) {
      case 'unread':
        return <span className="px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-500">Unread</span>;
      case 'read':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-blue/20 text-safespeak-blue">Read</span>;
      case 'flagged':
        return <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-500">Flagged</span>;
      case 'resolved':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-green/20 text-safespeak-green">Resolved</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };
  
  const handleViewFeedback = (item: Feedback) => {
    // Mark as read if unread
    if (item.status === 'unread') {
      const updatedFeedback = feedback.map(fb => 
        fb.id === item.id ? { ...fb, status: 'read' as const } : fb
      );
      setFeedback(updatedFeedback);
    }
    
    setSelectedFeedback(item);
  };
  
  const handleUpdateStatus = (newStatus: Feedback['status']) => {
    if (!selectedFeedback) return;
    
    const updatedFeedback = feedback.map(fb => 
      fb.id === selectedFeedback.id ? { ...fb, status: newStatus } : fb
    );
    
    setFeedback(updatedFeedback);
    setSelectedFeedback(prev => prev ? { ...prev, status: newStatus } : null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-safespeak-blue" />
          <span>Feedback Review</span>
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input 
            placeholder="Search feedback..." 
            className="pl-10 bg-safespeak-dark-accent border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={typeFilter} 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="investigation">Investigation</SelectItem>
              <SelectItem value="admin">Admin Behavior</SelectItem>
              <SelectItem value="resolution">Case Resolution</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/60 border-b border-white/10">
                <th className="p-4 font-medium text-sm">ID</th>
                <th className="p-4 font-medium text-sm">Report ID</th>
                <th className="p-4 font-medium text-sm">Type</th>
                <th className="p-4 font-medium text-sm">Date</th>
                <th className="p-4 font-medium text-sm">Status</th>
                <th className="p-4 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-mono text-sm">{item.id}</td>
                  <td className="p-4 font-mono text-sm">
                    {item.reportId || (
                      <span className="text-white/40">No report ID</span>
                    )}
                  </td>
                  <td className="p-4">{getTypeBadge(item.type)}</td>
                  <td className="p-4 text-sm text-white/70">{item.date}</td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => handleViewFeedback(item)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredFeedback.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/60">
                    No feedback found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Feedback Detail Dialog */}
      {selectedFeedback && (
        <Dialog open={Boolean(selectedFeedback)} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono text-sm bg-safespeak-dark-accent px-2 py-1 rounded">
                  {selectedFeedback.id}
                </span>
                <span>Feedback Details</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/70">Date Submitted</h3>
                  <p>{selectedFeedback.date}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/70">Status</h3>
                  <div>{getStatusBadge(selectedFeedback.status)}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/70">Feedback Type</h3>
                  <div>{getTypeBadge(selectedFeedback.type)}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/70">Related Report</h3>
                  <p className="font-mono">
                    {selectedFeedback.reportId || 'No related report'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/70">Feedback Content</h3>
                <div className="bg-safespeak-dark-accent/50 p-4 rounded-md text-white/90">
                  {selectedFeedback.description}
                </div>
              </div>
              
              {selectedFeedback.type === 'other' && (
                <div className="bg-amber-500/10 p-4 rounded-md flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm text-amber-500 font-medium">Non-case related feedback</p>
                    <p className="text-sm text-white/70">
                      This feedback appears to be about app features or interface rather than a specific case.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-white/70">Update Status</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-safespeak-blue border-safespeak-blue/30"
                    onClick={() => handleUpdateStatus('read')}
                  >
                    Mark as Read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-amber-500 border-amber-500/30"
                    onClick={() => handleUpdateStatus('flagged')}
                  >
                    Flag for Review
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-safespeak-green border-safespeak-green/30"
                    onClick={() => handleUpdateStatus('resolved')}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              {selectedFeedback.reportId && (
                <Button>
                  View Related Case
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeedbackReview;

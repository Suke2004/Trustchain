import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  Shield,
  AlertTriangle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

// Types
interface Evidence {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'pdf' | 'document';
  url: string;
  size: string;
}

interface Report {
  id: string;
  crimeType: string;
  description: string;
  location: string;
  date: string;
  status: "pending" | "under-investigation" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  evidence?: Evidence[];
  userDetails?: {
    id?: string;
    pseudonym?: string;
  };
  statusHistory?: {
    status: Report["status"];
    note: string;
    date: string;
  }[];
}

interface CaseManagementProps {
  allReports: Report[];
}

const CaseManagement = ({ allReports = [] }: CaseManagementProps) => {
  const [reports, setReports] = useState<Report[]>(allReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Report | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<Report['status']>('pending');
  const [statusNote, setStatusNote] = useState('');
  const { toast } = useToast();
  
  // Filter reports based on search query
  const filteredReports = reports.filter(report => 
    report.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.crimeType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-safespeak-green" />;
      case 'under-investigation':
        return <Clock className="h-4 w-4 text-safespeak-blue" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'closed':
        return <X className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: Report['status']) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'under-investigation': return 'Under Investigation';
      case 'pending': return 'Pending Review';
      case 'closed': return 'Closed';
      default: return status;
    }
  };
  
  const getPriorityBadge = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-500">Urgent</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-500">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-blue/20 text-safespeak-blue">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded bg-safespeak-green/20 text-safespeak-green">Low</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };
  
  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'image':
        return <div className="w-8 h-8 bg-safespeak-blue/10 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-safespeak-blue" />
        </div>;
      case 'video':
        return <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-purple-500" />
        </div>;
      case 'pdf':
        return <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-red-500" />
        </div>;
      case 'document':
        return <div className="w-8 h-8 bg-safespeak-green/10 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-safespeak-green" />
        </div>;
      default:
        return <div className="w-8 h-8 bg-gray-500/10 rounded flex items-center justify-center">
          <FileText className="h-4 w-4 text-gray-400" />
        </div>;
    }
  };
  
  const handleViewCase = (report: Report) => {
    setSelectedCase(report);
  };
  
  const handleStatusUpdate = () => {
    if (!selectedCase) return;
    
    // Update the report status in the state
    const updatedReports = reports.map(report => 
      report.id === selectedCase.id 
        ? { ...report, status: updateStatus } 
        : report
    );
    
    setReports(updatedReports);
    
    // Update in localStorage
    localStorage.setItem('userReports', JSON.stringify(updatedReports));
    
    // Update the selected case
    setSelectedCase(prev => prev ? { ...prev, status: updateStatus } : null);
    
    // Close dialog and show success toast
    setStatusDialogOpen(false);
    
    toast({
      title: "Status Updated",
      description: `Case ${selectedCase.id} has been updated to "${getStatusLabel(updateStatus)}"`,
    });
    
    // Reset form
    setStatusNote('');
  };
  
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <Shield className='h-5 w-5 text-safespeak-blue' />
          <span>Case Management</span>
        </h2>
        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2 w-full'>
          {/* Search Bar */}
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40' />
            <Input
              placeholder='Search cases...'
              className='pl-10 bg-safespeak-dark-accent border-white/10 w-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter and Export Buttons */}
          <div className='flex gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Filter className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter Cases</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Download className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Cases</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className='glass-card rounded-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='text-left text-white/60 border-b border-white/10'>
                <th className='p-4 font-medium text-sm'>Report ID</th>
                <th className='p-4 font-medium text-sm'>Type</th>
                <th className='p-4 font-medium text-sm'>Location</th>
                <th className='p-4 font-medium text-sm'>Date</th>
                <th className='p-4 font-medium text-sm'>Priority</th>
                <th className='p-4 font-medium text-sm'>Status</th>
                <th className='p-4 font-medium text-sm text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className='border-b border-white/5 hover:bg-white/5'>
                    <td className='p-4 font-mono text-sm'>{report.id}</td>
                    <td className='p-4'>{report.crimeType}</td>
                    <td className='p-4'>{report.location}</td>
                    <td className='p-4 text-sm text-white/70'>{report.date}</td>
                    <td className='p-4'>{getPriorityBadge(report.priority)}</td>
                    <td className='p-4'>
                      <div className='flex items-center gap-1.5'>
                        {getStatusIcon(report.status)}
                        <span className='text-sm'>
                          {getStatusLabel(report.status)}
                        </span>
                      </div>
                    </td>
                    <td className='p-4 text-right'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-xs'
                        onClick={() => handleViewCase(report)}>
                        <Eye className='h-3.5 w-3.5 mr-1' />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='p-8 text-center text-white/60'>
                    {searchQuery
                      ? "No reports found matching your search."
                      : "No reports have been submitted yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Dialog */}
      {selectedCase && (
        <Dialog
          open={Boolean(selectedCase)}
          onOpenChange={(open) => !open && setSelectedCase(null)}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <span className='font-mono text-sm bg-safespeak-dark-accent px-2 py-1 rounded'>
                  {selectedCase.id}
                </span>
                <span className='text-lg'>{selectedCase.crimeType} Report</span>
                {getPriorityBadge(selectedCase.priority)}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue='details' className='mt-4'>
              <TabsList className='grid grid-cols-3 mb-4'>
                <TabsTrigger value='details'>Case Details</TabsTrigger>
                <TabsTrigger value='evidence'>Evidence</TabsTrigger>
                <TabsTrigger value='status'>Status Update</TabsTrigger>
              </TabsList>

              <TabsContent value='details' className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-white/70'>
                      Date Reported
                    </h3>
                    <p>{selectedCase.date}</p>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-white/70'>
                      Location
                    </h3>
                    <p>{selectedCase.location}</p>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-white/70'>
                      Current Status
                    </h3>
                    <div className='flex items-center gap-1.5'>
                      {getStatusIcon(selectedCase.status)}
                      <span>{getStatusLabel(selectedCase.status)}</span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium text-white/70'>
                      Reported By
                    </h3>
                    <p>
                      {selectedCase.userDetails?.pseudonym ||
                        "Anonymous Report"}
                    </p>
                  </div>
                </div>

                <div className='space-y-2 pt-4 border-t border-white/10'>
                  <h3 className='text-sm font-medium text-white/70'>
                    Description
                  </h3>
                  <p className='bg-safespeak-dark-accent/50 p-4 rounded-md text-white/90'>
                    {selectedCase.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value='evidence' className='space-y-4'>
                {selectedCase.evidence && selectedCase.evidence.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {selectedCase.evidence.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center gap-3 bg-safespeak-dark-accent/30 p-3 rounded-lg'>
                        {getEvidenceIcon(item.type)}
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium truncate'>
                            {item.filename}
                          </p>
                          <p className='text-xs text-white/60'>{item.size}</p>
                        </div>
                        <Button variant='outline' size='sm'>
                          <Download className='h-3.5 w-3.5 mr-1.5' />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 text-white/60'>
                    <AlertTriangle className='h-8 w-8 mx-auto mb-2 text-amber-500' />
                    <p>No evidence files were submitted with this report.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='status' className='space-y-4'>
                <div className='bg-safespeak-dark-accent/30 p-4 rounded-lg'>
                  <h3 className='font-medium mb-4'>Update Case Status</h3>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-sm text-white/70'>
                        Current Status
                      </label>
                      <div className='flex items-center gap-1.5 bg-safespeak-dark p-2 rounded'>
                        {getStatusIcon(selectedCase.status)}
                        <span>{getStatusLabel(selectedCase.status)}</span>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm text-white/70'>
                        New Status
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setUpdateStatus(value as Report["status"])
                        }
                        defaultValue={selectedCase.status}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select new status' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='pending'>
                            Pending Review
                          </SelectItem>
                          <SelectItem value='under-investigation'>
                            Under Investigation
                          </SelectItem>
                          <SelectItem value='resolved'>
                            Case Resolved
                          </SelectItem>
                          <SelectItem value='closed'>Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm text-white/70'>
                        Status Update Note (Internal)
                      </label>
                      <Textarea
                        placeholder='Add notes about this status update...'
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                      />
                    </div>

                    <Button className='w-full' onClick={handleStatusUpdate}>
                      Update Status
                    </Button>
                  </div>
                </div>

                <div className='bg-safespeak-dark-accent/30 p-4 rounded-lg'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-medium'>Status History</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='border-l-2 border-safespeak-blue pl-4 py-2'>
                      <p className='text-xs text-white/60'>
                        {new Date().toISOString().split("T")[0]}
                      </p>
                      <p className='font-medium'>
                        Case status changed to:{" "}
                        {getStatusLabel(selectedCase.status)}
                      </p>
                      <p className='text-sm text-white/70'>
                        Initial review complete.
                      </p>
                    </div>
                    <div className='border-l-2 border-safespeak-blue pl-4 py-2'>
                      <p className='text-xs text-white/60'>
                        {selectedCase.date}
                      </p>
                      <p className='font-medium'>Case Opened</p>
                      <p className='text-sm text-white/70'>
                        Report received and case created.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CaseManagement;

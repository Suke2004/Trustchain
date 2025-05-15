import { useState } from 'react';
import { AlertTriangle, Clock, FileText, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Types
interface CriticalCase {
  id: string;
  title: string;
  description: string;
  location: string;
  timeElapsed: string;
  status: 'urgent' | 'critical' | 'high';
  crimeType: string;
  aiScore: number;
  aiReason: string;
}

// Mock data for critical cases
const mockCriticalCases: CriticalCase[] = [
  {
    id: 'RPT-A1B2C3',
    title: 'Armed Robbery at Downtown Store',
    description: 'Multiple armed individuals entered the store and threatened the employees. Surveillance footage available.',
    location: 'Downtown Commercial District',
    timeElapsed: '2 hours ago',
    status: 'urgent',
    crimeType: 'robbery',
    aiScore: 95,
    aiReason: 'Recent incident, violent crime with weapons involved, multiple perpetrators, available evidence.'
  },
  {
    id: 'RPT-D4E5F6',
    title: 'Repeated Domestic Violence Reports',
    description: 'Multiple reports from the same address over the past week. Escalating pattern observed.',
    location: 'Westside Apartments',
    timeElapsed: '6 hours ago',
    status: 'critical',
    crimeType: 'domestic violence',
    aiScore: 92,
    aiReason: 'Pattern of escalation, potential for serious harm, involves vulnerable victims, high recurrence risk.'
  },
  {
    id: 'RPT-G7H8I9',
    title: 'Drug Trafficking Near School',
    description: 'Multiple witnesses reported drug dealing activities near the elementary school during school hours.',
    location: 'Northside Elementary School Area',
    timeElapsed: '1 day ago',
    status: 'high',
    crimeType: 'drug trafficking',
    aiScore: 87,
    aiReason: 'Proximity to school, ongoing criminal activity, affects children safety, community impact.'
  },
  {
    id: 'RPT-J1K2L3',
    title: 'Cybercrime Targeting Elderly',
    description: 'Organized phishing scheme targeting elderly residents in the community. Multiple victims reported.',
    location: 'Citywide',
    timeElapsed: '2 days ago',
    status: 'high',
    crimeType: 'cybercrime',
    aiScore: 83,
    aiReason: 'Targets vulnerable population, multiple victims, organized crime, financial impact on victims.'
  }
];

// Helper function to get the status badge
const getStatusBadge = (status: CriticalCase['status']) => {
  switch (status) {
    case 'urgent':
      return <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>;
    case 'critical':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500 hover:bg-orange-600">High Priority</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const CriticalCases = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast();
  
  const toggleExpandCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleAssignToMe = (id: string) => {
    toast({
      title: "Case Assigned",
      description: `You've been assigned to case ${id}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>AI-Prioritized Critical Cases</span>
        </h2>
      </div>
      
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-400">AI Priority System</h3>
            <p className="text-sm text-white/70">
              Cases are automatically prioritized based on crime type, time sensitivity, public safety risk,
              and likelihood of evidence degradation. Review these cases first for efficient resource allocation.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCriticalCases.map((caseItem) => (
          <Card key={caseItem.id} className="glass-card shadow-lg border-white/10 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {caseItem.title}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs">{caseItem.id}</span>
                    {getStatusBadge(caseItem.status)}
                  </CardDescription>
                </div>
                <div className="bg-white/10 rounded-full px-2 py-1 text-xs font-medium flex items-center">
                  AI Score: <span className="text-amber-400 ml-1">{caseItem.aiScore}/100</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="space-y-3">
                <p className="text-sm text-white/80">{caseItem.description}</p>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    <span>{caseItem.timeElapsed}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                    <FileText className="h-3 w-3" />
                    <span>{caseItem.crimeType}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                    <MapPin className="h-3 w-3" />
                    <span>{caseItem.location}</span>
                  </div>
                </div>
                
                {expandedCard === caseItem.id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <h4 className="text-xs font-medium text-white/70 mb-2">AI Priority Reasoning:</h4>
                    <p className="text-sm text-white/80">{caseItem.aiReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-1"
                onClick={() => toggleExpandCard(caseItem.id)}
              >
                {expandedCard === caseItem.id ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    <span>AI Details</span>
                  </>
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleAssignToMe(caseItem.id)}
                >
                  Assign to Me
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CriticalCases;

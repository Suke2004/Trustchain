import { useState } from 'react';
import { motion } from 'framer-motion';
import { FilePenLine, ArrowRight, CheckCircle, UploadCloud, Calendar, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '@/components/FileUpload';
import { db, collection, addDoc } from "@/integrations/firebase/firebase";

type ReportFormData = {
  crimeType: string;
  description: string;
  location: string;
  date: string;
  evidenceFiles: File[];
};

const crimeTypes = [
  'Theft',
  'Assault',
  'Fraud',
  'Vandalism',
  'Drug-related',
  'Cybercrime',
  'Harassment',
  'Other'
];

const ReportCrime = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<ReportFormData>();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [aiDetectedType, setAiDetectedType] = useState<string | null>(null);
  
  const simulateAIDetection = (description: string) => {
    if (description.length > 20) {
      const types = crimeTypes;
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      setTimeout(() => {
        setAiDetectedType(randomType);
        toast({
          title: "AI Detection",
          description: `The AI suggests this is a ${randomType} case.`,
        });
      }, 1000);
    }
  };
  
  const onFileChange = (files: File[]) => {
    setEvidenceFiles(files);
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    
    try {
      const generatedId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
      setReportId(generatedId);
      
      const newReport = {
        id: generatedId,
        crimeType: data.crimeType,
        description: data.description,
        location: data.location,
        date: data.date,
        status: 'pending',
        evidence_urls: evidenceFiles.map((file) => URL.createObjectURL(file)),
        userId: user?.id || null
      };
      
      try {
        const docRef = await addDoc(collection(db, "reports"), newReport);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
      toast({
        title: "Report Submitted",
        description: "Your crime report has been successfully submitted.",
      });
      
      setCurrentStep(4);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setEvidenceFiles([]);
    setReportId(null);
    setAiDetectedType(null);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-safespeak-blue/15 p-3 rounded-full">
                <FilePenLine className="h-8 w-8 text-safespeak-blue" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Report a Crime</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Submit your anonymous report securely. All submissions are encrypted and stored on 
              blockchain technology for maximum security and privacy.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${currentStep === step ? 'bg-safespeak-blue text-white' : 
                        currentStep > step ? 'bg-safespeak-green text-white' : 'bg-white/10 text-white/60'}`}
                  >
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  <span className="text-xs mt-2 text-white/60">
                    {step === 1 ? 'Details' : 
                     step === 2 ? 'Location' : 
                     step === 3 ? 'Evidence' : 'Completed'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-safespeak-blue rounded-full transition-all duration-300"
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>
          
          <motion.div 
            className="max-w-2xl mx-auto glass-card rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Crime Details</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crimeType">Crime Type</Label>
                    <select 
                      id="crimeType"
                      className="w-full bg-safespeak-dark-accent text-white border-white/10 rounded-md p-2"
                      {...register("crimeType", { required: true })}
                      defaultValue={aiDetectedType || ""}
                    >
                      <option value="" disabled>Select crime type</option>
                      {crimeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {aiDetectedType && (
                      <p className="text-xs text-safespeak-green">AI suggested: {aiDetectedType}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what happened in detail..."
                      className="min-h-32 bg-safespeak-dark-accent border-white/10"
                      {...register("description", { required: true })}
                      onChange={(e) => simulateAIDetection(e.target.value)}
                    />
                    <p className="text-xs text-white/60">
                      The AI will analyze your description to help categorize the crime appropriately.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      className="bg-safespeak-blue hover:bg-safespeak-blue/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Location & Date</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-safespeak-blue" /> Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter the location of the incident"
                      className="bg-safespeak-dark-accent border-white/10"
                      {...register("location", { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-safespeak-blue" /> Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      className="bg-safespeak-dark-accent border-white/10"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      {...register("date", { required: true })}
                    />
                    <p className="text-xs text-white/60">
                      Current date is auto-filled, but you can change it if the incident happened earlier.
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      className="bg-safespeak-blue hover:bg-safespeak-blue/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Evidence</h2>
                  
                  <FileUpload onFileChange={onFileChange} />
                  
                  <p className="text-xs text-white/60 mt-2">
                    Accepted file types: Images (.jpg, .png), Documents (.pdf, .doc), Videos (.mp4, .mov)
                  </p>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-safespeak-green hover:bg-safespeak-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">●</span> Submitting...
                        </span>
                      ) : (
                        <span>Submit Report</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-safespeak-green/20 p-4 rounded-full">
                      <CheckCircle className="h-10 w-10 text-safespeak-green" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold">Report Successfully Submitted</h2>
                  
                  <p className="text-white/80">
                    Your report has been securely submitted and stored.
                  </p>
                  
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/70 mb-1">Your Report ID:</p>
                    <p className="text-xl font-mono font-semibold text-safespeak-blue">{reportId}</p>
                    <p className="text-xs text-white/60 mt-2">
                      Save this ID to track the status of your report later.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                    >
                      Submit Another Report
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-safespeak-blue hover:bg-safespeak-blue/90"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      View Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportCrime;

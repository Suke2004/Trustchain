import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FilePenLine, 
  Calendar, 
  MapPin, 
  Upload, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const crimeTypes = [
  { value: "theft", label: "Theft" },
  { value: "fraud", label: "Fraud" },
  { value: "assault", label: "Assault" },
  { value: "vandalism", label: "Vandalism" },
  { value: "cybercrime", label: "Cybercrime" },
  { value: "harassment", label: "Harassment" },
  { value: "drug", label: "Drug-related" },
  { value: "environmental", label: "Environmental" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  crimeType: z.string().min(1, { message: "Please select a crime type" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  location: z.string().min(3, { message: "Please provide a general location" }),
  date: z.string().min(1, { message: "Please select a date" }),
});

type CrimeReportFormValues = z.infer<typeof formSchema>;

const CrimeReportForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [reportId, setReportId] = useState("");
  const { toast } = useToast();
  
  const form = useForm<CrimeReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crimeType: "",
      description: "",
      location: "",
      date: new Date().toISOString().split('T')[0],
    },
  });
  
  const onSubmit = async (values: CrimeReportFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a random report ID
      const generatedId = "RPT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      setReportId(generatedId);
      
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      
      // Reset form
      form.reset();
      setFiles([]);
      setCurrentStep(1);
    }, 2000);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) added successfully`,
      });
    }
  };
  
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const nextStep = () => {
    form.trigger();
    const currentFields = currentStep === 1 ? ["crimeType", "description"] : ["location", "date"];
    
    const isValid = currentFields.every(field => {
      return !form.getFieldState(field as keyof CrimeReportFormValues).invalid;
    });
    
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  return (
    <>
      <div className="glass-card rounded-xl p-6 md:p-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? "bg-safespeak-blue" : "bg-white/10"
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm">{step}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-white/60">
                {step === 1 ? "Details" : step === 2 ? "Location" : "Evidence"}
              </span>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FilePenLine className="text-safespeak-blue" />
                  <span>Incident Details</span>
                </h3>
                
                <FormField
                  control={form.control}
                  name="crimeType"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Crime Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type of incident" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crimeTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe what happened in detail..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="text-safespeak-blue" />
                  <span>Location & Date</span>
                </h3>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="General area or location (city, neighborhood, etc.)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Incident</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="text-safespeak-blue" />
                  <span>Evidence Upload</span>
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Upload Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-white/60" />
                      <p className="text-sm font-medium mb-1">
                        Drag files here or click to browse
                      </p>
                      <p className="text-xs text-white/50">
                        Supports images, videos, PDFs (max 10MB each)
                      </p>
                    </label>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="bg-white/5 rounded-md p-2 flex justify-between"
                        >
                          <span className="truncate text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-white/70 mb-4">
                    You're about to submit this report anonymously. Once submitted, you'll receive 
                    a unique Report ID to track the status of your case.
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="flex justify-between pt-4">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-safespeak-green hover:bg-safespeak-green/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Report Submitted Successfully</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="bg-safespeak-green/20 p-4 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-safespeak-green" />
            </div>
            <p className="text-center text-white/70 mb-4">
              Your report has been submitted anonymously and securely.
            </p>
            <div className="bg-safespeak-dark-accent p-4 rounded-lg w-full text-center mb-4">
              <p className="text-sm text-white/70 mb-1">Your Report ID:</p>
              <p className="text-xl font-mono font-bold">{reportId}</p>
            </div>
            <p className="text-sm text-white/70 text-center mb-4">
              Save this ID to track the status of your report later.
            </p>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(reportId);
                toast({
                  title: "Copied to clipboard",
                  description: "Report ID has been copied to clipboard",
                });
              }}
            >
              Copy Report ID
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrimeReportForm;

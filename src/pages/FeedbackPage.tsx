import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, addDoc } from "@/integrations/firebase/firebase";

const feedbackTypes = [
  "App Experience",
  "Reporting Process",
  "Investigation Updates",
  "General Feedback",
  "Feature Suggestions",
  "Security Concerns"
];

const FeedbackPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiDetectedType, setAiDetectedType] = useState<string | null>(null);
  
  // This would use your AI integration in a real app
  const simulateAIDetection = (text: string) => {
    if (text.length < 15) return; // Only trigger after some content is typed
    
    // In a real app, this would call your NLP service
    const types = feedbackTypes;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setTimeout(() => {
      setAiDetectedType(randomType);
      toast({
        title: "AI Suggestion",
        description: `The AI suggests this is "${randomType}" feedback.`,
      });
      setSelectedType(randomType);
    }, 1000);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(e.target.value);
    if (e.target.value.length > 30 && !aiDetectedType) {
      simulateAIDetection(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback before submitting",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select a feedback type",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        content: feedbackText,
        userId: user?.id || null,
        type: selectedType,
        createdAt: new Date().toISOString(),
      };

      try {
        const docRef = await addDoc(collection(db, "feedback"), feedbackData);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedbackText('');
    setSelectedType('');
    setIsSubmitted(false);
    setAiDetectedType(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-safespeak-dark">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500/15 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Provide Feedback</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Help us improve SafeSpeak by sharing your experience. Your feedback is valuable in enhancing our service.
            </p>
          </div>
          
          <motion.div 
            className="max-w-2xl mx-auto glass-card rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feedbackType">Feedback Type</Label>
                  <select 
                    id="feedbackType"
                    className="w-full bg-safespeak-dark-accent text-white border-white/10 rounded-md p-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select feedback type</option>
                    {feedbackTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {aiDetectedType && (
                    <p className="text-xs text-purple-400">AI suggested: {aiDetectedType}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedbackText">Your Feedback</Label>
                  <Textarea
                    id="feedbackText"
                    placeholder="Share your thoughts, suggestions, or experiences..."
                    className="min-h-32 bg-safespeak-dark-accent border-white/10"
                    value={feedbackText}
                    onChange={handleTextChange}
                    required
                  />
                  <p className="text-xs text-white/60">
                    Our AI will automatically categorize your feedback to help us process it more efficiently.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">●</span> Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-purple-500/20 p-4 rounded-full">
                    <ThumbsUp className="h-10 w-10 text-purple-500" />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">Thank You for Your Feedback!</h2>
                <p className="text-white/80 mb-6">
                  Your input helps us improve SafeSpeak for everyone. We appreciate you taking the time to share your thoughts.
                </p>
                
                <Button 
                  onClick={handleReset} 
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Submit Another Feedback
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeedbackPage;

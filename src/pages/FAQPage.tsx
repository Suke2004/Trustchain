import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-safespeak-blue/15 p-3 rounded-full">
                <HelpCircle className="h-8 w-8 text-safespeak-blue" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Find answers to common questions about SafeSpeak and how our anonymous crime reporting works.
            </p>
          </div>
          
          <motion.div 
            className="max-w-3xl mx-auto glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          <div className="mt-12 text-center">
            <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
            <p className="text-white/70 mb-6">
              If you couldn't find the answer you were looking for, please contact our support team.
            </p>
            <a href="mailto:contact@safespeak.io" className="btn-primary inline-flex items-center">
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const faqs = [
  {
    question: "How is my anonymity protected?",
    answer: "SafeSpeak uses advanced encryption technology and blockchain storage to ensure your identity remains completely anonymous. We don't collect IP addresses, personal data, or any identifying information. Reports are processed through multiple security layers before being stored on IPFS."
  },
  {
    question: "What happens after I submit a report?",
    answer: "After submission, your report is encrypted and assigned a unique Report ID. Our AI system categorizes the report and identifies key information. The report is then securely stored on blockchain technology and made available to authorized personnel for investigation."
  },
  {
    question: "How do I track my report's status?",
    answer: "When you submit a report, you receive a unique Report ID. You can enter this ID on our Track Report page to check the current status of your case, including whether it's being reviewed, under investigation, or resolved."
  },
  {
    question: "Can I provide additional information after submitting?",
    answer: "Yes, you can add supplementary details to your report using your Report ID. Visit the Track Report page, enter your ID, and you'll find an option to add more information or evidence to your existing case."
  },
  {
    question: "How is SafeSpeak different from other reporting platforms?",
    answer: "SafeSpeak combines blockchain technology for tamper-proof record keeping with AI-powered analysis for efficient processing. This unique combination ensures maximum security, anonymity, and effectiveness in handling crime reports, setting us apart from conventional reporting platforms."
  },
  {
    question: "What types of crimes can I report on SafeSpeak?",
    answer: "You can report various crimes including theft, fraud, cybercrime, harassment, vandalism, environmental violations, and more. Our AI system helps categorize reports appropriately, but serious emergencies requiring immediate attention should still be reported directly to emergency services."
  },
  {
    question: "Is blockchain really secure for storing sensitive information?",
    answer: "Yes. Blockchain technology provides immutable, tamper-proof storage that is highly resistant to hacking or manipulation. Your encrypted report is distributed across multiple nodes, making it virtually impossible to alter or delete once recorded."
  },
  {
    question: "Do I need to create an account to submit a report?",
    answer: "No, SafeSpeak doesn't require account creation. This is by design to protect your anonymity. You simply fill out the report form and receive a unique Report ID for tracking purposes."
  }
];

export default FAQPage;

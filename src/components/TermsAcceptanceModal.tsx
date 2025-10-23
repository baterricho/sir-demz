import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Phone, Shield, Users, AlertTriangle, FileText, Clock } from 'lucide-react';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  userName: string;
}

export function TermsAcceptanceModal({ isOpen, onAccept, onDecline, userName }: TermsAcceptanceModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);

  const canAccept = hasReadTerms && hasReadPrivacy;

  const handleAccept = () => {
    if (canAccept) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">Welcome to Community Call, {userName}!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Before you start using Community Call, please review and accept our Terms & Conditions and Privacy Policy.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 py-4 h-[60vh]">
          <div className="space-y-6">
            {/* Quick Overview */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="flex items-center gap-2 font-semibold text-blue-800 mb-3">
                <FileText className="w-5 h-5" />
                Quick Overview
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Community Reporting</p>
                    <p>Report issues and track their resolution</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Emergency Services</p>
                    <p>SOS feature for urgent situations</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Privacy Protection</p>
                    <p>Confidential reporting options available</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Real-time Tracking</p>
                    <p>Monitor progress of your reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Key Points You Should Know:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-sm">!</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Emergency Use</p>
                    <p className="text-sm text-gray-600">Use SOS feature only for genuine emergencies. For life-threatening situations, also call 911 directly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Accurate Information</p>
                    <p className="text-sm text-gray-600">Always provide truthful and accurate information in your reports to help authorities respond effectively.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">🔒</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Privacy & Confidentiality</p>
                    <p className="text-sm text-gray-600">Your personal information is protected. You can submit confidential reports when needed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">⚖</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Responsible Usage</p>
                    <p className="text-sm text-gray-600">Do not abuse the platform with false reports, spam, or harassment. Misuse may result in account suspension.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-800">Required Agreements:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id="terms" 
                    checked={hasReadTerms} 
                    onCheckedChange={(checked) => setHasReadTerms(!!checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    <span className="font-medium text-gray-800">I have read and agree to the Terms & Conditions</span>
                    <p className="text-gray-600 mt-1">
                      This includes user responsibilities, service limitations, emergency service guidelines, and content policies.
                    </p>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id="privacy" 
                    checked={hasReadPrivacy} 
                    onCheckedChange={(checked) => setHasReadPrivacy(!!checked)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm cursor-pointer">
                    <span className="font-medium text-gray-800">I have read and agree to the Privacy Policy</span>
                    <p className="text-gray-600 mt-1">
                      This covers how we collect, use, store, and protect your personal information and report data.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                By accepting these terms, you confirm that you are at least 18 years old or have parental consent to use this service. 
                Community Call is designed to improve community safety and communication. Please use it responsibly.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex-1 sm:flex-none"
            >
              Decline & Exit
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!canAccept}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 disabled:opacity-50"
            >
              {canAccept ? 'Accept & Continue' : 'Please Review Both Documents'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
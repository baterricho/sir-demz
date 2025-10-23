import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Phone } from 'lucide-react';
import { Page } from '../App';

interface TermsAndConditionsProps {
  onNavigate: (page: Page) => void;
}

export function TermsAndConditions({ onNavigate }: TermsAndConditionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">SafetyConnect</h1>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
            <p className="text-gray-600">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using SafetyConnect, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Service Description</h3>
              <p className="text-gray-600 leading-relaxed">
                SafetyConnect is a platform that allows users to report community issues, submit emergency alerts, and track 
                the progress of their reports. The service is designed to facilitate communication between community members 
                and local authorities.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3. User Responsibilities</h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p>Users agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate and truthful information in all reports</li>
                  <li>Use the SOS emergency feature only for genuine emergencies</li>
                  <li>Respect the privacy and rights of other community members</li>
                  <li>Not use the platform for any illegal or harmful activities</li>
                  <li>Not spam or abuse the reporting system</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Emergency Services</h3>
              <p className="text-gray-600 leading-relaxed">
                The SOS emergency feature is designed to alert local emergency services. However, SafetyConnect is not 
                responsible for the response time or actions of emergency services. In life-threatening situations, 
                users should also call traditional emergency numbers (911, etc.) directly.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Privacy and Data Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to protecting your privacy. Information collected through the platform will be used 
                to process reports and provide services. Users can choose to submit confidential reports. Please refer 
                to our Privacy Policy for detailed information about data handling.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Content and Conduct</h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p>Users must not submit content that is:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>False, misleading, or defamatory</li>
                  <li>Threatening, harassing, or abusive</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Containing personal information of others without consent</li>
                  <li>Spam or repetitive content</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Service Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                While we strive to maintain continuous service availability, SafetyConnect does not guarantee 
                uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time 
                for maintenance, updates, or other operational reasons.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                Community Call and its operators shall not be liable for any direct, indirect, incidental, consequential, 
                or punitive damages arising from the use of this service. This includes, but is not limited to, damages 
                for loss of data, business interruption, or personal injury.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Report Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                We will make reasonable efforts to process and respond to reports in a timely manner. However, response 
                times may vary depending on the nature and urgency of the issue. We reserve the right to prioritize 
                emergency reports and may not be able to address all non-urgent issues immediately.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Account Termination</h3>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate user accounts that violate these terms of service, 
                engage in abusive behavior, or misuse the platform. Users may also delete their accounts at any time 
                by contacting our support team.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">11. Changes to Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                These terms may be updated from time to time. Users will be notified of significant changes via the 
                platform or email. Continued use of the service after changes are posted constitutes acceptance of 
                the new terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">12. Contact Information</h3>
              <p className="text-gray-600 leading-relaxed">
                For questions about these terms or the Community Call service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> support@communitycall.com<br/>
                  <strong>Phone:</strong> +1 (555) 123-4567<br/>
                  <strong>Address:</strong> Community Call, 123 Civic Center Dr, City, State 12345
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-500">
                By using Community Call, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms and Conditions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <button onClick={() => onNavigate('terms')} className="hover:text-blue-500">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-blue-500">
              Privacy Policy
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">
            © 2025 Community Call
          </div>
        </div>
      </footer>
    </div>
  );
}
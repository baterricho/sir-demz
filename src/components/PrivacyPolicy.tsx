import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Phone, Shield, Eye, Database, Users } from 'lucide-react';
import { Page } from '../App';

interface PrivacyPolicyProps {
  onNavigate: (page: Page) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
              <h1 className="text-lg font-bold text-gray-800">Community Call</h1>
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
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              Privacy Policy
            </CardTitle>
            <p className="text-gray-600">Last updated: January 15, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Information We Collect</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside ml-4">
                    <li>Name and email address when you create an account</li>
                    <li>Contact information provided in reports</li>
                    <li>Location data when submitting reports or SOS alerts (with your permission)</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Report Data
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside ml-4">
                    <li>Issue descriptions and categories</li>
                    <li>Photos or files attached to reports</li>
                    <li>Timestamps and status updates</li>
                    <li>Emergency alert information</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Technical Information
                  </h4>
                  <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and general location</li>
                    <li>Usage patterns and platform interactions</li>
                    <li>Error logs and performance data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2. How We Use Your Information</h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p>We use the collected information to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Process and respond to your community reports</li>
                  <li>Coordinate emergency responses through SOS alerts</li>
                  <li>Send you updates about your reports and account</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations and emergency protocols</li>
                  <li>Prevent fraud and ensure platform security</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Information Sharing</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4 bg-yellow-50 p-3 rounded-r-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">With Local Authorities</h4>
                  <p className="text-sm text-yellow-700">
                    We share report information with relevant local government agencies, emergency services, 
                    and community organizations to address the issues you report.
                  </p>
                </div>

                <div className="border-l-4 border-red-400 pl-4 bg-red-50 p-3 rounded-r-lg">
                  <h4 className="font-medium text-red-800 mb-2">Emergency Situations</h4>
                  <p className="text-sm text-red-700">
                    In emergency situations or when using SOS features, your location and contact information 
                    will be immediately shared with emergency responders.
                  </p>
                </div>

                <div className="border-l-4 border-gray-400 pl-4 bg-gray-50 p-3 rounded-r-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Service Providers</h4>
                  <p className="text-sm text-gray-700">
                    We may share information with trusted service providers who help us operate the platform, 
                    such as cloud hosting and communication services.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Confidential Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                When you choose to submit a confidential report, we take extra measures to protect your identity:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 mt-2">
                <li>Your personal information is separated from the report content</li>
                <li>Only authorized staff members can access identifying information</li>
                <li>Reports shared with authorities exclude your personal details when possible</li>
                <li>We maintain strict access controls and audit trails</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Data Security</h3>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 text-sm mb-1">Encryption</h4>
                  <p className="text-xs text-blue-700">All data is encrypted in transit and at rest</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm mb-1">Access Controls</h4>
                  <p className="text-xs text-green-700">Strict role-based access to sensitive information</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 text-sm mb-1">Regular Audits</h4>
                  <p className="text-xs text-purple-700">Security assessments and vulnerability testing</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-800 text-sm mb-1">Monitoring</h4>
                  <p className="text-xs text-orange-700">24/7 system monitoring and incident response</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Your Rights</h3>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Ask us to correct inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain uses of your information</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg mt-3">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Some information may need to be retained for legal compliance, ongoing 
                  investigations, or emergency response purposes.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Data Retention</h3>
              <p className="text-gray-600 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 mt-2">
                <li>Account information: Until you delete your account</li>
                <li>Report data: 7 years or as required by local regulations</li>
                <li>Emergency alerts: 10 years for safety and legal compliance</li>
                <li>Technical logs: 2 years for security and performance monitoring</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Location Services</h3>
              <p className="text-gray-600 leading-relaxed">
                Location information is used to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 mt-2">
                <li>Route reports to the appropriate local authorities</li>
                <li>Provide accurate emergency response coordination</li>
                <li>Show location-relevant information and services</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                You can disable location services in your device settings, but this may limit the effectiveness 
                of certain features, especially emergency responses.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">9. Children's Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Community Call is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have collected such 
                information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">10. Changes to This Policy</h3>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the "last updated" date. We encourage you to 
                review this policy periodically.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">11. Contact Us</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Privacy Officer:</strong> privacy@communitycall.com</p>
                  <p><strong>General Support:</strong> support@communitycall.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Mail:</strong> Community Call Privacy Team<br/>
                     123 Civic Center Dr, City, State 12345</p>
                </div>
              </div>
            </section>

            <section className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Your Trust Matters:</strong> We are committed to protecting your privacy and being 
                  transparent about our data practices. This policy reflects our dedication to responsible 
                  data handling while enabling effective community service delivery.
                </p>
              </div>
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
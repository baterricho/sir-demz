import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Phone, 
  Shield, 
  MapPin, 
  FileText, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Play,
  Book,
  Star
} from 'lucide-react';
import { Page } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Emergency SOS",
      description: "One-tap emergency alerts that instantly notify local authorities and emergency services."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Report Issues",
      description: "Report community problems like broken infrastructure, environmental issues, or safety concerns."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based",
      description: "Automatically detect your location or manually specify where issues are occurring."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Tracking",
      description: "Track the progress of your reports from submission to resolution."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join thousands of citizens working together to improve their communities."
    }
  ];

  const tutorialSteps = [
    {
      title: "Create Your Account",
      description: "Sign up with your basic information to get started with SafetyConnect.",
      image: "📱"
    },
    {
      title: "Explore the Dashboard",
      description: "Familiarize yourself with the main features and navigation options.",
      image: "🏠"
    },
    {
      title: "Submit Your First Report",
      description: "Use the 'Create Report' feature to report community issues or concerns.",
      image: "📝"
    },
    {
      title: "Track Progress",
      description: "Monitor the status of your reports and see how they're being addressed.",
      image: "📊"
    },
    {
      title: "Emergency Features",
      description: "Learn how to use SOS emergency alerts when you need immediate help.",
      image: "🚨"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "25,000+", label: "Reports Resolved" },
    { number: "50+", label: "Communities Served" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SafetyConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
              <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🌟 Trusted by 10,000+ Citizens
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Your Community
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Report. Track. Resolve.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SafetyConnect empowers citizens to report community issues, request emergency assistance, 
            and track progress in real-time. Join the movement to make our communities safer and better.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => onNavigate('login')} 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-lg px-8 py-6"
            >
              Start Reporting Issues
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for community reporting, emergency response, and civic engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in 5 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Follow our quick tutorial to become a SafetyConnect expert.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {tutorialSteps.map((step, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-300 ${
                  activeStep === index ? 'ring-2 ring-blue-500 bg-white' : 'bg-white/70 hover:bg-white'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{step.image}</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of citizens who are already using SafetyConnect to improve their communities. 
            Your voice matters, and together we can create safer, better places to live.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => onNavigate('login')} 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Create Free Account
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
            >
              <Book className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">SafetyConnect</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering communities through connected reporting and emergency response.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => onNavigate('privacy')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('terms')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 SafetyConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import { Heart, Shield, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-emerald-400 mr-2" />
              <span className="text-xl font-bold">MediCare AI</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered medical diagnosis platform providing instant health insights 
              and connecting patients with qualified healthcare professionals.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </div>
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">ML</span>
              </div>
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">95%</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="/diagnosis/heart" className="text-gray-300 hover:text-emerald-400 transition-colors">Health Check</a></li>
              <li><a href="/doctors" className="text-gray-300 hover:text-emerald-400 transition-colors">Find Doctors</a></li>
              <li><a href="/appointments" className="text-gray-300 hover:text-emerald-400 transition-colors">Book Appointment</a></li>
              <li><a href="/medical-records" className="text-gray-300 hover:text-emerald-400 transition-colors">Medical Records</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-gray-300">+91-1800-123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-gray-300">support@medicare-ai.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-gray-300">Available 24/7 Online</span>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="h-5 w-5 text-emerald-400 mr-2" />
              Important Notice
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-300 mb-1">Medical Disclaimer</p>
                    <p className="text-red-200">
                      This AI system is for educational purposes only and should not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200">
                  <strong>Note:</strong> Always consult with qualified healthcare providers for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 MediCare AI. All rights reserved. | 
              <span className="ml-1">Educational Project - Not for Medical Use</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">About</a>
              <a href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact</a>
              <a href="/help" className="text-gray-400 hover:text-emerald-400 transition-colors">Help</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

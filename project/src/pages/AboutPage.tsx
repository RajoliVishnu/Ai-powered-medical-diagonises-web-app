import React from 'react';
import { Heart, Users, Shield, Award, Globe, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Patients', icon: Users },
    { number: '500+', label: 'Expert Doctors', icon: Heart },
    { number: '24/7', label: 'Support Available', icon: Phone },
    { number: '99.9%', label: 'Accuracy Rate', icon: Award }
  ];

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Medical Officer',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: '20+ years in healthcare'
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'AI Research Head',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: '15+ years in medical AI'
    },
    {
      name: 'Amit Patel',
      role: 'Technology Director',
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: '12+ years in healthcare tech'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            About <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">MediCare AI</span>
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Making healthcare accessible to everyone, everywhere through the power of artificial intelligence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-sm text-gray-600 mb-4">
                We believe that quality healthcare should be accessible to everyone, regardless of their location or economic status. 
                Our AI-powered platform bridges the gap between patients and healthcare professionals, especially in remote areas.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">Accurate AI-powered health assessments</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-700 text-sm">Connect with certified medical experts</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-gray-700 text-sm">Available in multiple languages</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Medical team"
                className="rounded-lg shadow-md h-48 object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-2">Our Impact</h2>
            <p className="text-sm text-blue-100">Trusted by thousands across India</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Meet Our Team</h2>
            <p className="text-sm text-gray-600">Experienced professionals dedicated to your health</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                />
                <h3 className="text-sm font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-1 text-xs">{member.role}</p>
                <p className="text-gray-600 text-xs">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Values</h2>
            <p className="text-sm text-gray-600">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Heart className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Compassion</h3>
              <p className="text-gray-600 text-xs">We care deeply about every patient's health and well-being</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Trust</h3>
              <p className="text-gray-600 text-xs">Building trust through transparency and reliable healthcare</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Excellence</h3>
              <p className="text-gray-600 text-xs">Striving for the highest standards in healthcare delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
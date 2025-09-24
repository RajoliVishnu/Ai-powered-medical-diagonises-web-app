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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">MediCare AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Making healthcare accessible to everyone, everywhere through the power of artificial intelligence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that quality healthcare should be accessible to everyone, regardless of their location or economic status. 
                Our AI-powered platform bridges the gap between patients and healthcare professionals, especially in remote areas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Accurate AI-powered health assessments</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Connect with certified medical experts</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="text-gray-700">Available in multiple languages</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Medical team"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">Trusted by thousands across India</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">Experienced professionals dedicated to your health</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassion</h3>
              <p className="text-gray-600">We care deeply about every patient's health and well-being</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">Building trust through transparency and reliable healthcare</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">Striving for the highest standards in healthcare delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
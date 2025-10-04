import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clover as Liver, LucideKey as Kidney, Droplets, ArrowRight, Users, Shield, Clock, Phone, CreditCard, Star, CheckCircle } from 'lucide-react';

const diseases = [
  {
    id: 'heart',
    name: 'Heart Disease',
    description: 'Comprehensive cardiovascular health assessment and risk prediction',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    steps: ['Enter your details', 'Get AI analysis', 'View results', 'Consult doctor']
  },
  {
    id: 'liver',
    name: 'Liver Disease',
    description: 'Advanced liver function analysis and health monitoring',
    icon: Liver,
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-50',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    steps: ['Blood test values', 'AI evaluation', 'Health report', 'Expert advice']
  },
  {
    id: 'kidney',
    name: 'Kidney Disease',
    description: 'Complete renal function evaluation and diagnostic insights',
    icon: Kidney,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    image: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=800',
    steps: ['Urine & blood tests', 'Kidney analysis', 'Risk assessment', 'Treatment plan']
  },
  {
    id: 'diabetes',
    name: 'Diabetes',
    description: 'Intelligent blood sugar monitoring and diabetes risk assessment',
    icon: Droplets,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
    steps: ['Sugar levels check', 'Diabetes screening', 'Risk evaluation', 'Lifestyle advice']
  }
];

const features = [
  {
    icon: Shield,
    title: 'AI-Powered Diagnosis',
    description: 'Advanced machine learning algorithms provide accurate health assessments',
    benefit: 'Get instant results without waiting'
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Connect with certified specialists for personalized medical guidance',
    benefit: 'Talk to real doctors anytime'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Access healthcare insights anytime, anywhere with our platform',
    benefit: 'Healthcare support round the clock'
  },
  {
    icon: Phone,
    title: 'Multiple Languages',
    description: 'Available in Hindi, English, Tamil and other regional languages',
    benefit: 'Use in your preferred language'
  },
  {
    icon: CreditCard,
    title: 'Affordable Pricing',
    description: 'Transparent pricing with UPI, card and other payment options',
    benefit: 'Pay easily with any method'
  },
  {
    icon: Star,
    title: 'Trusted by Thousands',
    description: 'Join over 50,000+ users who trust our healthcare platform',
    benefit: 'Proven results and satisfaction'
  }
];

const howItWorks = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Sign up with your mobile number or email address',
    icon: Users,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    step: 2,
    title: 'Choose Health Check',
    description: 'Select the disease you want to check from our list',
    icon: Heart,
    color: 'bg-green-100 text-green-600'
  },
  {
    step: 3,
    title: 'Enter Your Details',
    description: 'Fill in your health information and test results',
    icon: CheckCircle,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    step: 4,
    title: 'Get AI Results',
    description: 'Receive instant analysis and health recommendations',
    icon: Shield,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    step: 5,
    title: 'Consult Doctor',
    description: 'Book appointment with specialist doctors if needed',
    icon: Phone,
    color: 'bg-teal-100 text-teal-600'
  },
  {
    step: 6,
    title: 'Make Payment',
    description: 'Pay securely using UPI, cards or other methods',
    icon: CreditCard,
    color: 'bg-pink-100 text-pink-600'
  }
];

const Home: React.FC = () => {
  React.useEffect(() => {
    if (window.location.pathname === '/diseases') {
      const el = document.getElementById('diseases');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Replace the URL to base home after scrolling to avoid odd routing state
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Medical Diagnosis
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant, accurate health insights with our advanced AI technology. 
              Connect with medical experts and take control of your health journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/diagnosis/heart"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Health Check
              </Link>
              <Link
                to="/doctors"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all"
              >
                Find Doctors
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div>Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div>Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div>Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₹299</div>
                <div>Starting Price</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your health checked and connect with doctors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Categories Section */}
      <section id="diseases" className="py-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Health Check Options</h2>
            <p className="text-xs text-gray-600 max-w-xl mx-auto">
              Choose from our comprehensive range of AI-powered diagnostic tools
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto">
            {diseases.map((disease) => (
              <div key={disease.id} className="group relative overflow-hidden bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={disease.image}
                    alt={disease.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${disease.color} opacity-80`}></div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
                      <disease.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{disease.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">{disease.description}</p>
                  
                  {/* Process Steps - Ultra Compact */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {disease.steps.slice(0, 2).map((step, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-1"></div>
                          <span className="text-xs">{step.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <Link
                      to={`/diagnosis/${disease.id}`}
                      className="flex items-center justify-center py-1 px-1.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded text-xs font-bold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 hover:scale-105 shadow-sm"
                    >
                      <span>Quick</span>
                      <ArrowRight className="h-2 w-2 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      to={`/comprehensive-diagnosis/${disease.id}`}
                      className="flex items-center justify-center py-1 px-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-xs font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-sm"
                    >
                      <span>Full</span>
                      <ArrowRight className="h-2 w-2 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose MediCare AI?</h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Experience the future of healthcare with our comprehensive medical platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-3 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{feature.description}</p>
                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block">
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Easy Payment Options</h2>
          <p className="text-sm text-gray-600 mb-4">Pay securely using your preferred method</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { name: 'UPI Payment', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
              { name: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
              { name: 'Net Banking', icon: '🏦', desc: 'All major banks' },
              { name: 'Digital Wallets', icon: '💰', desc: 'Paytm, Amazon Pay' }
            ].map((payment, index) => (
              <div key={index} className="bg-white p-2 rounded shadow-sm">
                <div className="text-2xl mb-1">{payment.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-0.5 text-xs">{payment.name}</h4>
                <p className="text-xs text-gray-600">{payment.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">₹299</div>
                <div className="text-gray-600 text-xs">AI Health Check</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">₹999</div>
                <div className="text-gray-600 text-xs">Doctor Consultation</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">₹1,299</div>
                <div className="text-gray-600 text-xs">Complete Package</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust MediCare AI for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctors"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              Consult with Experts
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/diagnosis/heart"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Start Health Check
              <Heart className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Help Section for Remote Users */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help Using This Website?</h3>
          <p className="text-gray-300 mb-6">
            Our support team is available 24/7 to help you navigate and use all features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <Phone className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Call Support</h4>
              <p className="text-sm text-gray-300">+91-1800-123-4567</p>
              <p className="text-xs text-gray-400">Toll Free</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Live Chat</h4>
              <p className="text-sm text-gray-300">Available 24/7</p>
              <p className="text-xs text-gray-400">Instant Help</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Video Guide</h4>
              <p className="text-sm text-gray-300">Step-by-step tutorials</p>
              <p className="text-xs text-gray-400">In your language</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
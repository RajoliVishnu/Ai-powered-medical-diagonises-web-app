import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Mail, Calendar, Filter, Video, MessageSquare, Award, Users, CheckCircle, Heart, Clover as Liver, LucideKey as Kidney, Droplets } from 'lucide-react';
import AppointmentScheduler from '../components/AppointmentScheduler';
import CallInterface from '../components/CallInterface';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15 years',
    rating: 4.9,
    reviews: 127,
    location: 'Apollo Hospital, Mumbai',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,660',
    availability: 'Available Today',
    bio: 'Leading cardiologist specializing in preventive cardiology, heart disease management, and cardiac imaging with 15+ years of experience.',
    education: 'MBBS, MD Cardiology - AIIMS Delhi',
    languages: ['English', 'Hindi', 'Marathi'],
    category: 'heart',
    nextAvailable: '2:00 PM Today',
    achievements: ['Best Cardiologist Award 2023', '500+ Successful Surgeries', 'Research in Heart Disease Prevention'],
    consultationTypes: ['Video Call', 'In-Person', 'Phone Call'],
    specializations: ['Heart Attack Prevention', 'Cardiac Imaging', 'Hypertension Management']
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Hepatologist',
    experience: '12 years',
    rating: 4.8,
    reviews: 89,
    location: 'Fortis Hospital, Delhi',
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,494',
    availability: 'Available Tomorrow',
    bio: 'Expert hepatologist with extensive experience in liver diseases, transplantation, and hepatitis management.',
    education: 'MBBS, DM Hepatology - PGI Chandigarh',
    languages: ['English', 'Hindi', 'Punjabi'],
    category: 'liver',
    nextAvailable: '10:00 AM Tomorrow',
    achievements: ['Liver Transplant Specialist', '200+ Liver Procedures', 'Hepatitis Research Expert'],
    consultationTypes: ['Video Call', 'In-Person'],
    specializations: ['Liver Transplant', 'Hepatitis Treatment', 'Fatty Liver Disease']
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Nephrologist',
    experience: '18 years',
    rating: 4.9,
    reviews: 156,
    location: 'Max Hospital, Bangalore',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,826',
    availability: 'Available Today',
    bio: 'Senior nephrologist specializing in kidney disease, dialysis, and transplantation with focus on chronic kidney disease.',
    education: 'MBBS, DM Nephrology - CMC Vellore',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    category: 'kidney',
    nextAvailable: '3:30 PM Today',
    achievements: ['Kidney Transplant Pioneer', '300+ Dialysis Procedures', 'CKD Research Leader'],
    consultationTypes: ['Video Call', 'In-Person', 'Phone Call'],
    specializations: ['Kidney Transplant', 'Dialysis Management', 'Chronic Kidney Disease']
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Endocrinologist',
    experience: '20 years',
    rating: 4.7,
    reviews: 203,
    location: 'AIIMS, New Delhi',
    image: 'https://images.pexels.com/photos/6749562/pexels-photo-6749562.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,577',
    availability: 'Available This Week',
    bio: 'Senior endocrinologist and diabetes specialist with 20+ years of experience in managing complex endocrine disorders.',
    education: 'MBBS, MD, DM Endocrinology - AIIMS Delhi',
    languages: ['English', 'Hindi'],
    category: 'diabetes',
    nextAvailable: 'Tomorrow 9:00 AM',
    achievements: ['Diabetes Care Excellence Award', '1000+ Diabetes Patients', 'Insulin Therapy Expert'],
    consultationTypes: ['Video Call', 'In-Person', 'Phone Call'],
    specializations: ['Type 1 & 2 Diabetes', 'Insulin Management', 'Thyroid Disorders']
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialty: 'Interventional Cardiologist',
    experience: '10 years',
    rating: 4.8,
    reviews: 95,
    location: 'Medanta Hospital, Gurgaon',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,452',
    availability: 'Available Today',
    bio: 'Interventional cardiologist specializing in minimally invasive heart procedures and coronary interventions.',
    education: 'MBBS, DM Cardiology - Sanjay Gandhi PGIMS',
    languages: ['English', 'Hindi'],
    category: 'heart',
    nextAvailable: '4:00 PM Today',
    achievements: ['Angioplasty Expert', '400+ Heart Procedures', 'Minimally Invasive Surgery'],
    consultationTypes: ['Video Call', 'In-Person'],
    specializations: ['Angioplasty', 'Stent Placement', 'Heart Attack Treatment']
  },
  {
    id: 6,
    name: 'Dr. Robert Kumar',
    specialty: 'Diabetologist',
    experience: '14 years',
    rating: 4.9,
    reviews: 134,
    location: 'Manipal Hospital, Bangalore',
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    fee: '₹1,535',
    availability: 'Available Tomorrow',
    bio: 'Comprehensive diabetes care specialist focusing on advanced insulin management and continuous glucose monitoring.',
    education: 'MBBS, MD Medicine, Fellowship in Diabetes',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    category: 'diabetes',
    nextAvailable: 'Tomorrow 11:30 AM',
    achievements: ['Diabetes Technology Pioneer', '800+ Diabetes Cases', 'CGM Implementation Expert'],
    consultationTypes: ['Video Call', 'In-Person', 'Phone Call'],
    specializations: ['Advanced Insulin Therapy', 'Continuous Glucose Monitoring', 'Diabetic Complications']
  }
];

const specialties = ['All', 'Cardiology', 'Hepatology', 'Nephrology', 'Endocrinology'];

const diseaseIcons = {
  heart: Heart,
  liver: Liver,
  kidney: Kidney,
  diabetes: Droplets
};

const DoctorsPage: React.FC = () => {
  const location = useLocation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [recommendedCategory, setRecommendedCategory] = useState<string | null>(null);

  // Check if user came from a specific disease diagnosis
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const diseaseCategory = searchParams.get('category');
    if (diseaseCategory) {
      setRecommendedCategory(diseaseCategory);
      // Auto-filter doctors based on disease category
      const specialtyMap: { [key: string]: string } = {
        'heart': 'Cardiology',
        'liver': 'Hepatology', 
        'kidney': 'Nephrology',
        'diabetes': 'Endocrinology'
      };
      if (specialtyMap[diseaseCategory]) {
        setSelectedSpecialty(specialtyMap[diseaseCategory]);
      }
    }
  }, [location]);

  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctors 
    : doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase().replace('y', ''))
      );

  // Sort doctors to show recommended category first
  const sortedDoctors = recommendedCategory 
    ? [...filteredDoctors].sort((a, b) => {
        if (a.category === recommendedCategory && b.category !== recommendedCategory) return -1;
        if (a.category !== recommendedCategory && b.category === recommendedCategory) return 1;
        return b.rating - a.rating; // Then sort by rating
      })
    : [...filteredDoctors].sort((a, b) => b.rating - a.rating);

  const handleScheduleAppointment = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setShowScheduler(true);
  };

  const handleInstantCall = (doctor: typeof doctors[0], type: 'video' | 'audio') => {
    setSelectedDoctor(doctor);
    setCallType(type);
    setShowCallInterface(true);
  };

  const handleAppointmentSuccess = () => {
    setShowScheduler(false);
    setSelectedDoctor(null);
  };

  const handleEndCall = () => {
    setShowCallInterface(false);
    setSelectedDoctor(null);
  };

  const getDiseaseIcon = (category: string) => {
    const IconComponent = diseaseIcons[category as keyof typeof diseaseIcons];
    return IconComponent || Heart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Header with Smart Recommendations */}
        <div className="text-center mb-2">
          <h1 className="text-lg font-bold text-gray-900 mb-0.5">
            {recommendedCategory ? (
              <>
                Recommended <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Specialists</span>
              </>
            ) : (
              <>
                Meet Our <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Medical Experts</span>
              </>
            )}
          </h1>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            {recommendedCategory 
              ? `Best specialists for your condition`
              : `Board-certified specialists for personalized care`
            }
          </p>
          
          {recommendedCategory && (
            <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-green-100 to-blue-100 rounded-full border border-green-200">
              {React.createElement(getDiseaseIcon(recommendedCategory), { className: "h-2 w-2 text-green-600 mr-1" })}
              <span className="text-green-800 font-medium text-xs">
                {recommendedCategory} specialists
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-2">
          <div className="bg-white p-1 rounded shadow-sm text-center">
            <div className="text-xs font-bold text-blue-600">{sortedDoctors.length}</div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
          <div className="bg-white p-1 rounded shadow-sm text-center">
            <div className="text-xs font-bold text-green-600">4.8+</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="bg-white p-1 rounded shadow-sm text-center">
            <div className="text-xs font-bold text-orange-600">24/7</div>
            <div className="text-xs text-gray-600">Support</div>
          </div>
          <div className="bg-white p-1 rounded shadow-sm text-center">
            <div className="text-xs font-bold text-purple-600">₹1,200</div>
            <div className="text-xs text-gray-600">Average</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {recommendedCategory ? 'Recommended Specialists' : 'Available Specialists'}
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Filter by specialty:</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sortedDoctors.slice(0, 6).map((doctor, index) => (
            <div key={doctor.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
              recommendedCategory && doctor.category === recommendedCategory ? 'ring-2 ring-green-400 ring-opacity-50' : ''
            }`}>
              {/* Recommended Badge */}
              {recommendedCategory && doctor.category === recommendedCategory && index < 2 && (
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-1 text-xs font-medium">
                  ⭐ Recommended for You
                </div>
              )}

              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-16 object-cover"
                />
                <div className={`absolute top-0.5 right-0.5 px-1 py-0.5 rounded-full text-xs font-medium ${
                  doctor.availability.includes('Today') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doctor.availability}
                </div>
                <div className="absolute top-0.5 left-0.5">
                  {React.createElement(getDiseaseIcon(doctor.category), { 
                    className: "h-2 w-2 text-white bg-black bg-opacity-30 p-0.5 rounded-full" 
                  })}
                </div>
              </div>

              <div className="p-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-xs font-bold text-gray-900">{doctor.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-2 w-2 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-gray-700 ml-0.5">
                      {doctor.rating} ({doctor.reviews})
                    </span>
                  </div>
                </div>

                <p className="text-blue-600 font-semibold mb-0.5 text-xs">{doctor.specialty}</p>
                <p className="text-gray-600 text-xs mb-0.5 line-clamp-1">{doctor.bio}</p>

                {/* Enhanced Details */}
                <div className="space-y-0.5 mb-0.5">
                  <div className="flex items-center text-xs text-gray-600">
                    <Award className="h-2 w-2 mr-1 text-orange-500" />
                    {doctor.experience} exp
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-2 w-2 mr-1 text-red-500" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center text-xs text-green-600 font-medium">
                    <Calendar className="h-2 w-2 mr-1" />
                    {doctor.nextAvailable}
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-0.5">
                  <div className="flex flex-wrap gap-0.5">
                    {doctor.specializations.slice(0, 1).map((spec, idx) => (
                      <span key={idx} className="px-1 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-0.5">
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="h-2 w-2 mr-1" />
                    <span>{doctor.languages.slice(0, 1).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5 border-t border-gray-200 mb-0.5">
                  <div>
                    <span className="text-xs font-bold text-gray-900">{doctor.fee}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-1.5 w-1.5 mr-0.5 text-green-500" />
                    <span className="text-xs">✓</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleScheduleAppointment(doctor)}
                    className="w-full px-1 py-0.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded font-semibold hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center justify-center shadow-sm text-xs"
                  >
                    <Calendar className="h-1.5 w-1.5 mr-0.5" />
                    Book
                  </button>
                  
                  <div className="grid grid-cols-2 gap-0.5">
                    <button
                      onClick={() => handleInstantCall(doctor, 'video')}
                      className="px-0.5 py-0.5 border border-blue-600 text-blue-600 rounded font-medium hover:bg-blue-50 transition-all flex items-center justify-center text-xs"
                    >
                      <Video className="h-1.5 w-1.5 mr-0.5" />
                      📹
                    </button>
                    <button
                      onClick={() => handleInstantCall(doctor, 'audio')}
                      className="px-0.5 py-0.5 border border-green-600 text-green-600 rounded font-medium hover:bg-green-50 transition-all flex items-center justify-center text-xs"
                    >
                      <Phone className="h-1.5 w-1.5 mr-0.5" />
                      📞
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No doctors found message */}
        {sortedDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No doctors found for the selected specialty.</div>
            <button
              onClick={() => setSelectedSpecialty('All')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Doctors
            </button>
          </div>
        )}

        {/* Appointment Scheduler Modal */}
        {showScheduler && selectedDoctor && (
          <AppointmentScheduler
            doctor={selectedDoctor}
            onClose={() => {
              setShowScheduler(false);
              setSelectedDoctor(null);
            }}
            onSuccess={handleAppointmentSuccess}
          />
        )}

        {/* Call Interface */}
        {showCallInterface && selectedDoctor && (
          <CallInterface
            doctor={selectedDoctor}
            callType={callType}
            onEndCall={handleEndCall}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
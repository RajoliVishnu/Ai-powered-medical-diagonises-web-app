import React, { useState } from 'react';
import { Calendar, Clock, User, DollarSign } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctorName: string;
  specialty: string;
  price: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const EnhancedAppointmentScheduler: React.FC = () => {
  const { getRemainingConsultations } = useSubscriptionStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const remainingConsultations = getRemainingConsultations();

  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', price: 150 },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatology', price: 120 },
    { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', price: 100 },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleSchedule = () => {
    if (!selectedTime) return;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      price: 150,
      status: 'scheduled',
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedTime('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
        <p className="text-gray-600">
          Book your consultation. {remainingConsultations !== Infinity && (
            <span className="font-medium text-blue-600">
              {remainingConsultations} consultations remaining
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Date and Time Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date & Time</h2>
          
          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Date</h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 text-center rounded-lg transition-colors ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center rounded-lg transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Button */}
          {selectedTime && (
            <button
              onClick={handleSchedule}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Schedule Appointment - $150
            </button>
          )}
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Doctors</h2>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-2">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        ${doctor.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Appointments</h2>
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctorName}
                      </h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {appointment.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-semibold text-green-600">
                      ${appointment.price}
                    </span>
                    <div className="text-sm text-gray-500 capitalize">
                      {appointment.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAppointmentScheduler; 
import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, MessageCircle, Send, Share2 } from 'lucide-react';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

interface VideoConsultationProps {
  consultationId?: string;
  doctorId?: string;
  patientId?: string;
  isDoctor?: boolean;
}

interface Participant {
  id: string;
  name: string;
  isDoctor: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isDoctor: boolean;
}

const VideoConsultationPage: React.FC<VideoConsultationProps> = ({
  doctorId = 'doc_123',
  patientId = 'patient_123',
  isDoctor = false
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [consultationInfo] = useState({
    doctorName: 'Dr. Sarah Johnson',
    patientName: 'John Doe',
    scheduledTime: '2024-01-15T10:00:00Z',
    duration: 30,
    status: 'active'
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConsultation();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeConsultation = async () => {
    try {
      setIsConnecting(true);
      setError('');

      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock participants
      const mockParticipants: Participant[] = [
        {
          id: isDoctor ? doctorId : patientId,
          name: isDoctor ? consultationInfo.doctorName : consultationInfo.patientName,
          isDoctor: isDoctor,
          isVideoEnabled: true,
          isAudioEnabled: true,
          isScreenSharing: false
        },
        {
          id: isDoctor ? patientId : doctorId,
          name: isDoctor ? consultationInfo.patientName : consultationInfo.doctorName,
          isDoctor: !isDoctor,
          isVideoEnabled: true,
          isAudioEnabled: true,
          isScreenSharing: false
        }
      ];

      setParticipants(mockParticipants);
      setIsConnected(true);
      setIsConnecting(false);

      // Mock initial chat messages
      const initialMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: doctorId,
          senderName: consultationInfo.doctorName,
          message: 'Hello! How are you feeling today?',
          timestamp: new Date().toISOString(),
          isDoctor: true
        },
        {
          id: '2',
          senderId: patientId,
          senderName: consultationInfo.patientName,
          message: 'Hi Doctor, I\'m feeling better today. The medication seems to be working.',
          timestamp: new Date().toISOString(),
          isDoctor: false
        }
      ];
      setChatMessages(initialMessages);

    } catch (error) {
      console.error('Error initializing consultation:', error);
      setError('Failed to connect to consultation. Please try again.');
      setIsConnecting(false);
    }
  };

  const cleanup = () => {
    setIsConnected(false);
    // Cleanup video streams, close connections, etc.
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Update participant state
    setParticipants(prev => prev.map(p => 
      p.id === (isDoctor ? doctorId : patientId) 
        ? { ...p, isVideoEnabled: !isVideoEnabled }
        : p
    ));
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Update participant state
    setParticipants(prev => prev.map(p => 
      p.id === (isDoctor ? doctorId : patientId) 
        ? { ...p, isAudioEnabled: !isAudioEnabled }
        : p
    ));
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Update participant state
    setParticipants(prev => prev.map(p => 
      p.id === (isDoctor ? doctorId : patientId) 
        ? { ...p, isScreenSharing: !isScreenSharing }
        : p
    ));
  };

  const endCall = () => {
    cleanup();
    // Navigate back or show end call confirmation
    window.history.back();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: isDoctor ? doctorId : patientId,
      senderName: isDoctor ? consultationInfo.doctorName : consultationInfo.patientName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isDoctor: isDoctor
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCallDuration = () => {
    // Mock call duration calculation
    const startTime = new Date(consultationInfo.scheduledTime);
    const currentTime = new Date();
    const duration = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000 / 60);
    return `${duration} min`;
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" />
          <h2 className="text-xl font-semibold text-white mt-4 mb-2">
            Connecting to Consultation
          </h2>
          <p className="text-gray-300">
            Please wait while we establish the video connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Error Alert */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50">
          <Alert 
            type="error" 
            title="Connection Error" 
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="text-gray-300">
            {consultationInfo.doctorName} • {getCallDuration()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-300" />
          <span className="text-gray-300">{participants.length} participants</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Video Grid */}
          <div className="flex-1 bg-gray-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                  {isDoctor ? consultationInfo.doctorName : consultationInfo.patientName} (You)
                </div>
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="h-12 w-12 mx-auto mb-2" />
                      <p>Camera Off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Remote Video */}
              <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                  {isDoctor ? consultationInfo.patientName : consultationInfo.doctorName}
                </div>
                {participants.find(p => p.id === (isDoctor ? patientId : doctorId))?.isVideoEnabled === false && (
                  <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="h-12 w-12 mx-auto mb-2" />
                      <p>Camera Off</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
              >
                <Share2 className="h-6 w-6" />
              </button>

              <button
                onClick={endCall}
                className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-gray-300" />
              <h3 className="text-white font-medium">Chat</h3>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isDoctor ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isDoctor
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {message.senderName}
                  </div>
                  <div className="text-sm">{message.message}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationPage;

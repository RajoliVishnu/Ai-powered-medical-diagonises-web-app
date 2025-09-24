import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface CallInterfaceProps {
  onCallEnd: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeakerOn: boolean;
  callDuration: number;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ 
  onCallEnd, 
  onToggleMute, 
  onToggleVideo, 
  onToggleSpeaker, 
  isMuted, 
  isVideoOn, 
  isSpeakerOn, 
  callDuration 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  React.useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('Connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">Dr</span>
            </div>
            <div>
              <h3 className="font-semibold">Medical Consultation</h3>
              <p className="text-sm opacity-75">AI-Powered Diagnosis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">{connectionStatus}</div>
            {isConnected && (
              <div className="font-mono text-lg">{formatDuration(callDuration)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {isVideoOn ? (
          <div className="h-full bg-gray-800 relative">
            {/* Main video area */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              {!isConnected ? (
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to medical consultation...</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">AI</span>
                  </div>
                  <p className="text-lg">AI Medical Consultation</p>
                </div>
              )}
            </div>
            
            {/* User's video (picture-in-picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white text-sm">
                You
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              {!isConnected ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to medical consultation...</p>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">AI</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">AI Medical Consultation</h3>
                  <p className="text-lg opacity-75">Audio Call</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/20 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isVideoOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6 text-white" />
            ) : (
              <VideoOff className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={onToggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isSpeakerOn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
            title={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          >
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </button>

          {/* End Call Button */}
          <button
            onClick={onCallEnd}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
            title="End call"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
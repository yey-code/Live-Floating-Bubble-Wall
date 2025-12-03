import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useGuestConnection } from '../hooks/useGuestConnection';
import { COLORS, ICONS, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, MAX_PROGRAM_LENGTH, SEND_COOLDOWN_MS } from '../types';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import a1sbergLogo from '../assets/a1sberg-logo.png';

interface GuestModeProps {
  roomId: string;
}

export const GuestMode: React.FC<GuestModeProps> = ({ roomId }) => {
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState(COLORS[0].class);
  const [icon, setIcon] = useState(ICONS[0]);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isConnected, error, sendMessage } = useGuestConnection(roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || cooldown || !isConnected) return;

    sendMessage({ 
      name: name.trim() || 'Anonymous', 
      program: program.trim() || 'Guest', 
      text: text.trim(), 
      color, 
      icon 
    });
    
    setIsSending(true);
    setCooldown(true);
    
    // Show success animation
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setName('');
      setProgram('');
      setText('');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }, 300);

    // Cooldown
    setTimeout(() => {
      setCooldown(false);
    }, SEND_COOLDOWN_MS);
  };

  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.MessageCircle;
  
  // Use dark text for lighter shades (200-300)
  const isLightColor = color.includes('-200') || color.includes('-300');
  const textColor = isLightColor ? 'text-gray-800' : 'text-white';
  const iconColor = isLightColor ? 'text-gray-800' : 'text-white';
  const borderColor = isLightColor ? 'border-gray-800/20' : 'border-white/30';

  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
      <div className="max-w-5xl w-full h-full max-h-[96vh] bg-white rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 flex flex-col">
        {/* Header Section */}
        <div className="mb-2 sm:mb-3">
          {/* A1SBERG Logo */}
          <div className="flex justify-center mb-2">
            <img src={a1sbergLogo} alt="A1SBERG" className="h-12 sm:h-14 w-auto" />
          </div>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            Send a Message
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-600">Room: <span className="font-mono font-bold">{roomId}</span></p>
          
          {/* Connection Status */}
          <div className="mt-1">
            {isConnected ? (
              <div className="flex items-center justify-center gap-1.5 text-green-600">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-yellow-600">
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                <span className="text-[10px] sm:text-xs font-medium">Connecting...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-1 flex items-center justify-center gap-1.5 text-red-600">
              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[9px] sm:text-[10px]">{error}</span>
            </div>
          )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
          {/* Name and Program - Side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Name Input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                placeholder="Enter your name"
                className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={MAX_NAME_LENGTH}
              />
            </div>

            {/* Program, Year & Section */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Program, Year & Section
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value.slice(0, MAX_PROGRAM_LENGTH))}
                placeholder="e.g., BSIT 4-2"
                className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={MAX_PROGRAM_LENGTH}
              />
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Your Message *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              placeholder="Type your message..."
              className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <p className="text-[9px] text-gray-500 mt-0.5 text-right">
              {text.length} / {MAX_MESSAGE_LENGTH}
            </p>
          </div>

          {/* Color and Icon Pickers - Side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Color Picker */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Choose Color
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.class}
                    type="button"
                    onClick={() => setColor(c.class)}
                    className={`${c.class} rounded-lg h-10 sm:h-12 transition-all ${
                      color === c.class ? 'ring-4 ring-offset-2 ring-purple-600' : 'hover:opacity-80'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Choose Icon
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {ICONS.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName] || LucideIcons.MessageCircle;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={`p-2 border-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                        icon === iconName
                          ? 'border-purple-500 bg-purple-50 scale-110'
                          : 'border-gray-200 bg-white'
                      }`}
                      title={iconName}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-gray-700" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2.5 sm:p-3 flex-1 flex flex-col min-h-[180px]">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Preview</p>
            <div className="flex-1 flex items-center justify-center">
            <div
              className={`${color} rounded-xl p-3 flex flex-col w-full max-w-[160px] shadow-lg`}
              style={{ minHeight: '140px' }}
            >
              {/* Header */}
              <div className={`flex items-center gap-1.5 mb-1.5 pb-1.5 border-b ${borderColor}`}>
                <IconComponent className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                <p className={`${textColor} text-xs font-bold truncate flex-1`}>
                  {name || 'Your Name'}
                </p>
              </div>
              {/* Program */}
              <div className={`${textColor} opacity-90 text-[10px] font-semibold mb-1.5`}>
                {program || 'BSIT 4-2'}
              </div>
              {/* Message */}
              <p className={`${textColor} text-[10px] leading-tight break-words line-clamp-3`}>
                {text || 'Your message...'}
              </p>
            </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!text.trim() || cooldown || !isConnected || isSending}
            className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
              showSuccess
                ? 'bg-green-500 text-white'
                : !text.trim() || cooldown || !isConnected || isSending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
            }`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Sent!</span>
              </>
            ) : cooldown ? (
              <span>Wait {SEND_COOLDOWN_MS / 1000}s...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

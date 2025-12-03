import React from 'react';
import * as LucideIcons from 'lucide-react';
import { BubbleMessage } from '../types';

interface BubbleProps {
  bubble: BubbleMessage;
}

export const Bubble: React.FC<BubbleProps> = ({ bubble }) => {
  const IconComponent = (LucideIcons as any)[bubble.icon] || LucideIcons.MessageCircle;
  
  // Use dark text for lighter shades (200-300)
  const isLightColor = bubble.color.includes('-200') || bubble.color.includes('-300');
  const textColor = isLightColor ? 'text-gray-800' : 'text-white';
  const iconColor = isLightColor ? 'text-gray-800' : 'text-white';
  const borderColor = isLightColor ? 'border-gray-800/20' : 'border-white/30';

  return (
    <div
      className={`absolute ${bubble.color} rounded-2xl shadow-xl flex flex-col p-4 transition-transform`}
      style={{
        width: '180px',
        minHeight: '180px',
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Header with Icon and Name */}
      <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${borderColor}`}>
        <IconComponent className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        <p className={`${textColor} text-sm font-bold truncate flex-1`}>
          {bubble.name}
        </p>
      </div>
      
      {/* Program, Year & Section */}
      <div className={`${textColor} opacity-90 text-xs font-semibold mb-2`}>
        {bubble.program}
      </div>
      
      {/* Message */}
      <p className={`${textColor} text-xs leading-relaxed break-words flex-1`}>
        {bubble.text}
      </p>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useHostConnection } from '../hooks/useHostConnection';
import { BubbleMessage, MAX_BUBBLES, BUBBLE_SIZE } from '../types';
import { generateUUID } from '../utils';
import { Bubble } from './Bubble';
import { Wifi, WifiOff, Copy, Check } from 'lucide-react';
import a1sbergLogo from '../assets/a1sberg-logo.png';

interface HostModeProps {
  roomId: string;
}

export const HostMode: React.FC<HostModeProps> = ({ roomId }) => {
  const [bubbles, setBubbles] = useState<BubbleMessage[]>([]);
  const [copied, setCopied] = useState(false);
  const { isReady, error, onMessage } = useHostConnection(roomId);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const guestUrl = `${window.location.origin}${window.location.pathname}#room=${roomId}`;
  const hostUrl = `${window.location.origin}${window.location.pathname}?mode=host#room=${roomId}`;

  const copyHostUrl = () => {
    navigator.clipboard.writeText(hostUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle incoming messages
  useEffect(() => {
    onMessage((payload) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      
      // Random spawn position
      const x = Math.random() * (rect.width - BUBBLE_SIZE) + BUBBLE_SIZE / 2;
      const y = Math.random() * (rect.height - BUBBLE_SIZE) + BUBBLE_SIZE / 2;

      // Random velocity
      const speed = 0.5 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const newBubble: BubbleMessage = {
        id: generateUUID(),
        name: payload.name,
        program: payload.program,
        text: payload.text,
        color: payload.color,
        icon: payload.icon,
        x,
        y,
        vx,
        vy,
      };

      setBubbles((prev) => {
        const updated = [...prev, newBubble];
        // Keep only MAX_BUBBLES (FIFO)
        if (updated.length > MAX_BUBBLES) {
          return updated.slice(updated.length - MAX_BUBBLES);
        }
        return updated;
      });
    });
  }, [onMessage]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setBubbles((prev) => {
        const container = containerRef.current;
        if (!container) return prev;

        const rect = container.getBoundingClientRect();
        
        // QR Code box dimensions (top-right corner)
        const qrBox = {
          x: rect.width - 4 * 16 - 232, // right-4 (1rem = 16px) + padding + QR size
          y: 4 * 16, // top-4
          width: 232, // p-6 (24px each side) + 180px QR + 4px extra
          height: 276  // Approximate height including text
        };

        return prev.map((bubble) => {
          let { x, y, vx, vy } = bubble;

          // Update position
          x += vx;
          y += vy;

          // Bounce off walls
          const radius = BUBBLE_SIZE / 2;

          if (x - radius <= 0 || x + radius >= rect.width) {
            vx = -vx;
            x = Math.max(radius, Math.min(rect.width - radius, x));
          }

          if (y - radius <= 0 || y + radius >= rect.height) {
            vy = -vy;
            y = Math.max(radius, Math.min(rect.height - radius, y));
          }

          // Check collision with QR code box
          const bubbleLeft = x - radius;
          const bubbleRight = x + radius;
          const bubbleTop = y - radius;
          const bubbleBottom = y + radius;

          const qrLeft = qrBox.x;
          const qrRight = qrBox.x + qrBox.width;
          const qrTop = qrBox.y;
          const qrBottom = qrBox.y + qrBox.height;

          // Check if bubble overlaps with QR box
          if (bubbleRight > qrLeft && bubbleLeft < qrRight &&
              bubbleBottom > qrTop && bubbleTop < qrBottom) {
            
            // Determine which side of the QR box the bubble is closest to
            const overlapLeft = bubbleRight - qrLeft;
            const overlapRight = qrRight - bubbleLeft;
            const overlapTop = bubbleBottom - qrTop;
            const overlapBottom = qrBottom - bubbleTop;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            // Bounce based on the side with minimum overlap
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              vx = -vx;
              // Push bubble out of collision
              if (minOverlap === overlapLeft) {
                x = qrLeft - radius - 1;
              } else {
                x = qrRight + radius + 1;
              }
            } else {
              vy = -vy;
              // Push bubble out of collision
              if (minOverlap === overlapTop) {
                y = qrTop - radius - 1;
              } else {
                y = qrBottom + radius + 1;
              }
            }
          }

          return { ...bubble, x, y, vx, vy };
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden"
    >
      {/* Status Indicator */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isReady ? (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
            <Wifi className="w-5 h-5" />
            <span className="font-medium">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">Connecting...</span>
          </div>
        )}
        
        {/* Copy Host URL Button */}
        <button
          onClick={copyHostUrl}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-colors"
          title="Copy host URL to stay on this room"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm font-medium">Copy Host URL</span>
            </>
          )}
        </button>
      </div>

      {/* QR Code */}
      <div className="absolute top-4 right-4 z-10 bg-white p-6 rounded-2xl shadow-2xl">
        <div className="mb-3 text-center">
          <p className="text-gray-800 font-bold text-lg mb-1">Scan to Join</p>
          <p className="text-gray-600 text-sm font-mono">{roomId}</p>
        </div>
        <QRCodeSVG value={guestUrl} size={180} level="H" />
      </div>

      {/* Bubble Counter */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full">
        <span className="font-medium">{bubbles.length} / {MAX_BUBBLES} Bubbles</span>
      </div>

      {/* A1SBERG Branding */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
        <img src={a1sbergLogo} alt="A1SBERG" className="h-8 w-auto" />
        <div className="text-left">
          <p className="text-xs font-bold text-gray-800">Powered by</p>
          <p className="text-sm font-bold text-purple-600">A1SBERG</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-4 right-4 z-10 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} />
      ))}

      {/* Welcome Message */}
      {bubbles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">Bubble Message Wall</h1>
            <p className="text-2xl opacity-80">Waiting for messages...</p>
          </div>
        </div>
      )}
    </div>
  );
};

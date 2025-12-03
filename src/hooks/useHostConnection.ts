import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { MessagePayload } from '../types';

interface UseHostConnectionResult {
  peerId: string | null;
  isReady: boolean;
  error: string | null;
  onMessage: (callback: (payload: MessagePayload) => void) => void;
}

export function useHostConnection(roomId: string): UseHostConnectionResult {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const messageCallbackRef = useRef<((payload: MessagePayload) => void) | null>(null);

  useEffect(() => {
    // Create peer with room ID as the peer ID and ICE servers for better connectivity
    const peer = new Peer(roomId, {
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
        ],
      },
    });

    peer.on('open', (id) => {
      setPeerId(id);
      setIsReady(true);
      console.log('Host peer opened with ID:', id);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      // If peer ID is already taken, suggest refreshing
      if (err.type === 'unavailable-id') {
        setError('Room ID already in use. Please refresh the page.');
      } else {
        setError(err.message);
      }
    });

    peer.on('connection', (conn: DataConnection) => {
      console.log('Guest connected:', conn.peer);

      conn.on('data', (data) => {
        console.log('Received data:', data);
        if (messageCallbackRef.current) {
          messageCallbackRef.current(data as MessagePayload);
        }
      });

      conn.on('close', () => {
        console.log('Guest disconnected:', conn.peer);
      });
    });

    peerRef.current = peer;

    return () => {
      peer.destroy();
    };
  }, [roomId]);

  const onMessage = (callback: (payload: MessagePayload) => void) => {
    messageCallbackRef.current = callback;
  };

  return { peerId, isReady, error, onMessage };
}

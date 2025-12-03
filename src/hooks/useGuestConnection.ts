import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { MessagePayload } from '../types';

interface UseGuestConnectionResult {
  isConnected: boolean;
  error: string | null;
  sendMessage: (payload: MessagePayload) => void;
}

export function useGuestConnection(roomId: string): UseGuestConnectionResult {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const reconnectTimeoutRef = useRef<number>();

  useEffect(() => {
    // Create peer for guest with ICE servers for better connectivity
    const peer = new Peer({
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: ['turn:openrelay.metered.ca:80'],
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: ['turn:openrelay.metered.ca:443'],
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: ['turn:openrelay.metered.ca:443?transport=tcp'],
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
        ],
        iceTransportPolicy: 'all',
      },
    });

    const connectToHost = (hostPeerId: string) => {
      console.log('Attempting to connect to host:', hostPeerId);
      const conn = peer.connect(hostPeerId, {
        reliable: true,
        serialization: 'json',
      });
      
      // Set a connection timeout
      const timeout = setTimeout(() => {
        if (!conn.open) {
          console.error('Connection timeout');
          setError('Connection timeout. Please check if the host is online and try refreshing.');
          conn.close();
        }
      }, 15000); // 15 second timeout
      
      conn.on('open', () => {
        clearTimeout(timeout);
        console.log('Connected to host:', hostPeerId);
        setIsConnected(true);
        setError(null);
        connectionRef.current = conn;
      });

      conn.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Connection error:', err);
        setError('Failed to connect to host. Make sure the host is online.');
      });

      conn.on('close', () => {
        clearTimeout(timeout);
        console.log('Connection closed');
        setIsConnected(false);
      });
    };

    peer.on('open', (id) => {
      console.log('Guest peer opened with ID:', id);
      
      // Connect to host using room ID
      connectToHost(roomId);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setError(err.message);
    });

    peerRef.current = peer;

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      peer.destroy();
    };
  }, [roomId]);

  const sendMessage = (payload: MessagePayload) => {
    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send(payload);
      console.log('Message sent:', payload);
    } else {
      console.error('Connection not ready');
      setError('Not connected to host');
    }
  };

  return { isConnected, error, sendMessage };
}

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
    // Create peer for guest
    const peer = new Peer({
      debug: 2,
    });

    const connectToHost = (hostPeerId: string) => {
      console.log('Attempting to connect to host:', hostPeerId);
      const conn = peer.connect(hostPeerId, {
        reliable: true,
      });
      
      conn.on('open', () => {
        console.log('Connected to host:', hostPeerId);
        setIsConnected(true);
        setError(null);
        connectionRef.current = conn;
      });

      conn.on('error', (err) => {
        console.error('Connection error:', err);
        setError('Failed to connect to host. Make sure the host is online.');
      });

      conn.on('close', () => {
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

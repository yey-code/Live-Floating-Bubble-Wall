import { useEffect, useState } from 'react';
import { HostMode } from './components/HostMode';
import { GuestMode } from './components/GuestMode';
import { getRoomIdFromHash, setRoomIdInHash } from './utils';

// Permanent fixed room code
const PERMANENT_ROOM_ID = 'a1sberg-12345';

function App() {
  const [mode, setMode] = useState<'host' | 'guest' | 'loading'>('loading');
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    // Check URL parameters for mode
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    
    // Check if there's a room ID in the URL hash
    const existingRoomId = getRoomIdFromHash();

    if (existingRoomId && modeParam !== 'host') {
      // Guest mode - there's a room ID and we're not explicitly in host mode
      setRoomId(existingRoomId);
      setMode('guest');
    } else if (existingRoomId && modeParam === 'host') {
      // Host mode with existing room ID
      setRoomId(existingRoomId);
      setMode('host');
    } else {
      // Host mode - use permanent fixed room ID
      setRoomId(PERMANENT_ROOM_ID);
      setRoomIdInHash(PERMANENT_ROOM_ID);
      setMode('host');
    }
  }, []);

  if (mode === 'loading') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      {mode === 'host' ? (
        <HostMode roomId={roomId} />
      ) : (
        <GuestMode roomId={roomId} />
      )}
    </>
  );
}

export default App;

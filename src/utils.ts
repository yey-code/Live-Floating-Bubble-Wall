export function generateRoomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRoomIdFromHash(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/#room=([A-Za-z0-9\-]+)/);
  return match ? match[1] : null;
}

export function setRoomIdInHash(roomId: string): void {
  window.location.hash = `#room=${roomId}`;
}

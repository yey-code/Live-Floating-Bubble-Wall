# A1SBERG Bubble Message Wall

A lightweight, browser-based interactive display system for events that allows hosts to project floating message bubbles while attendees send messages in real-time using their smartphones.

## ✨ Features

- **Zero-Config Deployment**: Runs as a purely static site (no backend, no database)
- **No Persistent Storage**: All messages are ephemeral and transmitted peer-to-peer
- **Instant Delivery**: < 500ms latency from send to display
- **Visual Appeal**: 60fps physics-based bubble animation with collision detection
- **Privacy-First**: No data storage, GDPR/CCPA compliant
- **Mobile-Friendly**: Optimized for iOS Safari and Android Chrome with dark mode support
- **TURN/STUN Support**: Works on mobile data networks with NAT traversal
- **Collision Detection**: Bubbles bounce off walls and the QR code area

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown (typically `http://localhost:5173`)

### Production Build

```bash
npm run build
```

The static files will be generated in the `dist/` folder.

## 📱 How to Use

### For Hosts (Event Organizers)

1. Open the website (e.g., `https://live-floating-bubble-wall.vercel.app`)
2. A unique room code will be automatically generated (e.g., `a1sberg-1733241567892345`)
3. A QR code will appear on the screen
4. Click "Copy Host URL" to save your specific room link for later use
5. Guests scan the QR code or use the shared link to join your session

### For Guests (Attendees)

1. Scan the QR code displayed on the screen
2. Enter your name and program/section (optional)
3. Type your message (max 100 characters)
4. Choose a color and icon
5. Hit "Send Message"
6. Watch your message appear on the big screen!

## 🏗️ Architecture

### Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **P2P Communication**: PeerJS (WebRTC)
- **QR Codes**: qrcode.react
- **ICE Servers**: Google STUN + OpenRelay TURN servers

### How It Works

1. **Host Mode**: 
   - Generates a unique room ID with timestamp
   - Creates a PeerJS peer acting as the "server"
   - Displays QR code for guests to join
   - Renders bubbles with physics-based animation
   - Detects collisions with QR code area

2. **Guest Mode**:
   - Extracts room ID from URL hash
   - Connects to host's PeerJS peer via WebRTC
   - Sends message payloads directly to host
   - Works on WiFi and mobile data (TURN relay)

3. **Message Flow**:
   ```
   Guest → PeerJS WebRTC → Host → Bubble Animation
   ```

### Data Structure

```typescript
interface BubbleMessage {
  id: string;      // UUID
  name: string;    // Sender name
  program: string; // Program/section
  text: string;    // Message content
  color: string;   // Tailwind class
  icon: string;    // Icon name
  vx: number;      // Velocity X
  vy: number;      // Velocity Y
  x: number;       // Position X
  y: number;       // Position Y
}
```

## 🌐 Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to GitHub Pages:
   ```bash
   # Using gh-pages package
   npm install -g gh-pages
   gh-pages -d dist
   ```

3. Configure GitHub Pages in repository settings to use the `gh-pages` branch

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project

### Netlify

1. Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

OR

2. Use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## ⚙️ Configuration

### Maximum Bubbles

Edit `src/types.ts`:

```typescript
export const MAX_BUBBLES = 20; // Change this number
```

### Bubble Size

Edit `src/types.ts`:

```typescript
export const BUBBLE_SIZE = 120; // Change this number (pixels)
```

### Send Cooldown

Edit `src/types.ts`:

```typescript
export const SEND_COOLDOWN_MS = 2000; // Change this number (milliseconds)
```

### Available Colors

Edit `src/types.ts` to add/remove colors:

```typescript
export const COLORS = [
  { name: 'Pink', class: 'bg-pink-400' },
  // Add more...
];
```

### Available Icons

Edit `src/types.ts` to add/remove icons (from Lucide React):

```typescript
export const ICONS = [
  'Heart',
  'Star',
  // Add more...
];
```

## 🔒 Privacy & Security

- **No Data Storage**: Messages exist only in browser memory
- **Ephemeral Sessions**: All data is lost when the page refreshes
- **No User Accounts**: Complete anonymity for guests
- **No Tracking**: No analytics or cookies
- **GDPR Compliant**: No personal data collection
- **Peer-to-Peer**: Direct connections, no data passes through servers

## ⚠️ Known Limitations

### Session Persistence
- **Room sessions are temporary**: Rooms only exist while the host browser window is open
- **Closing the host browser**: Ends the session and invalidates all guest connections
- **Bookmarked URLs**: Work only if the host maintains the same session
- **No backend storage**: Messages and sessions are not saved or recoverable

### Network Connectivity
- **Mobile data reliability**: While TURN servers help, some mobile carriers may restrict WebRTC
- **Free TURN servers**: Public servers may have rate limits or occasional downtime
- **Corporate networks**: May block WebRTC ports (3478, 5349)
- **Firewall restrictions**: Strict NAT configurations may prevent connections

### Scalability
- **Recommended**: Up to 50 concurrent guests per host session
- **Performance**: Large numbers of simultaneous connections may impact host device
- **TURN relay**: Free servers have bandwidth limitations for many users

### Browser Compatibility
- **Safari limitations**: Older iOS versions may have WebRTC restrictions
- **Private browsing**: May disable WebRTC in some browsers
- **Extensions**: Ad blockers may interfere with peer connections

**For production use with guaranteed reliability:**
1. Deploy your own TURN server
2. Use a dedicated host device
3. Ensure stable WiFi for the host
4. Test connectivity before the event

## 🐛 Troubleshooting

### Connection Issues on Mobile Data

The app includes TURN/STUN servers to improve connectivity on mobile data networks. However, some limitations may still exist:

**What works:**
- ✅ WiFi connections (both host and guests)
- ✅ Host on WiFi, guests on mobile data (most cases)
- ✅ Host on WiFi, guests on different networks

**Potential issues:**
- ⚠️ Both host and guests on strict NAT/firewall networks
- ⚠️ Corporate networks with WebRTC restrictions
- ⚠️ Some mobile carriers block WebRTC traffic

**Solutions:**
1. Ensure the host is on a stable WiFi connection
2. Ask guests to refresh if they see "Connecting..." for >15 seconds
3. Check that WebRTC is enabled in browser settings
4. Try a different browser (Chrome recommended)
5. If persistent issues occur, consider using a VPN

**Technical Note:** The app uses free public TURN servers (OpenRelay) which may have rate limits during peak usage. For production events with many users, consider deploying your own TURN server.

### Room ID Already in Use

If you see this error:
- The room ID is being used by another instance
- Refresh the host page to generate a new unique ID
- Use the "Copy Host URL" to save your specific room for reuse

### PeerJS Connection Issues

If peers can't connect:

1. Check your firewall settings
2. Ensure WebRTC is enabled in your browser
3. Try using a different PeerJS server:

Edit `src/hooks/useHostConnection.ts` and `src/hooks/useGuestConnection.ts`:

```typescript
const peer = new Peer(roomId, {
  host: 'your-peerjs-server.com',
  port: 9000,
  path: '/myapp'
});
```

### Performance Issues

If animation is laggy:

1. Reduce `MAX_BUBBLES` in `src/types.ts`
2. Disable browser extensions
3. Use a modern browser (Chrome, Firefox, Safari)
4. Close other tabs/applications

## 🗺️ Future Roadmap

- [ ] Moderation mode (delete specific bubbles)
- [ ] Custom backgrounds (upload logos)
- [ ] Sound effects (pop sounds)
- [ ] Bubble collision detection
- [ ] Animation speed controls
- [ ] Export session statistics
- [ ] Custom color themes

## 📄 License

MIT License - feel free to use for your events!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Use Cases

- 🎵 DJ Sets & Concerts
- 🎓 Classroom Activities
- 🏢 Corporate Events
- 💒 Weddings & Parties
- 📊 Conferences & Meetups
- 🎮 Gaming Streams

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for the event community

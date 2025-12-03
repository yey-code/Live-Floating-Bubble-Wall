# Ephemeral Bubble Message Wall

A lightweight, browser-based interactive display system for events that allows hosts to project floating message bubbles while attendees send messages in real-time using their smartphones.

## ✨ Features

- **Zero-Config Deployment**: Runs as a purely static site (no backend, no database)
- **No Persistent Storage**: All messages are ephemeral and transmitted peer-to-peer
- **Instant Delivery**: < 500ms latency from send to display
- **Visual Appeal**: 60fps physics-based bubble animation
- **Privacy-First**: No data storage, GDPR/CCPA compliant
- **Mobile-Friendly**: Works on iOS Safari and Android Chrome

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

1. Open the website on your laptop/projector
2. A unique room code will be automatically generated
3. A QR code will appear on the screen
4. Guests scan the QR code to join your session

### For Guests (Attendees)

1. Scan the QR code displayed on the screen
2. Type your message (max 60 characters)
3. Choose a color and icon
4. Hit "Send Message"
5. Watch your message appear on the big screen!

## 🏗️ Architecture

### Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **P2P Communication**: PeerJS (WebRTC)
- **QR Codes**: qrcode.react

### How It Works

1. **Host Mode**: 
   - Generates a unique room ID
   - Creates a PeerJS peer acting as the "server"
   - Displays QR code for guests to join
   - Renders bubbles with physics-based animation

2. **Guest Mode**:
   - Extracts room ID from URL hash
   - Connects to host's PeerJS peer
   - Sends message payloads directly to host

3. **Message Flow**:
   ```
   Guest → PeerJS WebRTC → Host → Bubble Animation
   ```

### Data Structure

```typescript
interface BubbleMessage {
  id: string;      // UUID
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

## 🐛 Troubleshooting

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

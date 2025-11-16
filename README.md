# YouTube Fallacy Checker

An AI-powered Chrome extension that detects logical fallacies in YouTube videos and displays real-time notifications at the exact timestamps where they occur.

## Features

- 🎯 **Real-time Fallacy Detection**: AI analyzes video transcripts and identifies logical fallacies
- ⏰ **Timestamp Notifications**: Popup alerts appear exactly when a fallacy is mentioned in the video
- 📝 **Transcript View**: Browse the full transcript with highlighted fallacies
- 🤖 **OpenRouter AI Integration**: Powered by GPT-4 via OpenRouter for accurate analysis
- ⚙️ **Easy Configuration**: Simple settings panel for API key management

## Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/filiksyos/youtube-fallacy-checker.git
   cd youtube-fallacy-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Configuration

### Get an OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Generate an API key
4. Copy your API key (starts with `sk-or-v1-...`)

### Set Up the Extension

1. Navigate to any YouTube video
2. Click the Fallacy Checker icon in your toolbar (or press **Alt+F**)
3. Click the settings icon (⚙️) in the sidebar
4. Paste your OpenRouter API key
5. Click "Save Settings"

## Usage

1. **Open the sidebar**: Click the extension icon or press **Alt+F** on any YouTube video
2. **Wait for analysis**: The extension will automatically fetch the transcript and analyze it for fallacies
3. **Watch for notifications**: As you watch the video, popup notifications will appear when fallacies are detected
4. **Browse the transcript**: Scroll through the transcript in the sidebar to see all detected fallacies
5. **Jump to timestamps**: Click any timestamp to jump to that moment in the video

## Common Fallacies Detected

- **Ad Hominem**: Attacking the person instead of the argument
- **Straw Man**: Misrepresenting someone's argument
- **False Dichotomy**: Presenting only two options when more exist
- **Appeal to Authority**: Using authority as evidence inappropriately
- **Slippery Slope**: Claiming extreme consequences without evidence
- **Circular Reasoning**: Using the conclusion as a premise
- **Hasty Generalization**: Drawing broad conclusions from limited evidence
- **Red Herring**: Introducing irrelevant information
- **Appeal to Emotion**: Using emotions instead of logic
- **Bandwagon**: Arguing something is true because many believe it

## Development

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Project Structure
```
youtube-fallacy-checker/
├── src/
│   ├── extension/           # Extension scripts
│   │   ├── background.js    # Service worker
│   │   ├── content_script.js # Video monitoring
│   │   └── extension.jsx    # React initialization
│   ├── sidebar/             # Main UI
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.scss
│   ├── services/            # Core services
│   │   ├── VideoDataService.ts
│   │   ├── OpenRouterService.ts
│   │   └── FallacyDetectionService.ts
│   ├── components/          # React components
│   │   ├── FallacyPopup.tsx
│   │   ├── TranscriptView.tsx
│   │   └── Settings.tsx
│   ├── utils/               # Utilities
│   │   ├── timeUtils.ts
│   │   └── fallacyPrompt.ts
│   └── types/               # TypeScript types
├── icons/                   # Extension icons
├── manifest.json            # Chrome extension manifest
└── package.json
```

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **@crxjs/vite-plugin**: Chrome extension development
- **Tailwind CSS**: Styling
- **OpenRouter AI**: Fallacy detection via GPT-4
- **js-tiktoken**: Token counting

## Privacy & Data

- Your OpenRouter API key is stored locally in Chrome's storage
- Video transcripts are sent to OpenRouter for analysis
- No data is stored on external servers
- The extension only runs on YouTube pages

## Troubleshooting

### "No transcript available"
- The video must have captions/subtitles enabled
- Try videos with auto-generated captions

### "Invalid API key"
- Verify your API key starts with `sk-or-v1-`
- Check that you copied the entire key
- Ensure you have credits in your OpenRouter account

### Fallacies not appearing
- Wait for the analysis to complete (loading indicator)
- Some videos may not contain fallacies
- Check the transcript view to see all detected fallacies

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Based on [TubeTalk](https://github.com/2mawi2/tubetalk) by 2mawi2

## Support

For issues and questions, please [open an issue](https://github.com/filiksyos/youtube-fallacy-checker/issues) on GitHub.
# Deal Coach 🤖

A full-stack AI-powered sales opportunity analysis tool that listens to your deal descriptions, transcribes them, and provides intelligent pipeline stage assessments and risk analysis.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **Speech**: Web Speech API (browser-based transcription)
- **Runtime**: Single monorepo, perfect for GitHub Codespaces

## Features

- 🎤 **Voice Recording**: Click-to-record interface with real-time feedback
- 🗣️ **Live Transcription**: Real-time speech-to-text using Web Speech API
- 🤖 **AI Analysis**: Rule-based deal analysis (ready for LLM integration)
- 📊 **Pipeline Staging**: Automatic classification (Discovery → Qualified → Evaluation → Procurement → Commit)
- ⚠️ **Risk Assessment**: 0-100% risk scoring with visual indicators
- ✅ **Insights**: Positives and negatives extraction from deal conversations
- 🎨 **Modern UI**: Dark theme, gradient effects, smooth animations

## Getting Started

### Running in GitHub Codespaces (Recommended)

1. **Open in Codespaces**
   - Click the green "Code" button on GitHub
   - Select "Open with Codespaces"
   - Create a new codespace or use an existing one

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 3001) and frontend (port 5173) concurrently.

4. **Access the Application**
   - Codespaces will automatically forward ports
   - Look for the **"Ports"** tab in the bottom panel
   - Click the **globe icon** next to port 5173 to open the frontend
   - The URL will look like: `https://your-codespace-name-5173.preview.app.github.dev`

5. **Enable Microphone Access**
   - Your browser will prompt for microphone permissions
   - Click "Allow" to enable voice recording

### Running Locally

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd deal-coach
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend (Vite dev server)
- `npm run dev:server` - Start only the backend (Express server with hot reload)

## Project Structure

```
deal-coach/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # React entry point
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── index.css      # Tailwind CSS imports
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── server/                # Backend Express app
│   ├── src/
│   │   ├── index.ts       # Express server
│   │   ├── analyzeDeal.ts # Deal analysis logic
│   │   └── types.ts       # TypeScript type definitions
│   ├── tsconfig.json
│   └── package.json
├── package.json           # Root workspace configuration
└── README.md
```

## How It Works

### Frontend Flow

1. **User clicks microphone button** → Starts audio recording + Web Speech API
2. **Real-time transcription** → Shows live text as you speak
3. **User clicks stop** → Sends audio blob to backend API
4. **Display results** → Shows pipeline stage, risk score, insights

### Backend Flow

1. **Receives audio blob** → POST `/api/analyze-deal`
2. **Transcription (stubbed)** → Returns hardcoded transcript (ready for Whisper integration)
3. **Analysis** → Rule-based keyword detection and scoring
4. **Returns JSON** → Transcript + analysis object

### Analysis Logic

The `analyzeDeal` function uses keyword detection to extract:

- **Facts**: Champion, economic buyer, budget, timeline, procurement, legal, competition
- **Pipeline Stage**: Based on conversation maturity and deal progression
- **Risk Score**: Calculated from presence/absence of key deal elements
- **Positives/Negatives**: Actionable insights for sales reps

## Future Enhancements

- [ ] Replace stub transcription with OpenAI Whisper API
- [ ] Add LLM-based analysis (GPT-4, Claude, etc.)
- [ ] Store deal history and track changes over time
- [ ] Add coaching recommendations and next steps
- [ ] Multi-language support
- [ ] Export reports to PDF/CSV
- [ ] Team collaboration features

## API Endpoints

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### `POST /api/analyze-deal`
Analyze a sales deal from audio recording

**Request:**
- `Content-Type: multipart/form-data`
- `audio`: Audio file (WAV, WebM, etc.)

**Response:**
```json
{
  "transcript": "This is a fake transcript about a deal...",
  "analysis": {
    "pipelineStage": "QUALIFIED",
    "riskScore": 0.45,
    "summary": "QUALIFIED stage deal with medium risk; needs executive engagement.",
    "positives": [
      "Internal champion identified and engaged",
      "Clear timeline established"
    ],
    "negatives": [
      "Economic buyer not yet engaged",
      "Budget not confirmed"
    ],
    "extractedFacts": {
      "hasChampion": true,
      "hasEconomicBuyer": false,
      "hasBudget": false,
      "hasTimeline": true,
      "procurementInvolved": false,
      "legalInvolved": false,
      "competitionPresent": false
    }
  }
}
```

## Browser Compatibility

- **Web Speech API**: Works best in Chrome/Edge (full support)
- **Safari**: Partial support, may require user interaction
- **Firefox**: Limited support for Web Speech API

For production, consider using a server-side speech-to-text service like:
- OpenAI Whisper
- Google Cloud Speech-to-Text
- Azure Speech Services

## Troubleshooting

### Microphone not working
- Ensure you've granted microphone permissions in your browser
- Check if your browser supports the Web Speech API
- In Codespaces, use Chrome or Edge for best compatibility

### Ports not forwarding in Codespaces
- Check the "Ports" tab in the bottom panel
- Make sure ports 3001 and 5173 are listed
- Set port 5173 visibility to "Public" if needed

### CORS errors
- The Vite proxy is configured to forward `/api` requests to port 3001
- Ensure both frontend and backend are running

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
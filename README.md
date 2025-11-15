# Deal Coach 🤖

A full-stack AI-powered sales opportunity analysis tool that listens to your deal descriptions, transcribes them, and provides intelligent pipeline stage assessments and risk analysis.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **AI**: Claude API (Anthropic) for intelligent deal analysis
- **Speech**: Web Speech API (browser-based transcription)
- **Runtime**: Single monorepo, perfect for GitHub Codespaces

## Features

- 🎤 **Voice Recording**: Click-to-record interface with real-time feedback
- 🗣️ **Live Transcription**: Real-time speech-to-text using Web Speech API
- 🤖 **AI Analysis**: Claude-powered intelligent deal analysis with structured insights
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

3. **Configure API Key**
   - Create a `.env` file in the root directory
   - Add your Anthropic API key:
     ```bash
     ANTHROPIC_API_KEY=your_api_key_here
     ```
   - Get your API key from: https://console.anthropic.com/

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 3001) and frontend (port 5173) concurrently.

   **Note:** If you don't set the API key, the app will still run but will return fallback analysis instead of AI-powered insights.

5. **Access the Application**
   - Codespaces will automatically forward ports
   - Look for the **"Ports"** tab in the bottom panel
   - Click the **globe icon** next to port 5173 to open the frontend
   - The URL will look like: `https://your-codespace-name-5173.preview.app.github.dev`

6. **Enable Microphone Access**
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

3. **Configure API Key**
   - Create a `.env` file in the root directory
   - Add your Anthropic API key:
     ```bash
     ANTHROPIC_API_KEY=your_api_key_here
     ```
   - Get your API key from: https://console.anthropic.com/

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
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

1. **User clicks microphone button** → Starts Web Speech API for real-time transcription
2. **Real-time transcription** → Shows live text as you speak
3. **User clicks stop** → Sends transcript text to backend API
4. **Display results** → Shows pipeline stage, risk score, insights

### Backend Flow

1. **Receives transcript** → POST `/api/analyze-deal` with JSON body `{ transcript: string }`
2. **Claude API Call** → Sends transcript to Claude with expert sales coaching prompt
3. **Analysis** → Claude extracts facts, determines stage, calculates risk, provides insights
4. **Returns JSON** → Structured analysis with pipeline stage, risk score, positives, negatives

### Analysis Logic

The `analyzeDeal` function uses Claude AI to:

- **Facts**: Champion, economic buyer, budget, timeline, procurement, legal, competition
- **Pipeline Stage**: Based on conversation maturity and deal progression
- **Risk Score**: Calculated from presence/absence of key deal elements
- **Positives/Negatives**: Actionable insights for sales reps

## Future Enhancements

- [ ] Add server-side transcription with OpenAI Whisper API (currently using browser Web Speech API)
- [ ] Store deal history and track changes over time
- [ ] Add coaching recommendations and next steps based on Claude's analysis
- [ ] Multi-language support
- [ ] Export reports to PDF/CSV
- [ ] Team collaboration features
- [ ] Integration with CRM systems (Salesforce, HubSpot, etc.)

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
Analyze a sales deal from transcript text

**Request:**
- `Content-Type: application/json`
- Body: `{ "transcript": string }`

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
      "accountName": "Acme Corp",
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

### API key issues
- If you see "Analysis unavailable - API key not configured", check your `.env` file
- Make sure `ANTHROPIC_API_KEY` is set in the `.env` file in the root directory
- Get your API key from: https://console.anthropic.com/
- Restart the server after adding the API key

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
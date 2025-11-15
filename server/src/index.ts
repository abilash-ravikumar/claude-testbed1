import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeDeal } from './analyzeDeal';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for handling audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main endpoint: Analyze deal from audio
app.post('/api/analyze-deal', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    console.log('Received analyze-deal request');

    // For now, we're stubbing the transcription
    // In the future, this will use Whisper or another STT service
    const stubTranscript = "This is a fake transcript about a deal with a champion and no economic buyer yet. We have a timeline of end of quarter and they're very excited about the solution. There's some concern about budget approval but we have an internal advocate pushing hard for this.";

    console.log('Using stub transcript:', stubTranscript);

    // Analyze the deal
    const analysis = analyzeDeal(stubTranscript);

    // Return both the transcript and analysis
    res.json({
      transcript: stubTranscript,
      analysis,
    });
  } catch (error) {
    console.error('Error analyzing deal:', error);
    res.status(500).json({
      error: 'Failed to analyze deal',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Deal Coach server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { analyzeDeal } from './analyzeDeal';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main endpoint: Analyze deal from transcript
app.post('/api/analyze-deal', async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Request body must include a "transcript" string',
      });
    }

    console.log('Received analyze-deal request with transcript length:', transcript.length);

    // Analyze the deal using Claude AI
    const analysis = await analyzeDeal(transcript);

    // Return both the transcript and analysis
    res.json({
      transcript,
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

  // Check for API key and warn if missing
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set!');
    console.warn('   Set it in a .env file or environment variable to enable AI analysis.');
    console.warn('   The app will run but return fallback analysis.');
  } else {
    console.log('✅ ANTHROPIC_API_KEY configured');
  }
});

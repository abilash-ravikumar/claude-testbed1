import { useState, useEffect, useRef } from 'react';
import { DealAnalysis, AnalyzeResponse } from './types';

type AppState = 'idle' | 'listening' | 'processing' | 'complete';

// Declare Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null);
  const [botMessage, setBotMessage] = useState<string>('Ready to analyze your deal');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcriptPiece + ' ');
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (interimTranscript) {
          setTranscript(prev => {
            const lastFinalIndex = prev.lastIndexOf(' ');
            return prev.substring(0, lastFinalIndex + 1) + interimTranscript;
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition API not supported in this browser');
    }
  }, []);

  const startRecording = async () => {
    try {
      // Reset state
      setTranscript('');
      setFinalTranscript('');
      setAnalysis(null);
      audioChunksRef.current = [];

      // Update UI
      setState('listening');
      setBotMessage('Listening... Tell me about your deal');

      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setState('idle');
      setBotMessage('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = async () => {
        // Update state
        setState('processing');
        setBotMessage('Analyzing your deal...');

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Send to backend
        await analyzeDeal(audioBlob);

        // Stop all tracks
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  };

  const analyzeDeal = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/analyze-deal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze deal');
      }

      const data: AnalyzeResponse = await response.json();

      // Update with final transcript from backend
      setFinalTranscript(data.transcript);
      setTranscript(data.transcript);
      setAnalysis(data.analysis);
      setState('complete');
      setBotMessage('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing deal:', error);
      setState('idle');
      setBotMessage('Error analyzing deal. Please try again.');
    }
  };

  const handleMicClick = () => {
    if (state === 'idle' || state === 'complete') {
      startRecording();
    } else if (state === 'listening') {
      stopRecording();
    }
  };

  const resetApp = () => {
    setState('idle');
    setTranscript('');
    setFinalTranscript('');
    setAnalysis(null);
    setBotMessage('Ready to analyze your deal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Deal Coach
          </h1>
          <p className="text-center text-gray-400 mt-2">AI-powered sales opportunity analysis</p>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Column - Bot Avatar / Chat */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center justify-center border border-gray-700">
            <div className="relative mb-6">
              {/* Bot Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl shadow-2xl">
                🤖
              </div>
              {state === 'listening' && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse-ring"></div>
              )}
            </div>

            {/* Bot Message */}
            <div className="bg-gray-700/50 rounded-2xl p-6 max-w-md text-center">
              <p className="text-lg text-gray-200">{botMessage}</p>
              {state === 'listening' && (
                <p className="text-sm text-blue-400 mt-2 animate-pulse">Listening...</p>
              )}
              {state === 'processing' && (
                <div className="flex items-center justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {state === 'complete' && (
              <button
                onClick={resetApp}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Analyze Another Deal
              </button>
            )}
          </div>

          {/* Right Column - Transcription & Results */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 overflow-y-auto border border-gray-700">
            {/* Transcription Section */}
            {(transcript || finalTranscript) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-blue-400">Transcription</h2>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-200 leading-relaxed">
                    {finalTranscript || transcript}
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-400">Analysis</h2>

                {/* Pipeline Stage */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-sm text-gray-400 mb-1">Pipeline Stage</div>
                  <div className="text-2xl font-bold text-blue-300">{analysis.pipelineStage}</div>
                </div>

                {/* Risk Score */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Risk Score</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-600 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          analysis.riskScore < 0.3
                            ? 'bg-green-500'
                            : analysis.riskScore < 0.7
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.riskScore * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Math.round(analysis.riskScore * 100)}%
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Summary</div>
                  <p className="text-gray-200">{analysis.summary}</p>
                </div>

                {/* Positives */}
                {analysis.positives.length > 0 && (
                  <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                    <div className="text-sm text-green-400 mb-2 font-semibold">✓ Positives</div>
                    <ul className="space-y-1">
                      {analysis.positives.map((positive, index) => (
                        <li key={index} className="text-gray-200 text-sm flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {positive}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Negatives */}
                {analysis.negatives.length > 0 && (
                  <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
                    <div className="text-sm text-red-400 mb-2 font-semibold">⚠ Risk Factors</div>
                    <ul className="space-y-1">
                      {analysis.negatives.map((negative, index) => (
                        <li key={index} className="text-gray-200 text-sm flex items-start">
                          <span className="text-red-400 mr-2">•</span>
                          {negative}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!transcript && !analysis && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  <p className="text-lg">Click the microphone to start</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mic Button - Fixed at bottom center */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleMicClick}
            disabled={state === 'processing'}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-2xl ${
              state === 'listening'
                ? 'bg-red-600 hover:bg-red-700 animate-pulse-ring'
                : state === 'processing'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {state === 'listening' ? '⏹️' : state === 'processing' ? '⏳' : '🎤'}
            {state === 'listening' && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-pulse-ring" style={{ animationDelay: '0.3s' }}></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

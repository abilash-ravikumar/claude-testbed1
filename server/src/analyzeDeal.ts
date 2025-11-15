import Anthropic from '@anthropic-ai/sdk';
import { DealAnalysis, PipelineStage } from './types';

/**
 * Analyzes a deal transcript using Claude AI
 * @param transcript - The transcribed text from the sales call
 * @returns DealAnalysis object with stage, risk, and insights
 */
export async function analyzeDeal(transcript: string): Promise<DealAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, returning fallback analysis');
    return getFallbackAnalysis(transcript);
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const systemPrompt = `You are an expert B2B SaaS sales deal coach. Given a transcript of a sales rep describing a deal, you must extract facts and classify the pipeline stage.

Your response MUST be valid JSON matching this exact TypeScript shape:

{
  "pipelineStage": "DISCOVERY" | "QUALIFIED" | "EVALUATION" | "PROCUREMENT" | "COMMIT",
  "riskScore": number,  // 0 to 1, where 0 is no risk and 1 is very high risk
  "summary": string,    // One sentence summarizing the deal status
  "positives": string[], // Array of positive signals (2-5 items)
  "negatives": string[], // Array of risk factors or concerns (2-5 items)
  "extractedFacts": {
    "accountName": string | null,           // Company/account name if mentioned
    "hasChampion": boolean,                  // Internal advocate present
    "hasEconomicBuyer": boolean,             // Decision maker engaged
    "hasBudget": boolean,                    // Budget confirmed or discussed
    "hasTimeline": boolean,                  // Clear timeline mentioned
    "procurementInvolved": boolean,          // Procurement/purchasing involved
    "legalInvolved": boolean,                // Legal review in process
    "competitionPresent": boolean            // Competing vendors mentioned
  }
}

Pipeline stages:
- DISCOVERY: Initial conversations, need identification
- QUALIFIED: Budget, authority, need, timeline (BANT) established
- EVALUATION: Technical validation, POC, demos
- PROCUREMENT: Legal/contract review, purchasing involved
- COMMIT: Deal signed/committed

Respond ONLY with the JSON object, no other text.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this sales deal transcript:\n\n${transcript}`,
        },
      ],
    });

    // Extract the text content from Claude's response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const responseText = content.text;

    // Try to parse JSON from the response
    let analysisData: any;
    try {
      // First try to parse directly
      analysisData = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find any JSON object in the response
        const objectMatch = responseText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          analysisData = JSON.parse(objectMatch[0]);
        } else {
          throw new Error('Could not extract JSON from Claude response');
        }
      }
    }

    // Validate and normalize the response
    const analysis: DealAnalysis = {
      pipelineStage: validatePipelineStage(analysisData.pipelineStage),
      riskScore: normalizeRiskScore(analysisData.riskScore),
      summary: analysisData.summary || 'Deal analysis completed',
      positives: Array.isArray(analysisData.positives) ? analysisData.positives : [],
      negatives: Array.isArray(analysisData.negatives) ? analysisData.negatives : [],
      extractedFacts: {
        accountName: analysisData.extractedFacts?.accountName || null,
        hasChampion: !!analysisData.extractedFacts?.hasChampion,
        hasEconomicBuyer: !!analysisData.extractedFacts?.hasEconomicBuyer,
        hasBudget: !!analysisData.extractedFacts?.hasBudget,
        hasTimeline: !!analysisData.extractedFacts?.hasTimeline,
        procurementInvolved: !!analysisData.extractedFacts?.procurementInvolved,
        legalInvolved: !!analysisData.extractedFacts?.legalInvolved,
        competitionPresent: !!analysisData.extractedFacts?.competitionPresent,
      },
    };

    return analysis;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return getFallbackAnalysis(transcript);
  }
}

/**
 * Validates and normalizes pipeline stage values
 */
function validatePipelineStage(stage: any): PipelineStage {
  const validStages: PipelineStage[] = ['DISCOVERY', 'QUALIFIED', 'EVALUATION', 'PROCUREMENT', 'COMMIT'];
  const upperStage = String(stage).toUpperCase();

  if (validStages.includes(upperStage as PipelineStage)) {
    return upperStage as PipelineStage;
  }

  return 'DISCOVERY';
}

/**
 * Normalizes risk score to 0-1 range
 */
function normalizeRiskScore(score: any): number {
  const num = Number(score);
  if (isNaN(num)) return 0.5;
  return Math.max(0, Math.min(1, num));
}

/**
 * Returns a safe fallback analysis when API key is missing or API call fails
 */
function getFallbackAnalysis(transcript: string): DealAnalysis {
  return {
    pipelineStage: 'DISCOVERY',
    riskScore: 0.5,
    summary: 'Analysis unavailable - API key not configured',
    positives: ['Transcript captured successfully'],
    negatives: ['Unable to perform AI analysis - check API configuration'],
    extractedFacts: {
      accountName: null,
      hasChampion: false,
      hasEconomicBuyer: false,
      hasBudget: false,
      hasTimeline: false,
      procurementInvolved: false,
      legalInvolved: false,
      competitionPresent: false,
    },
  };
}

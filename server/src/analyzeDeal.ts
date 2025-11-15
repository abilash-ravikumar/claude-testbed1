import { DealAnalysis, ExtractedFacts, PipelineStage } from './types';

/**
 * Analyzes a deal transcript using rule-based keyword detection
 * @param transcript - The transcribed text from the sales call
 * @returns DealAnalysis object with stage, risk, and insights
 */
export function analyzeDeal(transcript: string): DealAnalysis {
  const lowerTranscript = transcript.toLowerCase();

  // Extract facts from transcript
  const facts: ExtractedFacts = {
    hasChampion: hasKeywords(lowerTranscript, ['champion', 'internal advocate', 'supporter', 'pushing for']),
    hasEconomicBuyer: hasKeywords(lowerTranscript, ['economic buyer', 'decision maker', 'ceo', 'cfo', 'vp', 'executive', 'final decision', 'sign off']),
    hasBudget: hasKeywords(lowerTranscript, ['budget', 'allocated', 'funding', 'approved', 'price', 'cost']),
    hasTimeline: hasKeywords(lowerTranscript, ['timeline', 'deadline', 'by end of', 'quarter', 'month', 'urgent', 'asap']),
    procurementInvolved: hasKeywords(lowerTranscript, ['procurement', 'purchasing', 'vendor', 'contract review']),
    legalInvolved: hasKeywords(lowerTranscript, ['legal', 'contract', 'terms', 'compliance', 'security review']),
    competitionPresent: hasKeywords(lowerTranscript, ['competitor', 'alternative', 'evaluating others', 'other vendors', 'comparing'])
  };

  // Determine pipeline stage
  const stage = determinePipelineStage(lowerTranscript, facts);

  // Calculate risk score (0-1, higher = more risk)
  const riskScore = calculateRiskScore(facts, lowerTranscript);

  // Generate positives and negatives
  const positives = generatePositives(facts, lowerTranscript);
  const negatives = generateNegatives(facts, lowerTranscript);

  // Generate summary
  const summary = generateSummary(stage, riskScore, facts);

  return {
    pipelineStage: stage,
    riskScore,
    summary,
    positives,
    negatives,
    extractedFacts: facts
  };
}

function hasKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}

function determinePipelineStage(transcript: string, facts: ExtractedFacts): PipelineStage {
  // COMMIT: Contract signed, legal approved, procurement complete
  if (hasKeywords(transcript, ['signed', 'contract signed', 'deal closed', 'executed'])) {
    return 'COMMIT';
  }

  // PROCUREMENT: Legal/procurement involved, paperwork stage
  if (facts.procurementInvolved || facts.legalInvolved) {
    if (hasKeywords(transcript, ['reviewing', 'red lines', 'negotiating terms'])) {
      return 'PROCUREMENT';
    }
  }

  // EVALUATION: Technical validation, POC, deep evaluation
  if (hasKeywords(transcript, ['poc', 'proof of concept', 'trial', 'pilot', 'evaluation', 'testing', 'demo'])) {
    return 'EVALUATION';
  }

  // QUALIFIED: Has basic BANT (Budget, Authority, Need, Timeline)
  const hasBasicQualification = (facts.hasBudget || facts.hasEconomicBuyer) && facts.hasTimeline;
  if (hasBasicQualification) {
    return 'QUALIFIED';
  }

  // Default: DISCOVERY
  return 'DISCOVERY';
}

function calculateRiskScore(facts: ExtractedFacts, transcript: string): number {
  let risk = 0.5; // Start at medium risk

  // Reduce risk for positive signals
  if (facts.hasChampion) risk -= 0.15;
  if (facts.hasEconomicBuyer) risk -= 0.15;
  if (facts.hasBudget) risk -= 0.1;
  if (facts.hasTimeline) risk -= 0.05;

  // Increase risk for negative signals
  if (!facts.hasChampion) risk += 0.1;
  if (!facts.hasEconomicBuyer) risk += 0.15;
  if (facts.competitionPresent) risk += 0.1;
  if (hasKeywords(transcript, ['budget cut', 'no budget', 'delayed', 'postponed', 'uncertain'])) risk += 0.15;
  if (hasKeywords(transcript, ['concern', 'worried', 'hesitant', 'pushback', 'resistance'])) risk += 0.1;

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, risk));
}

function generatePositives(facts: ExtractedFacts, transcript: string): string[] {
  const positives: string[] = [];

  if (facts.hasChampion) {
    positives.push('Internal champion identified and engaged');
  }
  if (facts.hasEconomicBuyer) {
    positives.push('Economic buyer/decision maker involved');
  }
  if (facts.hasBudget) {
    positives.push('Budget discussed or allocated');
  }
  if (facts.hasTimeline) {
    positives.push('Clear timeline established');
  }
  if (hasKeywords(transcript, ['excited', 'enthusiastic', 'perfect fit', 'exactly what we need'])) {
    positives.push('High enthusiasm and interest expressed');
  }
  if (hasKeywords(transcript, ['urgent', 'asap', 'priority', 'critical'])) {
    positives.push('High urgency and priority');
  }

  if (positives.length === 0) {
    positives.push('Initial contact established');
  }

  return positives;
}

function generateNegatives(facts: ExtractedFacts, transcript: string): string[] {
  const negatives: string[] = [];

  if (!facts.hasChampion) {
    negatives.push('No internal champion identified yet');
  }
  if (!facts.hasEconomicBuyer) {
    negatives.push('Economic buyer not yet engaged');
  }
  if (!facts.hasBudget) {
    negatives.push('Budget not confirmed');
  }
  if (!facts.hasTimeline) {
    negatives.push('No clear timeline established');
  }
  if (facts.competitionPresent) {
    negatives.push('Competition present in the evaluation');
  }
  if (hasKeywords(transcript, ['concern', 'worried', 'hesitant'])) {
    negatives.push('Concerns or hesitation detected');
  }
  if (hasKeywords(transcript, ['delayed', 'postponed', 'on hold'])) {
    negatives.push('Deal timing may be at risk');
  }

  return negatives;
}

function generateSummary(stage: PipelineStage, riskScore: number, facts: ExtractedFacts): string {
  const riskLevel = riskScore < 0.3 ? 'low' : riskScore < 0.7 ? 'medium' : 'high';
  const stageLabel = stage.toLowerCase().replace('_', ' ');

  if (facts.hasChampion && facts.hasEconomicBuyer) {
    return `${stage} stage deal with strong stakeholder engagement and ${riskLevel} risk.`;
  } else if (!facts.hasEconomicBuyer) {
    return `${stage} stage deal with ${riskLevel} risk; needs executive engagement.`;
  } else {
    return `${stage} stage deal with ${riskLevel} risk; continue qualification.`;
  }
}

export type PipelineStage = "DISCOVERY" | "QUALIFIED" | "EVALUATION" | "PROCUREMENT" | "COMMIT";

export interface ExtractedFacts {
  accountName?: string;
  hasChampion?: boolean;
  hasEconomicBuyer?: boolean;
  hasBudget?: boolean;
  hasTimeline?: boolean;
  procurementInvolved?: boolean;
  legalInvolved?: boolean;
  competitionPresent?: boolean;
}

export interface DealAnalysis {
  pipelineStage: PipelineStage;
  riskScore: number;
  summary: string;
  positives: string[];
  negatives: string[];
  extractedFacts: ExtractedFacts;
}

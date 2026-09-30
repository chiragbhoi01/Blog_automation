export interface AudienceRules {
  targetAudience: string;
  problemFocus: string;
  behavioralBottleneck: string;
}

export interface ToneRules {
  tone: string;
  readingLevel: string; // e.g., "Grade 8-9"
  targetSentenceAvgWords: number; // e.g., 14-22
  maxParagraphSentences: number; // e.g., 3-4
  maxParagraphWords: number; // e.g., 65
}

export interface SectionWordCountGuidance {
  introductionAndTldr: { min: number; max: number };
  whyAudienceOutgrows: { min: number; max: number };
  evaluationCriteria: { min: number; max: number };
  demolyProfile: { min: number; max: number };
  competitorProfileEach: { min: number; max: number };
  comparisonMatrix: { min: number; max: number };
  conclusion: { min: number; max: number };
  faqTotal: { min: number; max: number };
  totalArticle: { min: number; max: number };
}

export interface ToolProfileRules {
  requireVisualReference: boolean;
  requiredSubheadings: string[];
  maxWordsPerProfile: number;
}

export interface DemolyRules {
  positionNumber: number;
  requireFactualStrengths: boolean;
  requireFactualLimitations: boolean;
  allowOverpromoting: boolean;
}

export interface LanguageRules {
  bannedPhrases: string[];
  emDashLimit: number;
}

export interface TableRules {
  requiredColumns: string[];
  outputFormat: 'HTML_TABLE' | 'TIPTAP_JSON';
}

export interface FaqRules {
  exactCount: number;
  maxAnswerWords: number;
  mustBeFinalSubstantiveSection: boolean;
}

export interface PricingRules {
  requireVerification: boolean;
  disclaimerText: string;
}

export interface FactClaim {
  claim: string;
  category: 'PRICING' | 'FEATURE' | 'SECURITY' | 'LIMITATION';
  source?: string;
  sourceUrl?: string;
  retrievedDate?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verified: boolean;
}

export interface EditorialBlueprint {
  id: string;
  version: string;
  promptVersion: string;
  cluster: string;
  articleType: string;
  audienceRules: AudienceRules;
  toneRules: ToneRules;
  architectureRules: {
    headingSequence: string[];
    faqIsFinalSection: boolean;
  };
  sectionWordCounts: SectionWordCountGuidance;
  toolProfileRules: ToolProfileRules;
  demolyRules: DemolyRules;
  languageRules: LanguageRules;
  tableRules: TableRules;
  faqRules: FaqRules;
  pricingRules: PricingRules;
  bannedPhrases: string[];
}

export type RuleSeverity = 'HARD_BLOCK' | 'WARNING' | 'FACT_REVIEW';

export interface QACheckItem {
  id: string;
  category: 'STRUCTURE' | 'CONTENT' | 'LANGUAGE' | 'SEO' | 'FORMATTING' | 'FACT';
  description: string;
  severity: RuleSeverity;
  passed: boolean;
  details?: string;
}

export interface QAResult {
  passed: boolean;
  score?: number | null;
  errors: string[];
  warnings: string[];
  factReviewClaims: FactClaim[];
  checks: {
    structure: boolean;
    faq: boolean;
    table: boolean;
    readability: boolean;
    pricing: boolean;
    demolyPositioning: boolean;
    competitorFairness: boolean;
    seo: boolean;
  };
}

export interface BlueprintVersionInfo {
  blueprintId: string;
  blueprintVersion: string;
  promptVersion: string;
}

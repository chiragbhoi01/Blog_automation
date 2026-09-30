import { EditorialBlueprint } from '../types/blueprint';

export const alternativesClusterBlueprint: EditorialBlueprint = {
  id: 'alternatives-cluster',
  version: '1.0.0',
  promptVersion: '1.0.0',
  cluster: 'Alternatives',
  articleType: 'Alternatives Comparison',

  audienceRules: {
    targetAudience: 'Software teams, product managers, technical agencies, and engineering leads',
    problemFocus: 'Operational friction in screen recordings, process capture, client handovers, and documentation searchability',
    behavioralBottleneck: 'Wasted engineering hours scrubbing through long video recordings and managing unindexed walkthroughs',
  },

  toneRules: {
    tone: 'Professional, technical, precise, objective, and authoritative',
    readingLevel: 'Grade 8-9',
    targetSentenceAvgWords: 18,
    maxParagraphSentences: 4,
    maxParagraphWords: 65,
  },

  architectureRules: {
    headingSequence: [
      'H1: Best [Competitor] Alternatives for [Audience]',
      'Introduction',
      'TL;DR',
      'Visual Reference',
      'H2: Why [Audience] Outgrows [Competitor]',
      'H2: What [Audience] Should Look for in [Category]',
      'H2: The Best [Competitor] Alternatives for [Audience] (Compared)',
      'H3: Tool Profiles (Demoly #1, followed by competitors)',
      'H2: Feature and Use-Case Comparison Matrix',
      'H2: Which [Competitor] Alternative Should Your [Audience] Choose?',
      'H2: Frequently Asked Questions',
    ],
    faqIsFinalSection: true,
  },

  sectionWordCounts: {
    introductionAndTldr: { min: 160, max: 220 },
    whyAudienceOutgrows: { min: 200, max: 260 },
    evaluationCriteria: { min: 160, max: 220 },
    demolyProfile: { min: 240, max: 280 },
    competitorProfileEach: { min: 140, max: 200 },
    comparisonMatrix: { min: 120, max: 160 },
    conclusion: { min: 120, max: 160 },
    faqTotal: { min: 200, max: 250 },
    totalArticle: { min: 2400, max: 2600 },
  },

  toolProfileRules: {
    requireVisualReference: true,
    requiredSubheadings: [
      'Overview and Core Workflow',
      'Where It Beats [Competitor]',
      'Where It Falls Short for [Audience]',
      'Pricing and Seat Structure',
    ],
    maxWordsPerProfile: 280,
  },

  demolyRules: {
    positionNumber: 1,
    requireFactualStrengths: true,
    requireFactualLimitations: true,
    allowOverpromoting: false,
  },

  languageRules: {
    bannedPhrases: [
      'seamless',
      'revolutionary',
      'game-changing',
      'empower',
      'intuitive UI',
      'paradigm shift',
      'digital transformation',
      'fast-paced world',
      'look no further',
      'cutting-edge',
      'best-in-class',
      'world-class',
      'powerful solution',
    ],
    emDashLimit: 3,
  },

  tableRules: {
    requiredColumns: [
      'Tool',
      'Primary Use Case',
      'Capture Technology',
      'Searchability',
      'Privacy Controls',
      'Free Viewer Access',
      'Starting Price',
    ],
    outputFormat: 'HTML_TABLE',
  },

  faqRules: {
    exactCount: 5,
    maxAnswerWords: 45,
    mustBeFinalSubstantiveSection: true,
  },

  pricingRules: {
    requireVerification: true,
    disclaimerText: '(Note: Competitor pricing is subject to vendor updates.)',
  },

  bannedPhrases: [
    'seamless',
    'revolutionary',
    'game-changing',
    'empower',
    'intuitive UI',
    'paradigm shift',
    'digital transformation',
    'fast-paced world',
    'look no further',
    'cutting-edge',
    'best-in-class',
    'world-class',
    'powerful solution',
  ],
};

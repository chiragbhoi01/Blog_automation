import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { uploadCoverImage } from './cloudinary.service';

export interface CompetitorBadge {
  name: string;
  brandColor: string;
  textColor: string;
  badgeLabel: string;
}

export interface ImageSpec {
  category: string;
  orangeTitle: string;
  darkTitle: string;
  subtitle: string;
  searchQuery: string;
  jumpSteps: Array<{ time: string; text: string }>;
  topAnnotation: string;
  bottomAnnotation: string;
  cornerAnnotation: string;
  competitor?: CompetitorBadge;
}

const KNOWN_COMPETITORS: Record<string, { brandColor: string; textColor: string; label: string }> = {
  'loom': { brandColor: '#625DF5', textColor: '#FFFFFF', label: '✦ Loom' },
  'scribe': { brandColor: '#5E17EB', textColor: '#FFFFFF', label: '◈ Scribe' },
  'tango': { brandColor: '#FA4A6F', textColor: '#FFFFFF', label: '▲ Tango' },
  'supademo': { brandColor: '#6C5CE7', textColor: '#FFFFFF', label: '⚡ Supademo' },
  'guidde': { brandColor: '#00B4D8', textColor: '#FFFFFF', label: '❖ Guidde' },
  'arcade': { brandColor: '#8B5CF6', textColor: '#FFFFFF', label: '● Arcade' },
  'storylane': { brandColor: '#2563EB', textColor: '#FFFFFF', label: '◆ Storylane' },
  'navattic': { brandColor: '#059669', textColor: '#FFFFFF', label: '■ Navattic' },
  'walnut': { brandColor: '#D97706', textColor: '#FFFFFF', label: '🌰 Walnut' },
  'iorad': { brandColor: '#1D4ED8', textColor: '#FFFFFF', label: 'io iorad' },
  'camtasia': { brandColor: '#059669', textColor: '#FFFFFF', label: '▶ Camtasia' },
  'screen studio': { brandColor: '#DB2777', textColor: '#FFFFFF', label: '🎬 Screen Studio' },
  'clickup': { brandColor: '#7B68EE', textColor: '#FFFFFF', label: '✓ ClickUp' },
  'vidyard': { brandColor: '#16A34A', textColor: '#FFFFFF', label: '🎥 Vidyard' },
  'jam.dev': { brandColor: '#7C3AED', textColor: '#FFFFFF', label: '🍓 Jam.dev' },
  'jam': { brandColor: '#7C3AED', textColor: '#FFFFFF', label: '🍓 Jam.dev' },
  'bugherd': { brandColor: '#0D9488', textColor: '#FFFFFF', label: '🐛 BugHerd' },
  'marker.io': { brandColor: '#F59E0B', textColor: '#FFFFFF', label: '✏ Marker.io' },
  'google drive': { brandColor: '#0F9D58', textColor: '#FFFFFF', label: '📁 Google Drive' },
};

export class ImageGeneratorService {
  private logoBase64: string = '';

  constructor() {
    this.loadLogo();
  }

  private loadLogo() {
    const logoPaths = [
      path.resolve(process.cwd(), 'drafts', 'assets', 'demoly_logo.png'),
      path.resolve(process.cwd(), 'content-generation', 'drafts', 'assets', 'demoly_logo.png'),
      path.resolve(__dirname, '..', '..', 'drafts', 'assets', 'demoly_logo.png'),
    ];

    for (const p of logoPaths) {
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        this.logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
        break;
      }
    }
  }

  private detectCompetitor(title: string): CompetitorBadge | undefined {
    const lower = title.toLowerCase();
    for (const [key, data] of Object.entries(KNOWN_COMPETITORS)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(lower)) {
        const capitalizedName = key.charAt(0).toUpperCase() + key.slice(1);
        return {
          name: capitalizedName,
          brandColor: data.brandColor,
          textColor: data.textColor,
          badgeLabel: data.label,
        };
      }
    }
    return undefined;
  }

  public deriveSpecFromTitle(title: string, excerpt?: string): ImageSpec {
    const cleanTitle = title.trim();
    const lower = cleanTitle.toLowerCase();
    const competitor = this.detectCompetitor(cleanTitle);

    let category = 'GUIDE';
    let topAnnotation = 'Ask. Find. Jump.';
    let bottomAnnotation = 'Record. Explain. Share.';
    let cornerAnnotation = 'Better client handoffs.';
    let searchQuery = 'Where did you create the project?';
    let jumpSteps = [
      { time: '02:14', text: 'Click on Create project' },
      { time: '02:16', text: 'Fill in the project details' },
      { time: '02:24', text: 'Project created successfully' },
    ];

    if (lower.includes('alternative') || lower.includes('alternatives')) {
      category = 'ALTERNATIVES';
      topAnnotation = 'Zero viewer friction.';
      bottomAnnotation = 'Interactive DOM Demos.';
      cornerAnnotation = 'No seat limits.';
      
      const compName = competitor ? competitor.name : 'Competitor';
      searchQuery = `Why switch from ${compName} to Demoly?`;
      jumpSteps = [
        { time: '01:10', text: `Core bottleneck with ${compName}` },
        { time: '02:45', text: 'Interactive DOM search drawer' },
        { time: '04:20', text: 'Instant client view (No login)' },
      ];
    } else if (lower.includes('vs')) {
      category = 'COMPARISON';
      topAnnotation = 'Side-by-side breakdown.';
      bottomAnnotation = 'Pixel vs DOM capture.';
      cornerAnnotation = 'Choose the right tool.';
      const compName = competitor ? competitor.name : 'Competitor';
      searchQuery = `Demoly vs ${compName}: Which is faster?`;
      jumpSteps = [
        { time: '01:30', text: `${compName} vs Demoly feature test` },
        { time: '03:15', text: 'AI visual search comparison' },
        { time: '05:00', text: 'Final agency verdict' },
      ];
    } else if (lower.includes('pricing') || lower.includes('cost')) {
      category = 'PRICING';
      topAnnotation = 'Save 40%+ monthly.';
      bottomAnnotation = 'Unlimited viewer seats.';
      cornerAnnotation = 'Transparent pricing.';
      const compName = competitor ? competitor.name : 'Tool';
      searchQuery = `What are the hidden ${compName} fees?`;
      jumpSteps = [
        { time: '00:45', text: 'Creator seat cost comparison' },
        { time: '02:10', text: 'Free viewer access policy' },
        { time: '03:50', text: 'ROI for agency teams' },
      ];
    } else if (lower.includes('qa') || lower.includes('bug')) {
      category = 'ENGINEERING';
      topAnnotation = 'Zero repro friction.';
      bottomAnnotation = 'Console + Network logs.';
      cornerAnnotation = 'Devs fix bugs 3x faster.';
      searchQuery = 'Where did the 500 error occur?';
      jumpSteps = [
        { time: '01:05', text: 'Inspect console error trace' },
        { time: '02:18', text: 'Network request payload inspection' },
        { time: '03:30', text: 'Exact DOM click coordinates' },
      ];
    } else if (lower.includes('checklist')) {
      category = 'CHECKLIST';
      topAnnotation = 'Step-by-step audit.';
      bottomAnnotation = 'Never miss a deliverable.';
      cornerAnnotation = 'Agency standard.';
      searchQuery = 'What are the essential handover steps?';
      jumpSteps = [
        { time: '00:50', text: 'Credentials & access setup' },
        { time: '02:30', text: 'DOM walkthrough recording' },
        { time: '04:15', text: 'Final client sign-off' },
      ];
    } else if (lower.includes('dom') || lower.includes('pixel')) {
      category = 'TECH DEEP DIVE';
      topAnnotation = 'Next-gen architecture.';
      bottomAnnotation = 'State changes vs video pixels.';
      cornerAnnotation = 'Queryable video tech.';
      searchQuery = 'How does DOM search find clicks?';
      jumpSteps = [
        { time: '01:15', text: 'DOM tree capture vs MP4' },
        { time: '02:40', text: 'Frame-layer secret redaction' },
        { time: '04:10', text: 'Instant sub-second text search' },
      ];
    }

    // Split title intelligently into Orange Accent + Dark Text
    let orangeTitle = '';
    let darkTitle = '';

    if (cleanTitle.includes(':')) {
      const parts = cleanTitle.split(':');
      orangeTitle = (parts[0] || '').trim();
      darkTitle = (parts[1] || '').trim();
    } else if (cleanTitle.toLowerCase().startsWith('best ') && cleanTitle.toLowerCase().includes(' alternatives for ')) {
      const match = cleanTitle.match(/^(Best\s+[\w\s.]+\s+Alternatives)\s+for\s+(.+)$/i);
      if (match && match[1] && match[2]) {
        orangeTitle = match[1];
        darkTitle = `for ${match[2]}`;
      } else {
        const words = cleanTitle.split(' ');
        orangeTitle = words.slice(0, 3).join(' ');
        darkTitle = words.slice(3).join(' ');
      }
    } else {
      const words = cleanTitle.split(' ');
      if (words.length <= 4) {
        orangeTitle = words.slice(0, 2).join(' ');
        darkTitle = words.slice(2).join(' ');
      } else {
        orangeTitle = words.slice(0, Math.ceil(words.length / 2)).join(' ');
        darkTitle = words.slice(Math.ceil(words.length / 2)).join(' ');
      }
    }

    let subtitle = excerpt || '';
    if (!subtitle || subtitle.length > 120) {
      subtitle = 'Turn browser recordings into searchable, interactive walkthroughs for your team and clients.';
    }

    return {
      category,
      orangeTitle,
      darkTitle,
      subtitle,
      searchQuery,
      jumpSteps,
      topAnnotation,
      bottomAnnotation,
      cornerAnnotation,
      competitor,
    };
  }

  public generateSvg(spec: ImageSpec): string {
    const width = 1200;
    const height = 630;

    // Helper for SVG escaping
    const escapeXml = (unsafe: string) =>
      unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const cat = escapeXml(spec.category);
    const orangeText = escapeXml(spec.orangeTitle);
    const darkText = escapeXml(spec.darkTitle);
    const sub = escapeXml(spec.subtitle);
    const query = escapeXml(spec.searchQuery);
    const topNote = escapeXml(spec.topAnnotation);
    const botNote = escapeXml(spec.bottomAnnotation);
    const cornerNote = escapeXml(spec.cornerAnnotation);

    const wrap = (text: string, maxChars: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let current = '';
      for (const w of words) {
        if ((current ? current + ' ' + w : w).length <= maxChars) {
          current = current ? current + ' ' + w : w;
        } else {
          if (current) lines.push(current);
          current = w;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    const step1 = spec.jumpSteps[0] || { time: '01:10', text: 'Overview & setup' };
    const step2 = spec.jumpSteps[1] || { time: '02:25', text: 'Interactive DOM search' };
    const step3 = spec.jumpSteps[2] || { time: '03:40', text: 'Client handoff complete' };

    const orangeLines = wrap(orangeText, 22);
    const darkLines = wrap(darkText, 22);
    const subLines = wrap(sub, 42).slice(0, 3);
    const orangeStartY = 205;
    const darkStartY = orangeStartY + orangeLines.length * 40;
    const subStartY = darkStartY + darkLines.length * 40 + 10;

    const comp = spec.competitor;
    const compBadgeLabel = comp ? escapeXml(comp.badgeLabel) : '';
    const catBadgeWidth = cat.length * 9 + 26;

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Caveat:wght@600;700&amp;display=swap');
      .font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .font-hand { font-family: 'Caveat', 'Comic Sans MS', cursive, sans-serif; }
    </style>
    
    <!-- Background Gradients -->
    <linearGradient id="bgGradient" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FBFBFB" />
      <stop offset="50%" stop-color="#F7F8F9" />
      <stop offset="100%" stop-color="#F2F3F5" />
    </linearGradient>

    <!-- Warm Ambient Radial Glow -->
    <radialGradient id="warmGlow" cx="950" cy="180" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5722" stop-opacity="0.09" />
      <stop offset="60%" stop-color="#FF5722" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#FF5722" stop-opacity="0" />
    </radialGradient>

    <!-- Soft Drop Shadows -->
    <filter id="windowShadow" x="480" y="90" width="680" height="480" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0F172A" flood-opacity="0.10" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.05" />
    </filter>

    <filter id="floatingCardShadow" x="720" y="130" width="440" height="340" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#FF5722" flood-opacity="0.12" />
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.10" />
    </filter>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  <rect width="1200" height="630" fill="url(#warmGlow)" />

  <!-- Corner Brackets -->
  <path d="M 520 120 L 520 100 L 540 100" stroke="#FF5722" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85" />
  <path d="M 1155 490 L 1175 490 L 1175 470" stroke="#FF5722" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85" />

  <!-- TOP-LEFT: Demoly Brand Logo -->
  <g transform="translate(60, 48)">
    ${
      this.logoBase64
        ? `<image href="${this.logoBase64}" width="140" height="42" preserveAspectRatio="xMidYMid meet" />`
        : `
      <!-- Fallback SVG Vector Logo -->
      <g transform="scale(0.85)">
        <rect x="0" y="2" width="6" height="36" rx="3" fill="#111827" />
        <rect x="0" y="18" width="16" height="4" rx="2" fill="#FF5722" />
        <path d="M 10 2 Q 42 2 42 20 Q 42 38 10 38 Z" fill="none" stroke="#111827" stroke-width="8" stroke-linejoin="round" />
        <polygon points="18,12 32,20 18,28" fill="#FF5722" />
        <text x="50" y="30" class="font-inter" font-size="30" font-weight="800" fill="#111827">Demoly</text>
      </g>
    `
    }
  </g>

  <!-- LEFT COLUMN: Typography & Value Proposition -->
  <!-- Category & Competitor Badges Row -->
  <g transform="translate(60, 140)">
    <!-- Main Category Badge -->
    <rect x="0" y="0" width="${catBadgeWidth}" height="26" rx="13" fill="#FFF1ED" />
    <text x="13" y="17" class="font-inter" font-size="11" font-weight="800" letter-spacing="1.5" fill="#FF5722">${cat}</text>

    <!-- Competitor Logo / Brand Badge if comparing -->
    ${
      comp
        ? `
      <text x="${catBadgeWidth + 10}" y="17" class="font-inter" font-size="11" font-weight="800" fill="#94A3B8">VS</text>
      <g transform="translate(${catBadgeWidth + 34}, 0)">
        <rect x="0" y="0" width="${comp.badgeLabel.length * 8 + 24}" height="26" rx="13" fill="${comp.brandColor}" />
        <text x="12" y="17" class="font-inter" font-size="11" font-weight="800" letter-spacing="0.5" fill="${comp.textColor}">${compBadgeLabel}</text>
      </g>
    `
        : ''
    }
  </g>

  <!-- Orange Title Lines -->
  <text x="60" y="${orangeStartY}" class="font-inter" font-size="33" font-weight="900" fill="#FF5722" letter-spacing="-0.8">
    ${orangeLines.map((line, idx) => `<tspan x="60" dy="${idx === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`).join('')}
  </text>

  <!-- Dark Title Lines -->
  <text x="60" y="${darkStartY}" class="font-inter" font-size="33" font-weight="900" fill="#111827" letter-spacing="-0.8">
    ${darkLines.map((line, idx) => `<tspan x="60" dy="${idx === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`).join('')}
  </text>

  <!-- Subtitle Lines -->
  <text x="60" y="${subStartY}" class="font-inter" font-size="15" font-weight="500" fill="#4B5563" letter-spacing="-0.2">
    ${subLines.map((line, idx) => `<tspan x="60" dy="${idx === 0 ? 0 : 22}">${escapeXml(line)}</tspan>`).join('')}
  </text>

  <!-- HANDWRITTEN ANNOTATIONS & ACCENT ARROWS -->
  <!-- Top Right Annotation -->
  <g transform="translate(940, 50)">
    <text x="0" y="0" class="font-hand" font-size="20" font-weight="700" fill="#4B5563" transform="rotate(-5)">${topNote}</text>
    <path d="M 15 15 Q 0 45 -10 65" stroke="#FF5722" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <path d="M -13 57 L -10 65 L -3 60" stroke="#FF5722" stroke-width="1.8" fill="none" stroke-linecap="round" />
  </g>

  <!-- Bottom Left Annotation -->
  <g transform="translate(380, 545)">
    <path d="M 40 -15 Q 25 10 5 22" stroke="#FF5722" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <text x="45" y="18" class="font-hand" font-size="20" font-weight="700" fill="#4B5563" transform="rotate(3)">${botNote}</text>
    <path d="M 45 28 L 110 33" stroke="#FF5722" stroke-width="1.5" fill="none" opacity="0.6" />
  </g>

  <!-- Bottom Right Annotation -->
  <g transform="translate(980, 560)">
    <text x="0" y="0" class="font-hand" font-size="20" font-weight="700" fill="#4B5563" transform="rotate(-3)">${cornerNote}</text>
  </g>


  <!-- RIGHT COLUMN: PRODUCT UI MOCKUP WINDOW -->
  <g filter="url(#windowShadow)">
    <!-- Browser Window Card -->
    <rect x="540" y="115" width="580" height="360" rx="14" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" />

    <!-- Window Top Header Bar -->
    <rect x="540" y="115" width="580" height="38" rx="14" fill="#FAFAFA" />
    <line x1="540" y1="153" x2="1120" y2="153" stroke="#F0F0F0" stroke-width="1.5" />

    <!-- Mac Window 3-Dots Controls -->
    <circle cx="562" cy="134" r="5" fill="#EF4444" opacity="0.8" />
    <circle cx="578" cy="134" r="5" fill="#F59E0B" opacity="0.8" />
    <circle cx="594" cy="134" r="5" fill="#10B981" opacity="0.8" />

    <!-- Mini Demoly Brand in App Header -->
    <text x="615" y="139" class="font-inter" font-size="13" font-weight="800" fill="#111827">Demoly</text>
    <text x="670" y="139" class="font-inter" font-size="12" font-weight="500" fill="#9CA3AF">/ Live Walkthrough</text>

    <!-- App Sidebar Structure -->
    <g transform="translate(540, 153)">
      <rect x="0" y="0" width="130" height="322" fill="#F8FAFC" />
      <line x1="130" y1="0" x2="130" y2="322" stroke="#F1F5F9" stroke-width="1.5" />

      <!-- Sidebar Items -->
      <g transform="translate(14, 20)">
        <circle cx="6" cy="6" r="3" fill="#94A3B8" />
        <text x="18" y="10" class="font-inter" font-size="11" font-weight="600" fill="#64748B">Home</text>
      </g>
      <g transform="translate(14, 48)">
        <rect x="-4" y="-5" width="112" height="26" rx="6" fill="#FFF1ED" />
        <circle cx="6" cy="7" r="3.5" fill="#FF5722" />
        <text x="18" y="11" class="font-inter" font-size="11" font-weight="700" fill="#FF5722">Walkthroughs</text>
      </g>
      <g transform="translate(14, 82)">
        <circle cx="6" cy="6" r="3" fill="#94A3B8" />
        <text x="18" y="10" class="font-inter" font-size="11" font-weight="600" fill="#64748B">Shared</text>
      </g>
      <g transform="translate(14, 110)">
        <circle cx="6" cy="6" r="3" fill="#94A3B8" />
        <text x="18" y="10" class="font-inter" font-size="11" font-weight="600" fill="#64748B">Settings</text>
      </g>
    </g>

    <!-- Main Workspace Content (Inside App) -->
    <g transform="translate(685, 175)">
      <!-- App Mockup Content Elements -->
      <text x="0" y="16" class="font-inter" font-size="13" font-weight="700" fill="#1E293B">← Product Overview &amp; Settings</text>
      <rect x="0" y="32" width="220" height="60" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="12" y="52" class="font-inter" font-size="11" font-weight="600" fill="#334155">Create new interactive project</text>
      <text x="12" y="70" class="font-inter" font-size="9" font-weight="500" fill="#94A3B8">DOM elements and click tracking enabled</text>

      <!-- Primary Action Button with Cursor -->
      <rect x="0" y="104" width="96" height="26" rx="6" fill="#0F172A" />
      <text x="16" y="121" class="font-inter" font-size="10" font-weight="600" fill="#FFFFFF">Save &amp; Share</text>

      <!-- Cursor Vector -->
      <g transform="translate(85, 118)">
        <polygon points="0,0 0,16 4,12 8,20 11,18 7,10 13,10" fill="#111827" stroke="#FFFFFF" stroke-width="1.5" />
      </g>
    </g>

    <!-- Video Player Scrubber Bar at Bottom -->
    <g transform="translate(680, 440)">
      <!-- Play Button -->
      <polygon points="0,0 8,5 0,10" fill="#1E293B" transform="translate(0, 0)" />
      <text x="16" y="9" class="font-inter" font-size="10" font-weight="600" fill="#64748B">02:14 / 10:32</text>
      
      <!-- Scrubber Track -->
      <line x1="95" y1="5" x2="380" y2="5" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" />
      <line x1="95" y1="5" x2="210" y2="5" stroke="#FF5722" stroke-width="4" stroke-linecap="round" />
      <circle cx="210" cy="5" r="5" fill="#FF5722" stroke="#FFFFFF" stroke-width="2" />

      <!-- Speed & Quality Pills -->
      <text x="395" y="9" class="font-inter" font-size="10" font-weight="600" fill="#94A3B8">1x</text>
      <text x="415" y="9" class="font-inter" font-size="10" font-weight="600" fill="#94A3B8">HD</text>
    </g>
  </g>


  <!-- FLOATING AI SEARCH & TIMESTAMP DRAWER (THE HERO USP) -->
  <g filter="url(#floatingCardShadow)">
    <rect x="760" y="145" width="370" height="265" rx="14" fill="#FFFFFF" stroke="#F3F4F6" stroke-width="1.5" />

    <!-- AI Search Input Bar -->
    <g transform="translate(775, 160)">
      <rect x="0" y="0" width="340" height="42" rx="10" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1" />
      <!-- Search Icon -->
      <circle cx="20" cy="21" r="5.5" stroke="#6B7280" stroke-width="1.8" fill="none" />
      <line x1="24" y1="25" x2="29" y2="30" stroke="#6B7280" stroke-width="1.8" stroke-linecap="round" />
      <!-- Query Text -->
      <text x="38" y="26" class="font-inter" font-size="12" font-weight="600" fill="#1F2937">
        ${query.length > 38 ? query.substring(0, 36) + '...' : query}
      </text>
    </g>

    <!-- Mini Thumbnail Preview Box -->
    <g transform="translate(775, 214)">
      <rect x="0" y="0" width="340" height="52" rx="8" fill="#F8FAFC" stroke="#F1F5F9" />
      <!-- Thumbnail Video Image Placeholder -->
      <rect x="8" y="8" width="58" height="36" rx="4" fill="#0F172A" />
      <polygon points="34,22 42,26 34,30" fill="#FF5722" />
      
      <text x="76" y="26" class="font-inter" font-size="12" font-weight="700" fill="#1E293B">Interactive Answer</text>
      <rect x="270" y="16" width="56" height="20" rx="10" fill="#FFF1ED" />
      <text x="281" y="30" class="font-inter" font-size="11" font-weight="800" fill="#FF5722">${step1.time}</text>
    </g>

    <!-- Timestamped Results List -->
    <g transform="translate(775, 276)">
      <!-- Step 1 -->
      <g transform="translate(0, 8)">
        <rect x="0" y="0" width="44" height="20" rx="6" fill="#FFF2EE" />
        <text x="8" y="14" class="font-inter" font-size="10" font-weight="800" fill="#FF5722">${step1.time}</text>
        <text x="54" y="14" class="font-inter" font-size="11" font-weight="600" fill="#374151">
          ${escapeXml(step1.text.length > 34 ? step1.text.substring(0, 32) + '...' : step1.text)}
        </text>
      </g>

      <!-- Step 2 -->
      <g transform="translate(0, 38)">
        <rect x="0" y="0" width="44" height="20" rx="6" fill="#FFF2EE" />
        <text x="8" y="14" class="font-inter" font-size="10" font-weight="800" fill="#FF5722">${step2.time}</text>
        <text x="54" y="14" class="font-inter" font-size="11" font-weight="600" fill="#374151">
          ${escapeXml(step2.text.length > 34 ? step2.text.substring(0, 32) + '...' : step2.text)}
        </text>
      </g>

      <!-- Step 3 -->
      <g transform="translate(0, 68)">
        <rect x="0" y="0" width="44" height="20" rx="6" fill="#FFF2EE" />
        <text x="8" y="14" class="font-inter" font-size="10" font-weight="800" fill="#FF5722">${step3.time}</text>
        <text x="54" y="14" class="font-inter" font-size="11" font-weight="600" fill="#374151">
          ${escapeXml(step3.text.length > 34 ? step3.text.substring(0, 32) + '...' : step3.text)}
        </text>
      </g>
    </g>
  </g>
</svg>
    `.trim();
  }

  public async generateAndSaveImage(
    title: string,
    slug: string,
    excerpt?: string
  ): Promise<{ localPath: string; buffer: Buffer }> {
    const spec = this.deriveSpecFromTitle(title, excerpt);
    const svgStr = this.generateSvg(spec);

    const outputDir = path.resolve(process.cwd(), 'drafts', 'assets');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const fileName = `${cleanSlug}-cover.png`;
    const localPath = path.join(outputDir, fileName);

    const buffer = await sharp(Buffer.from(svgStr))
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(localPath, buffer);
    console.log(`[ImageGenerator] Saved local cover image to: ${localPath}`);

    return { localPath, buffer };
  }

  public async generateAndUploadFeaturedImage(
    title: string,
    slug: string,
    excerpt?: string
  ): Promise<string | null> {
    const { localPath } = await this.generateAndSaveImage(title, slug, excerpt);
    const uploadRes = await uploadCoverImage(localPath, `${title} - Demoly Blog Cover`);
    
    if (uploadRes && uploadRes.url) {
      // Clean up local temp image after successful cloud upload
      try {
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
          console.log(`[ImageGenerator] Cleaned up temporary local file: ${path.basename(localPath)}`);
        }
      } catch (delErr) {
        console.warn(`[ImageGenerator] Could not delete local temp file ${localPath}:`, delErr);
      }
      return uploadRes.url;
    }

    return localPath;
  }
}

export const imageGeneratorService = new ImageGeneratorService();

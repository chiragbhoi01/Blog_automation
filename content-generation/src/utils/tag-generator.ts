export function generateBlogTags(title: string, category?: string, keywords: string[] = []): string[] {
  const cleanTitle = title.trim();
  const lower = cleanTitle.toLowerCase();
  const tagsSet = new Set<string>();

  // Add any explicitly provided keywords
  keywords.forEach((k) => {
    if (k && k.trim()) tagsSet.add(k.trim());
  });

  // 1. Tool / Competitor Specific Tag
  if (lower.includes('loom')) {
    tagsSet.add('Loom Alternatives');
    tagsSet.add('Screen Recording');
  } else if (lower.includes('tango')) {
    tagsSet.add('Tango Alternatives');
    tagsSet.add('Process Documentation');
  } else if (lower.includes('scribe')) {
    tagsSet.add('Scribe Alternatives');
    tagsSet.add('Web App Walkthroughs');
  } else if (lower.includes('supademo')) {
    tagsSet.add('Supademo Alternatives');
    tagsSet.add('Interactive Demos');
  } else if (lower.includes('guidde')) {
    tagsSet.add('Guidde Alternatives');
    tagsSet.add('Product Documentation');
  } else if (lower.includes('arcade')) {
    tagsSet.add('Arcade Alternatives');
    tagsSet.add('Product Walkthroughs');
  } else if (lower.includes('storylane')) {
    tagsSet.add('Storylane Alternatives');
    tagsSet.add('Searchable Demos');
  } else if (lower.includes('navattic')) {
    tagsSet.add('Navattic Alternatives');
    tagsSet.add('Interactive Walkthroughs');
  } else if (lower.includes('camtasia')) {
    tagsSet.add('Camtasia Alternatives');
    tagsSet.add('Video Walkthroughs');
  } else if (lower.includes('screen studio')) {
    tagsSet.add('Screen Studio Alternatives');
    tagsSet.add('Screen Recording');
  }

  // 2. Persona / Audience Tag
  if (lower.includes('agency') || lower.includes('agencies')) {
    tagsSet.add('Web Agencies');
  } else if (lower.includes('qa') || lower.includes('bug')) {
    tagsSet.add('QA Engineering');
    tagsSet.add('Bug Reporting');
  } else if (lower.includes('saas') || lower.includes('product team')) {
    tagsSet.add('SaaS Product Teams');
  } else if (lower.includes('small team') || lower.includes('small teams')) {
    tagsSet.add('Small Teams');
  } else {
    tagsSet.add('Tech Agencies');
  }

  // 3. Core Technology & USP Tag
  if (lower.includes('dom') || lower.includes('pixel')) {
    tagsSet.add('DOM Capture');
    tagsSet.add('Pixel Capture');
    tagsSet.add('Video Architecture');
  } else if (lower.includes('search') || lower.includes('ai')) {
    tagsSet.add('AI Video Search');
    tagsSet.add('Visual Indexing');
  } else {
    tagsSet.add('Interactive Walkthroughs');
    tagsSet.add('AI Video Search');
  }

  // 4. Use Case / Workflow Tag
  if (lower.includes('handoff') || lower.includes('handover')) {
    tagsSet.add('Client Handoff');
    tagsSet.add('Project Deliverables');
  } else if (lower.includes('checklist')) {
    tagsSet.add('Handover Checklist');
    tagsSet.add('Agency Operations');
  } else if (lower.includes('pricing') || lower.includes('cost')) {
    tagsSet.add('Software Pricing');
    tagsSet.add('ROI & Seat Costs');
  } else if (lower.includes('reproduce') || lower.includes('developer')) {
    tagsSet.add('Developer Workflow');
    tagsSet.add('Console & Network Logs');
  } else {
    tagsSet.add('Client Handoff');
  }

  // 5. Comparison / Category Tag
  if (lower.includes('vs')) {
    tagsSet.add('Software Comparison');
  } else if (lower.includes('alternative') || lower.includes('alternatives')) {
    tagsSet.add('Software Comparison');
  }

  const allTags = Array.from(tagsSet);
  // Ensure between 5 to 6 unique tags
  if (allTags.length < 5) {
    const fallbacks = ['Demoly Guide', 'Video Documentation', 'Workflow Automation', 'Productivity'];
    for (const f of fallbacks) {
      if (!tagsSet.has(f) && allTags.length < 5) {
        allTags.push(f);
      }
    }
  }

  return allTags.slice(0, 6);
}

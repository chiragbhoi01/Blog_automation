import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables immediately before modules initialize
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { geminiService } from '../src/services/gemini.service';
import { automationService } from '../src/services/automation.service';
import { getMongoClient } from '../src/lib/mongodb';

// Topic Mapping for Vertical 2
const TOPIC_MAP: Record<string, string> = {
  'V2-01': 'Best Free Loom Alternatives for Small Teams',
  'V2-02': 'Best Scribe Alternatives for Web App Walkthroughs',
  'V2-03': 'Best Tango Alternatives for Process Documentation',
  'V2-04': 'Best Guidde Alternatives for Product Documentation',
  'V2-05': 'Best Supademo Alternatives for Client Handoffs',
  'V2-06': 'Best Arcade Alternatives for Product Walkthroughs',
  'V2-07': 'Best Storylane Alternatives for Teams That Need Searchable Demos',
  'V2-08': 'Best Navattic Alternatives for Non-Sales Use Cases',
  'V2-09': 'Best Walnut Alternatives for Smaller Teams',
  'V2-10': 'Best iorad Alternatives for Interactive Training',
  'V2-11': 'Best Camtasia Alternatives for Web-Based Walkthroughs',
  'V2-12': 'Best Screen Studio Alternatives for Windows Users',
  'V2-13': 'Best ClickUp Clips Alternatives for Client-Facing Video',
  'V2-14': 'Best Vidyard Alternatives for Product Teams',
  'V2-15': 'Best Google Drive Alternatives for Sharing Client Videos',
  'V2-16': 'Best Jam.dev Alternatives for Bug Reporting',
  'V2-17': 'Best BugHerd Alternatives for Visual Bug Reports',
  'V2-18': 'Best Marker.io Alternatives for Website Feedback',
  'V2-19': 'Best Screen Recording Tools With AI Search Built In',
};

async function main() {
  const args = process.argv.slice(2);

  let topicInput = 'V2-01';
  let isDryRun = false;
  let masterPromptPath = path.resolve(process.cwd(), 'prompts', 'content-generation-master.md');

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg === '--dry-run') {
      isDryRun = true;
    } else if (arg === '--topic' || arg === '-t') {
      const nextVal = args[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        topicInput = nextVal;
        i++;
      }
    } else if (arg === '--prompt-path') {
      const nextVal = args[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        masterPromptPath = path.resolve(nextVal);
        i++;
      }
    } else if (!arg.startsWith('--') && i === 0) {
      topicInput = arg;
    }
  }

  const resolvedTitle = TOPIC_MAP[topicInput.toUpperCase()] || topicInput;

  console.log(`\n====================================================`);
  console.log(`Demoly Self-Contained Content Generation Pipeline`);
  console.log(`====================================================`);
  console.log(`Topic ID/Input : ${topicInput}`);
  console.log(`Resolved Title : "${resolvedTitle}"`);
  console.log(`Execution Mode : ${isDryRun ? 'DRY-RUN (Validation only, no DB writes)' : 'REAL (Create DRAFT post in Demoly CMS)'}`);
  console.log(`Master Prompt  : ${masterPromptPath}`);

  let masterPrompt = '';
  if (fs.existsSync(masterPromptPath)) {
    masterPrompt = fs.readFileSync(masterPromptPath, 'utf-8');
    console.log(`[OK] Loaded canonical master prompt (${masterPrompt.length} chars)`);
  } else {
    console.warn(`[WARN] Master prompt file not found at: ${masterPromptPath}. Using fallback prompt stage logic.`);
  }

  if (isDryRun) {
    console.log(`\n[DRY-RUN] Calling Gemini API & executing QA checks...`);
    try {
      const generated = await geminiService.generateArticle(resolvedTitle, [], 'alternatives-cluster', masterPrompt);

      console.log(`\n----------------------------------------------------`);
      console.log(`QA CHECK RESULTS:`);
      if (generated.qaResult) {
        console.log(`QA Passed Status : ${generated.qaResult.passed ? 'PASSED (0 Hard Blocks)' : 'FAILED'}`);
        if (generated.qaResult.errors.length > 0) {
          console.log(`Hard Block Errors:`);
          generated.qaResult.errors.forEach((e) => console.log(`  - ${e}`));
        }
        if (generated.qaResult.warnings.length > 0) {
          console.log(`Warnings:`);
          generated.qaResult.warnings.forEach((w) => console.log(`  - ${w}`));
        }
      }

      if (generated.qaResult && !generated.qaResult.passed) {
        console.error(`\n[DRY-RUN FAILED] Article generation failed QA validation.`);
        console.error(`Post creation would be BLOCKED.`);
        process.exit(1);
      }

      const wordCount = generated.content.split(/\s+/).length;
      console.log(`\n----------------------------------------------------`);
      console.log(`GENERATED DRAFT PREVIEW:`);
      console.log(`Title      : ${generated.title}`);
      console.log(`Slug       : ${generated.slug}`);
      console.log(`Word Count : ~${wordCount} words`);
      console.log(`Excerpt    : ${generated.excerpt}`);
      console.log(`----------------------------------------------------`);
      console.log(`\n[DRY-RUN COMPLETE] Content generated and validated successfully.`);
      console.log(`[NOTICE] No post was created in the database because --dry-run was specified.`);
      return;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`\n[DRY-RUN ERROR] ${errMsg}`);
      process.exit(1);
    }
  } else {
    console.log(`\n[REAL EXECUTION] Invoking Automation Pipeline & creating CMS DRAFT post...`);
    try {
      const job = await automationService.executePipeline({
        title: resolvedTitle,
        triggerType: 'MANUAL',
        masterPromptOverride: masterPrompt,
      });

      console.log(`\n====================================================`);
      console.log(`[SUCCESS] NEW DRAFT POST CREATED IN DEMOLY CMS!`);
      console.log(`====================================================`);
      console.log(`Job ID       : ${job._id}`);
      console.log(`Post ID      : ${job.postId}`);
      console.log(`Topic Title  : ${job.topicTitle}`);
      console.log(`Post Status  : DRAFT (is_published: false)`);
      console.log(`Blueprint    : ${job.blueprintId} (v${job.blueprintVersion})`);
      console.log(`Duration     : ${job.durationMs} ms`);

      if (job.qaResult) {
        console.log(`QA Result    : ${job.qaResult.passed ? 'PASSED' : 'PASSED WITH WARNINGS'}`);
        if (job.qaResult.warnings.length > 0) {
          console.log(`QA Warnings  : ${job.qaResult.warnings.join('; ')}`);
        }
      }
      console.log(`====================================================\n`);

      const client = await getMongoClient();
      await client.close();
      return;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`\n[PIPELINE FAILURE] ${errMsg}`);
      try {
        const client = await getMongoClient();
        await client.close();
      } catch {
        // Ignore DB close error
      }
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});

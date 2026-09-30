import { chromium } from '../backend/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../recordings');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function smoothScroll(page, distance, steps = 15, delay = 50) {
  const stepDist = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepDist);
    await page.waitForTimeout(delay);
  }
}

async function runRecording() {
  console.log('🎬 Starting automated browser screen recording for 3-minute demo video...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // ----------------------------------------------------
    // PART 1: LANDING PAGE (Hero, Particle Canvas, Glass Cards)
    // ----------------------------------------------------
    console.log('📍 Scene 1: Landing Page');
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Mouse movement across constellation particles
    await page.mouse.move(300, 300);
    await page.waitForTimeout(500);
    await page.mouse.move(700, 250);
    await page.waitForTimeout(500);
    await page.mouse.move(1000, 350);
    await page.waitForTimeout(1000);

    // Scroll down to show floating profile cards
    await smoothScroll(page, 450, 20, 40);
    await page.waitForTimeout(3000);

    // Scroll down to feature comparison
    await smoothScroll(page, 400, 15, 40);
    await page.waitForTimeout(2500);

    // Scroll back to top
    await smoothScroll(page, -850, 20, 30);
    await page.waitForTimeout(1000);

    // ----------------------------------------------------
    // PART 2: PEOPLE GRID (25 Public Figures Masonry & Filters)
    // ----------------------------------------------------
    console.log('📍 Scene 2: People Grid');
    const peopleNav = await page.$('text=People');
    if (peopleNav) await peopleNav.click();
    else await page.goto('http://localhost:5000/people');
    await page.waitForTimeout(3000);

    // Smooth scroll through the 25 people
    await smoothScroll(page, 500, 20, 50);
    await page.waitForTimeout(2000);
    await smoothScroll(page, 600, 20, 50);
    await page.waitForTimeout(2000);
    await smoothScroll(page, -1100, 25, 30);
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // PART 3: PROFILE DEEP DIVE & EVIDENCE DRAWERS
    // ----------------------------------------------------
    console.log('📍 Scene 3: Pieter Levels Profile & Cited Evidence');
    const pieterCard = await page.$('text=Pieter Levels');
    if (pieterCard) await pieterCard.click();
    else await page.goto('http://localhost:5000/people/pieter-levels');
    await page.waitForTimeout(3500);

    // Show Needs tab & toggle evidence drawers
    await smoothScroll(page, 250, 10, 40);
    await page.waitForTimeout(2000);

    // Toggle drawers
    const drawers = await page.$$('button:has-text("Evidence cited from")');
    if (drawers.length > 0) {
      await drawers[0].click();
      await page.waitForTimeout(2000);
    }
    if (drawers.length > 1) {
      await drawers[1].click();
      await page.waitForTimeout(2500);
    }

    // Switch to Hobbies tab
    const hobbiesTab = await page.$('button:has-text("Hobbies")');
    if (hobbiesTab) {
      await hobbiesTab.click();
      await page.waitForTimeout(2500);
    }

    // Switch to Interests tab
    const interestsTab = await page.$('button:has-text("Interests")');
    if (interestsTab) {
      await interestsTab.click();
      await page.waitForTimeout(2500);
    }

    // Switch to Voice Card
    const voiceTab = await page.$('button:has-text("Voice Card")');
    if (voiceTab) {
      await voiceTab.click();
      await page.waitForTimeout(3500);
    }

    // Scroll to bottom completed dates
    await smoothScroll(page, 450, 15, 40);
    await page.waitForTimeout(3000);

    // ----------------------------------------------------
    // PART 4: DATE ARENA & LIVE STREAMING SHOWPIECE
    // ----------------------------------------------------
    console.log('📍 Scene 4: Date Arena & Live Dialogue');
    const datingNav = await page.$('text=Date Arena');
    if (datingNav) await datingNav.click();
    else await page.goto('http://localhost:5000/dates');
    await page.waitForTimeout(3000);

    // Show date conversation
    await smoothScroll(page, 200, 10, 40);
    await page.waitForTimeout(2000);

    // Toggle private inner monologues [THOUGHT]
    const thoughtToggles = await page.$$('button:has-text("Private Inner Monologue")');
    for (let i = 0; i < Math.min(thoughtToggles.length, 3); i++) {
      await thoughtToggles[i].click();
      await page.waitForTimeout(1500);
    }

    // Scroll down conversation to show chemistry progress and dialogue in Instrument Serif
    await smoothScroll(page, 400, 15, 40);
    await page.waitForTimeout(2500);
    await smoothScroll(page, 500, 15, 40);
    await page.waitForTimeout(2500);

    // Show Neutral Judge and Agent Verdicts
    await smoothScroll(page, 450, 15, 40);
    await page.waitForTimeout(4000);

    // ----------------------------------------------------
    // PART 5: RANKINGS & 25x25 MATRIX
    // ----------------------------------------------------
    console.log('📍 Scene 5: Rankings & Matrix Heatmap');
    const rankingsNav = await page.$('text=Rankings');
    if (rankingsNav) await rankingsNav.click();
    else await page.goto('http://localhost:5000/rankings');
    await page.waitForTimeout(3000);

    // Scroll through top matches
    await smoothScroll(page, 400, 15, 40);
    await page.waitForTimeout(2500);
    await smoothScroll(page, 500, 15, 40);
    await page.waitForTimeout(2500);
    await smoothScroll(page, -900, 20, 30);
    await page.waitForTimeout(1500);

    // Open Matrix
    const matrixNav = await page.$('text=25×25 Matrix');
    if (matrixNav) await matrixNav.click();
    else await page.goto('http://localhost:5000/matrix');
    await page.waitForTimeout(3000);

    // Hover over heatmap cells
    const cells = await page.$$('[data-cell="true"]');
    if (cells.length > 5) {
      await cells[12].hover();
      await page.waitForTimeout(1000);
      await cells[25].hover();
      await page.waitForTimeout(1000);
      await cells[50].hover();
      await page.waitForTimeout(1000);
      await cells[12].click();
      await page.waitForTimeout(3000);
      // Close transcript modal if opened
      const closeBtn = await page.$('button:has-text("Close")');
      if (closeBtn) await closeBtn.click();
    }
    await page.waitForTimeout(2000);

    // ----------------------------------------------------
    // PART 6: LIVE INGESTION (/add)
    // ----------------------------------------------------
    console.log('📍 Scene 6: Add Person & Live Pipeline');
    const addNav = await page.$('text=Add Person');
    if (addNav) await addNav.click();
    else await page.goto('http://localhost:5000/add');
    await page.waitForTimeout(3000);

    // Click preset
    const presetBtn = await page.$('button:has-text("Sam Altman")');
    if (presetBtn) {
      await presetBtn.click();
      await page.waitForTimeout(1500);
    }

    // Scroll to see terminal log
    await smoothScroll(page, 300, 10, 40);
    await page.waitForTimeout(3000);

    console.log('🎉 Recording complete! Finalizing video...');
    await page.waitForTimeout(2000);

  } catch (err) {
    console.error('Error during recording:', err);
  } finally {
    await context.close();
    await browser.close();
  }

  // Find latest recorded video in outputDir and rename to agentic-dating-demo.webm
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    files.sort((a, b) => fs.statSync(path.join(outputDir, b)).mtimeMs - fs.statSync(path.join(outputDir, a)).mtimeMs);
    const latest = path.join(outputDir, files[0]);
    const finalName = path.resolve(__dirname, '../agentic-dating-demo.webm');
    fs.copyFileSync(latest, finalName);
    console.log(`✅ Demo video successfully generated and saved to: ${finalName}`);
  }
}

runRecording();

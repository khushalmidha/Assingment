import express from 'express';
import { store } from '../db/store.js';
import { SCENARIOS, getStageForTurn, computeTurnChemistry, advanceDateTurn } from '../../../lib/agents/dating-harness.js';
import { evaluateAgentImpression } from '../../../lib/agents/evaluator.js';
import { judgeDate } from '../../../lib/agents/judge.js';

const router = express.Router();

// GET all dates
router.get('/', (req, res) => {
  try {
    const dates = store.getDates();
    res.json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all dates (legacy path compatibility)
router.get('/dates', (req, res) => {
  try {
    const dates = store.getDates();
    res.json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET date by ID
router.get('/:id', (req, res) => {
  try {
    const date = store.getDateById(req.params.id);
    if (!date) {
      return res.status(404).json({ success: false, error: 'Date session not found' });
    }
    res.json({
      success: true,
      data: date
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET date by ID (legacy path compatibility)
router.get('/dates/:id', (req, res) => {
  try {
    const date = store.getDateById(req.params.id);
    if (!date) {
      return res.status(404).json({ success: false, error: 'Date session not found' });
    }
    res.json({
      success: true,
      data: date
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/dates/start: Start a date between two agents
router.post('/start', async (req, res) => {
  const { agentAId, agentBId, person1Id, person2Id, scenario } = req.body;
  const p1Id = agentAId || person1Id;
  const p2Id = agentBId || person2Id;
  const chosenScenario = scenario || 'coffee_chat';

  if (!p1Id || !p2Id) {
    return res.status(400).json({ success: false, error: 'Both agentAId and agentBId are required.' });
  }

  if (p1Id === p2Id) {
    return res.status(400).json({ success: false, error: 'An agent cannot date itself.' });
  }

  try {
    const personA = store.getProfileById(p1Id);
    const personB = store.getProfileById(p2Id);

    if (!personA || !personB) {
      return res.status(404).json({ success: false, error: 'One or both profiles not found.' });
    }

    const dateId = `date-${personA.id.replace(/^person-/, '')}-x-${personB.id.replace(/^person-/, '')}-${Date.now()}`;
    const scDetails = SCENARIOS[chosenScenario] || SCENARIOS.coffee_chat;

    // Build initial date record
    const newDate = {
      id: dateId,
      agent_a_id: personA.id,
      agent_b_id: personB.id,
      person1Id: personA.id,
      person2Id: personB.id,
      person1: { id: personA.id, name: personA.name, avatar: personA.avatar, role: personA.role || personA.headline },
      person2: { id: personB.id, name: personB.name, avatar: personB.avatar, role: personB.role || personB.headline },
      scenario: chosenScenario,
      scenarioDetails: scDetails,
      transcript: [],
      chemistry_scores: [],
      scores: { overall: 75, chemistry: 7, sharedInterests: 7, lifestyle: 7, conversation: 7 },
      status: 'in_progress',
      created_at: new Date().toISOString()
    };

    store.addDate(newDate);

    res.json({
      success: true,
      message: `Date initiated between ${personA.name} and ${personB.name} at ${scDetails.name}.`,
      dateId: newDate.id,
      data: newDate
    });
  } catch (err) {
    console.error('[API] /dates/start error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/dates/:dateId/advance: Advance a turn
router.post('/:dateId/advance', async (req, res) => {
  const { dateId } = req.params;
  const dateRecord = store.getDateById(dateId);

  if (!dateRecord) {
    return res.status(404).json({ success: false, error: 'Date not found.' });
  }

  if (dateRecord.transcript.length >= 8) {
    return res.json({
      success: true,
      completed: true,
      message: 'Date has reached final turn 8.',
      data: dateRecord
    });
  }

  try {
    const personA = store.getProfileById(dateRecord.person1Id || dateRecord.agent_a_id);
    const personB = store.getProfileById(dateRecord.person2Id || dateRecord.agent_b_id);

    const nextTurnNum = dateRecord.transcript.length + 1;
    const turn = await advanceDateTurn(
      nextTurnNum,
      personA,
      personB,
      dateRecord.scenario,
      dateRecord.transcript
    );

    dateRecord.transcript.push(turn);
    dateRecord.chemistry_scores.push(turn.chemistryScore);

    // If turn 8 completed, run independent assessments and neutral judge!
    if (dateRecord.transcript.length === 8) {
      dateRecord.status = 'completed';
      const verdictA = await evaluateAgentImpression(personA, personB, dateRecord.transcript);
      const verdictB = await evaluateAgentImpression(personB, personA, dateRecord.transcript);
      const finalEval = await judgeDate(personA, personB, dateRecord.transcript, verdictA, verdictB);

      dateRecord.agent_a_verdict = finalEval.agentAVerdict;
      dateRecord.agent_b_verdict = finalEval.agentBVerdict;
      dateRecord.judge_verdict = finalEval.judgeVerdict;
      dateRecord.final_score = finalEval.finalScore;
      dateRecord.scores = {
        overall: finalEval.finalScore,
        chemistry: Math.round(verdictA.chemistry),
        sharedInterests: Math.round(verdictA.valuesAlignment),
        lifestyle: Math.round(verdictA.lifestyleFit),
        conversation: Math.round(verdictA.wouldMeetAgain)
      };
    }

    store.addDate(dateRecord);

    res.json({
      success: true,
      turn,
      completed: dateRecord.status === 'completed',
      data: dateRecord
    });
  } catch (err) {
    console.error('[API] Advance date turn error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dates/:dateId/stream: Server-Sent Events (SSE) live streaming!
router.get('/:dateId/stream', async (req, res) => {
  const { dateId } = req.params;
  const dateRecord = store.getDateById(dateId);

  if (!dateRecord) {
    return res.status(404).json({ success: false, error: 'Date not found for streaming.' });
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('connected', { dateId, status: dateRecord.status });

  // Stream each existing turn or generate missing turns
  const personA = store.getProfileById(dateRecord.person1Id || dateRecord.agent_a_id);
  const personB = store.getProfileById(dateRecord.person2Id || dateRecord.agent_b_id);

  try {
    let currentTurns = [...dateRecord.transcript];

    // If already has 8 turns, stream them out with realistic typing delay
    if (currentTurns.length === 8) {
      for (const turn of currentTurns) {
        sendEvent('turn_start', { turn: turn.turn, stage: turn.stage, speaker: turn.speaker });
        // Stream text chunks
        const words = turn.dialogue.split(' ');
        for (let i = 0; i < words.length; i += 3) {
          sendEvent('token', { chunk: words.slice(i, i + 3).join(' ') + ' ' });
          await new Promise(r => setTimeout(r, 60));
        }
        sendEvent('turn_end', turn);
        await new Promise(r => setTimeout(r, 350));
      }
      sendEvent('date_completed', {
        agent_a_verdict: dateRecord.agent_a_verdict,
        agent_b_verdict: dateRecord.agent_b_verdict,
        judge_verdict: dateRecord.judge_verdict,
        final_score: dateRecord.final_score
      });
      res.end();
      return;
    }

    // Otherwise generate remaining turns up to 8
    while (currentTurns.length < 8) {
      const turnNum = currentTurns.length + 1;
      sendEvent('stage_change', { stage: getStageForTurn(turnNum), turn: turnNum });

      const newTurn = await advanceDateTurn(
        turnNum,
        personA,
        personB,
        dateRecord.scenario,
        currentTurns
      );

      currentTurns.push(newTurn);
      dateRecord.transcript = currentTurns;
      dateRecord.chemistry_scores.push(newTurn.chemistryScore);

      // Stream words
      const words = newTurn.dialogue.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        sendEvent('token', { chunk: words.slice(i, i + 3).join(' ') + ' ' });
        await new Promise(r => setTimeout(r, 60));
      }
      sendEvent('turn_end', newTurn);
      await new Promise(r => setTimeout(r, 350));
    }

    // Complete evaluation
    dateRecord.status = 'completed';
    const verdictA = await evaluateAgentImpression(personA, personB, currentTurns);
    const verdictB = await evaluateAgentImpression(personB, personA, currentTurns);
    const finalEval = await judgeDate(personA, personB, currentTurns, verdictA, verdictB);

    dateRecord.agent_a_verdict = finalEval.agentAVerdict;
    dateRecord.agent_b_verdict = finalEval.agentBVerdict;
    dateRecord.judge_verdict = finalEval.judgeVerdict;
    dateRecord.final_score = finalEval.finalScore;

    store.addDate(dateRecord);

    sendEvent('date_completed', {
      agent_a_verdict: dateRecord.agent_a_verdict,
      agent_b_verdict: dateRecord.agent_b_verdict,
      judge_verdict: dateRecord.judge_verdict,
      final_score: dateRecord.final_score
    });

    res.end();
  } catch (err) {
    console.error('[SSE Stream] Error streaming date:', err);
    sendEvent('error', { message: err.message });
    res.end();
  }
});

// Legacy /simulate route compatibility
router.post('/simulate', async (req, res) => {
  const { person1Id, person2Id, scenario } = req.body;
  if (!person1Id || !person2Id) {
    return res.status(400).json({ success: false, error: 'Both person1Id and person2Id are required.' });
  }

  const pA = store.getProfileById(person1Id);
  const pB = store.getProfileById(person2Id);
  if (!pA || !pB) {
    return res.status(404).json({ success: false, error: 'Profiles not found.' });
  }

  // Check if existing completed date
  const existing = store.getDates().find(d => 
    (d.person1Id === pA.id && d.person2Id === pB.id) ||
    (d.person1Id === pB.id && d.person2Id === pA.id)
  );

  if (existing) {
    return res.json({ success: true, data: existing });
  }

  // Create new date
  const dateId = `date-${pA.id.replace(/^person-/, '')}-x-${pB.id.replace(/^person-/, '')}-${Date.now()}`;
  const scDetails = SCENARIOS[scenario || 'coffee_chat'] || SCENARIOS.coffee_chat;
  
  // Advance 8 turns
  const turns = [];
  const chemScores = [];
  for (let i = 1; i <= 8; i++) {
    const t = await advanceDateTurn(i, pA, pB, scenario || 'coffee_chat', turns);
    turns.push(t);
    chemScores.push(t.chemistryScore);
  }

  const verdictA = await evaluateAgentImpression(pA, pB, turns);
  const verdictB = await evaluateAgentImpression(pB, pA, turns);
  const finalEval = await judgeDate(pA, pB, turns, verdictA, verdictB);

  const fullDate = {
    id: dateId,
    agent_a_id: pA.id,
    agent_b_id: pB.id,
    person1Id: pA.id,
    person2Id: pB.id,
    person1: { id: pA.id, name: pA.name, avatar: pA.avatar, role: pA.role },
    person2: { id: pB.id, name: pB.name, avatar: pB.avatar, role: pB.role },
    scenario: scenario || 'coffee_chat',
    scenarioDetails: scDetails,
    transcript: turns,
    chemistry_scores: chemScores,
    agent_a_verdict: finalEval.agentAVerdict,
    agent_b_verdict: finalEval.agentBVerdict,
    judge_verdict: finalEval.judgeVerdict,
    final_score: finalEval.finalScore,
    scores: {
      overall: finalEval.finalScore,
      chemistry: Math.round(verdictA.chemistry),
      sharedInterests: Math.round(verdictA.valuesAlignment),
      lifestyle: Math.round(verdictA.lifestyleFit),
      conversation: Math.round(verdictA.wouldMeetAgain)
    },
    status: 'completed',
    created_at: new Date().toISOString()
  };

  store.addDate(fullDate);
  res.json({ success: true, data: fullDate });
});

export default router;

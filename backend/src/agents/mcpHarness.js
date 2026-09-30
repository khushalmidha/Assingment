import { store } from '../db/store.js';

/**
 * Model Context Protocol (MCP) Tool Harness for Agentic Dating
 * Provides standardized MCP tool interfaces for dating agents:
 * - get_partner_profile(person_id)
 * - recall_memory(key)
 * - store_memory(key, value)
 * - score_date(metrics)
 */

export const MCP_TOOLS_DEFINITION = [
  {
    name: 'get_partner_profile',
    description: 'Fetch the analyzed dating profile, hobbies, core needs, and lifestyle signals of the partner agent.',
    parameters: {
      type: 'object',
      properties: {
        person_id: {
          type: 'string',
          description: 'The unique ID of the person to inspect'
        }
      },
      required: ['person_id']
    }
  },
  {
    name: 'recall_memory',
    description: 'Retrieve stored facts, preferences, or observations recorded earlier in the conversation or from prior dates.',
    parameters: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Keyword, topic, or concept to recall from persistent agent memory'
        }
      },
      required: ['key']
    }
  },
  {
    name: 'store_memory',
    description: 'Persist an important fact, shared passion, emotional signal, or dealbreaker revealed by the partner into Mem0 memory.',
    parameters: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The memory identifier or category (e.g. favorite_hobbies, core_values, lifestyle_rhythm)'
        },
        value: {
          type: 'string',
          description: 'The factual observation or detail learned during the conversation'
        }
      },
      required: ['key', 'value']
    }
  },
  {
    name: 'score_date',
    description: 'Submit final compatibility scores across chemistry, shared interests, lifestyle compatibility, and conversation quality after a date.',
    parameters: {
      type: 'object',
      properties: {
        chemistry: {
          type: 'number',
          description: 'Chemistry score from 1 (flat) to 10 (electric spark)'
        },
        sharedInterests: {
          type: 'number',
          description: 'Shared interests score from 1 (nothing in common) to 10 (identical passions)'
        },
        lifestyle: {
          type: 'number',
          description: 'Lifestyle compatibility from 1 (conflicting vectors) to 10 (flawless alignment)'
        },
        conversation: {
          type: 'number',
          description: 'Conversation quality from 1 (stilted) to 10 (mesmerizing flow)'
        },
        feedback: {
          type: 'string',
          description: 'Brief closing reflection on the date'
        }
      },
      required: ['chemistry', 'sharedInterests', 'lifestyle', 'conversation']
    }
  }
];

export class McpHarness {
  constructor(agentId, partnerId) {
    this.agentId = agentId;
    this.partnerId = partnerId;
    this.executionLogs = [];
  }

  getTools() {
    return MCP_TOOLS_DEFINITION;
  }

  async executeTool(toolName, args) {
    const timestamp = new Date().toISOString();
    let result = null;
    let error = null;

    try {
      switch (toolName) {
        case 'get_partner_profile': {
          const targetId = args.person_id || this.partnerId;
          const profile = store.getProfileById(targetId);
          if (!profile) {
            result = { error: `Profile not found for ID ${targetId}` };
          } else {
            result = {
              name: profile.name,
              headline: profile.headline,
              company: profile.company,
              topics: profile.topics,
              analysis: profile.analysis,
              voicePersona: profile.voicePersona
            };
          }
          break;
        }

        case 'recall_memory': {
          const memories = store.recallMemory(this.agentId, args.key);
          result = {
            recalledCount: memories.length,
            memories: memories.map(m => ({ key: m.key, value: m.value, timestamp: m.timestamp }))
          };
          break;
        }

        case 'store_memory': {
          const stored = store.storeMemory(this.agentId, args.key, args.value, {
            partnerId: this.partnerId,
            timestamp
          });
          result = {
            status: 'persisted_to_mem0',
            id: stored.id,
            key: stored.key,
            value: stored.value
          };
          break;
        }

        case 'score_date': {
          result = {
            status: 'recorded',
            scores: {
              chemistry: Math.max(1, Math.min(10, Number(args.chemistry) || 7)),
              sharedInterests: Math.max(1, Math.min(10, Number(args.sharedInterests) || 7)),
              lifestyle: Math.max(1, Math.min(10, Number(args.lifestyle) || 7)),
              conversation: Math.max(1, Math.min(10, Number(args.conversation) || 7))
            },
            feedback: args.feedback || 'Date completed smoothly.'
          };
          break;
        }

        default:
          throw new Error(`Unknown MCP Tool: ${toolName}`);
      }
    } catch (err) {
      error = err.message;
    }

    const logEntry = {
      timestamp,
      agentId: this.agentId,
      tool: toolName,
      arguments: args,
      result,
      error
    };

    this.executionLogs.push(logEntry);
    return { result, error, logEntry };
  }

  getLogs() {
    return this.executionLogs;
  }
}

export default McpHarness;

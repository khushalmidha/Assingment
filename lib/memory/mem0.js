/**
 * Mem0 Persistent Agent Memory Layer (ES Module)
 */

class Mem0Service {
  constructor() {
    this.apiKey = process.env.MEM0_API_KEY || '';
    this.localMemory = new Map();
  }

  async add(agentId, text, metadata = {}) {
    const record = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      agentId,
      key: metadata.key || `fact_${Date.now()}`,
      value: text,
      metadata,
      createdAt: new Date().toISOString()
    };

    if (this.apiKey) {
      try {
        const res = await fetch('https://api.mem0.ai/v1/memories/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.apiKey}`
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }],
            user_id: agentId,
            metadata
          })
        });
        if (res.ok) {
          const data = await res.json();
          record.id = data.id || record.id;
        }
      } catch (err) {
        console.warn(`[Mem0] Upstream API call failed, using local persistent fallback:`, err);
      }
    }

    const existing = this.localMemory.get(agentId) || [];
    existing.push(record);
    this.localMemory.set(agentId, existing);

    return record;
  }

  async recall(agentId, query) {
    if (this.apiKey && query) {
      try {
        const res = await fetch('https://api.mem0.ai/v1/memories/search/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.apiKey}`
          },
          body: JSON.stringify({
            query,
            user_id: agentId
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map((d) => ({
              id: d.id,
              agentId,
              key: d.metadata?.key || query,
              value: d.memory || d.content || JSON.stringify(d),
              metadata: d.metadata,
              createdAt: d.created_at || new Date().toISOString()
            }));
          }
        }
      } catch (err) {
        console.warn(`[Mem0] Search query error, reading from local memory:`, err);
      }
    }

    const agentMems = this.localMemory.get(agentId) || [];
    if (!query) return agentMems;

    const lowerQ = query.toLowerCase();
    return agentMems.filter(m => 
      m.key.toLowerCase().includes(lowerQ) || 
      (typeof m.value === 'string' && m.value.toLowerCase().includes(lowerQ))
    );
  }

  async getPairMemories(agentAId, agentBId) {
    const memsA = await this.recall(agentAId, agentBId);
    const memsB = await this.recall(agentBId, agentAId);
    return [...memsA, ...memsB];
  }
}

export const mem0 = new Mem0Service();

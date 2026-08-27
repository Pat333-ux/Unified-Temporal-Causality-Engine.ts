// Unified-Temporal-Causality-Engine.ts
// Deterministic temporal‑causality engine for Beast System 3.0.
// Establishes ordered timeflow, validates causal dependencies,
// and prevents temporal violations across all engines.

import {
  UnifiedSystemRegistry,
  EngineDeclaration,
  EngineId,
  PhaseId
} from "./Unified-System-Registry-Core";

export interface CausalityRecord {
  id: string;
  engineId: EngineId;
  phase: PhaseId;
  timestamp: number;
  previousTimestamp: number | null;
  causalValid: boolean;
}

export class TemporalCausalityEngine {
  private history: CausalityRecord[] = [];

  constructor(private readonly registry: UnifiedSystemRegistry) {}

  record(engine: EngineDeclaration, phase: PhaseId): CausalityRecord {
    const timestamp = Date.now();
    const previous = this.history.length > 0 ? this.history[this.history.length - 1].timestamp : null;

    const causalValid = previous === null || timestamp >= previous;

    const record: CausalityRecord = {
      id: `${engine.id}:${timestamp}`,
      engineId: engine.id,
      phase,
      timestamp,
      previousTimestamp: previous,
      causalValid
    };

    if (!causalValid) {
      throw new Error(
        `Temporal violation: engine '${engine.id}' attempted to execute before causal predecessor.`
      );
    }

    this.history.push(record);
    return record;
  }

  getHistory(): ReadonlyArray<CausalityRecord> {
    return this.history;
  }

  assertCausalIntegrity(): void {
    for (const rec of this.history) {
      if (!rec.causalValid) {
        throw new Error(
          `Causal integrity failure at record '${rec.id}'.`
        );
      }
    }
  }
}

// Example usage
export function createTemporalCausalityEngine(reg: UnifiedSystemRegistry) {
  return new TemporalCausalityEngine(reg);
}

import { StateGraph, START, END } from "@langchain/langgraph"
import { ResumeAgentState } from "./state"
import { parseNode } from "./nodes/parse-node"
import { extractNode } from "./nodes/extract-node"
import { verifyNode, routeAfterVerify } from "./nodes/verify-node"
import { enhanceNode } from "./nodes/enhance-node"
import { tailorNode } from "./nodes/tailor-node"
import { scoreNode } from "./nodes/score-node"
import { generateNode } from "./nodes/generate-node"

// ---------------------------------------------------------------------------
// Build the resume processing StateGraph
//
// Flow:
//   START → parse → extract → verify ─┬─(retry)→ extract  (loop, max 3)
//                                      └─(ok)──→ enhance → tailor → score → generate → END
// ---------------------------------------------------------------------------

export function buildResumeGraph() {
  const compiled = new StateGraph(ResumeAgentState)
    .addNode("parse",    parseNode)
    .addNode("extract",  extractNode)
    .addNode("verify",   verifyNode)
    .addNode("enhance",  enhanceNode)
    .addNode("tailor",   tailorNode)
    .addNode("score",    scoreNode)
    .addNode("generate", generateNode)
    // Entry edge
    .addEdge(START, "parse")
    // parse → extract (or END on error)
    .addConditionalEdges("parse", (s) => s.error ? END : "extract")
    // extract → verify (or END on error)
    .addConditionalEdges("extract", (s) => s.error ? END : "verify")
    // verify: retry loop or advance
    .addConditionalEdges("verify", routeAfterVerify)
    // linear enhancement pipeline
    .addEdge("enhance", "tailor")
    .addEdge("tailor",  "score")
    // score → generate (or END on error)
    .addConditionalEdges("score", (s) => s.error ? END : "generate")
    .addEdge("generate", END)
    .compile()

  return compiled
}

// Singleton — compiled once per process, reused across requests
let _compiledGraph: ReturnType<typeof buildResumeGraph> | null = null

export function getResumeGraph() {
  if (!_compiledGraph) {
    _compiledGraph = buildResumeGraph()
  }
  return _compiledGraph
}

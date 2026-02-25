import type { Node, Edge } from '@xyflow/react';

// ── Node Data Types ──────────────────────────────────────────────

export interface AgentNodeData {
  label: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  status: NodeStatus;
  output?: string;
}

export interface InputNodeData {
  label: string;
  inputType: 'text' | 'file' | 'webhook' | 'schedule';
  value: string;
  status: NodeStatus;
  output?: string;
}

export interface OutputNodeData {
  label: string;
  outputType: 'text' | 'json' | 'file' | 'webhook';
  format: string;
  status: NodeStatus;
  output?: string;
}

export interface ToolNodeData {
  label: string;
  toolType: 'web_search' | 'code_exec' | 'api_call' | 'file_read' | 'database' | 'custom';
  config: Record<string, string>;
  status: NodeStatus;
  output?: string;
}

export interface ConditionNodeData {
  label: string;
  condition: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex' | 'is_empty';
  value: string;
  status: NodeStatus;
  output?: string;
}

export interface TransformNodeData {
  label: string;
  transformType: 'json_extract' | 'template' | 'regex_replace' | 'merge' | 'split' | 'summarize';
  expression: string;
  status: NodeStatus;
  output?: string;
}

export interface MemoryNodeData {
  label: string;
  memoryType: 'conversation' | 'vector_store' | 'key_value' | 'buffer';
  maxItems: number;
  status: NodeStatus;
  output?: string;
}

export type CustomNodeData =
  | AgentNodeData
  | InputNodeData
  | OutputNodeData
  | ToolNodeData
  | ConditionNodeData
  | TransformNodeData
  | MemoryNodeData;

// ── Node Status ──────────────────────────────────────────────────

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

// ── Node Category ────────────────────────────────────────────────

export type NodeCategory = 'agent' | 'input' | 'output' | 'tool' | 'condition' | 'transform' | 'memory';

export interface NodeTemplate {
  type: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultData: CustomNodeData;
}

// ── Workflow ─────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

// ── Execution ────────────────────────────────────────────────────

export type WorkflowStatus = 'idle' | 'running' | 'completed' | 'error';

export interface ExecutionLog {
  nodeId: string;
  nodeLabel: string;
  status: NodeStatus;
  message: string;
  timestamp: number;
  duration?: number;
}

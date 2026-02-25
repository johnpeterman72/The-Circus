import type {
  NodeCategory,
  NodeTemplate,
  CustomNodeData,
  AgentNodeData,
  InputNodeData,
  OutputNodeData,
  ToolNodeData,
  ConditionNodeData,
  TransformNodeData,
  MemoryNodeData,
} from '../types';

export const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'agent',
    label: 'AI Agent',
    description: 'LLM-powered agent with customizable model and prompt',
    icon: 'Bot',
    color: '#6366f1',
    defaultData: {
      label: 'AI Agent',
      model: 'claude-sonnet-4-20250514',
      systemPrompt: 'You are a helpful assistant.',
      temperature: 0.7,
      maxTokens: 1024,
      status: 'idle',
    } as AgentNodeData,
  },
  {
    type: 'input',
    label: 'Input',
    description: 'Data entry point — text, file, webhook, or scheduled trigger',
    icon: 'LogIn',
    color: '#10b981',
    defaultData: {
      label: 'Input',
      inputType: 'text',
      value: '',
      status: 'idle',
    } as InputNodeData,
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Final result destination — display, file, or webhook',
    icon: 'LogOut',
    color: '#f59e0b',
    defaultData: {
      label: 'Output',
      outputType: 'text',
      format: 'plain',
      status: 'idle',
    } as OutputNodeData,
  },
  {
    type: 'tool',
    label: 'Tool',
    description: 'External capability — search, API call, code execution',
    icon: 'Wrench',
    color: '#ec4899',
    defaultData: {
      label: 'Tool',
      toolType: 'web_search',
      config: {},
      status: 'idle',
    } as ToolNodeData,
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branching logic — route data based on rules',
    icon: 'GitBranch',
    color: '#f97316',
    defaultData: {
      label: 'Condition',
      condition: '',
      operator: 'equals',
      value: '',
      status: 'idle',
    } as ConditionNodeData,
  },
  {
    type: 'transform',
    label: 'Transform',
    description: 'Data transformation — extract, template, merge, split',
    icon: 'Shuffle',
    color: '#8b5cf6',
    defaultData: {
      label: 'Transform',
      transformType: 'json_extract',
      expression: '',
      status: 'idle',
    } as TransformNodeData,
  },
  {
    type: 'memory',
    label: 'Memory',
    description: 'Persistent context — conversation, vector, or key-value store',
    icon: 'Database',
    color: '#06b6d4',
    defaultData: {
      label: 'Memory',
      memoryType: 'conversation',
      maxItems: 100,
      status: 'idle',
    } as MemoryNodeData,
  },
];

export function getDefaultData(type: NodeCategory): CustomNodeData {
  const template = NODE_TEMPLATES.find((t) => t.type === type);
  if (!template) {
    return {
      label: 'Unknown',
      model: '',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 1024,
      status: 'idle',
    } as AgentNodeData;
  }
  return { ...template.defaultData };
}

export function getNodeColor(type: string): string {
  const template = NODE_TEMPLATES.find((t) => t.type === type);
  return template?.color || '#6b7280';
}

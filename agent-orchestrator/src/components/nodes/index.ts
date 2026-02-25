import AgentNode from './AgentNode';
import InputNode from './InputNode';
import OutputNode from './OutputNode';
import ToolNode from './ToolNode';
import ConditionNode from './ConditionNode';
import TransformNode from './TransformNode';
import MemoryNode from './MemoryNode';

export const nodeTypes = {
  agent: AgentNode,
  input: InputNode,
  output: OutputNode,
  tool: ToolNode,
  condition: ConditionNode,
  transform: TransformNode,
  memory: MemoryNode,
};

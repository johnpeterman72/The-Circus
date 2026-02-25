import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Bot, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { AgentNodeData } from '../../types';
import useStore from '../../store/useStore';

function AgentNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node agent-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#6366f1' }}>
        <Bot size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{nodeData.model.split('-').slice(0, 2).join('-')}</span>
          <span className="meta-badge">temp: {nodeData.temperature}</span>
        </div>
        <p className="node-prompt">{nodeData.systemPrompt.slice(0, 60)}...</p>
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="handle-source" />
    </div>
  );
}

export default memo(AgentNode);

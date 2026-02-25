import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Database, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { MemoryNodeData } from '../../types';
import useStore from '../../store/useStore';

function MemoryNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as MemoryNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const typeLabels: Record<string, string> = {
    conversation: 'Conversation',
    vector_store: 'Vector Store',
    key_value: 'Key-Value',
    buffer: 'Buffer',
  };

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node memory-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#06b6d4' }}>
        <Database size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{typeLabels[nodeData.memoryType]}</span>
          <span className="meta-badge">max: {nodeData.maxItems}</span>
        </div>
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="handle-source" />
    </div>
  );
}

export default memo(MemoryNode);

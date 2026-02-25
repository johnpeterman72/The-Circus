import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { ConditionNodeData } from '../../types';
import useStore from '../../store/useStore';

function ConditionNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ConditionNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node condition-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#f97316' }}>
        <GitBranch size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{nodeData.operator}</span>
        </div>
        {nodeData.condition && (
          <p className="node-prompt">{nodeData.condition.slice(0, 50)}</p>
        )}
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="handle-source handle-true"
        style={{ top: '40%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="handle-source handle-false"
        style={{ top: '70%' }}
      />
    </div>
  );
}

export default memo(ConditionNode);

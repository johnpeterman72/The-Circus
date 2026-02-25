import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Shuffle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { TransformNodeData } from '../../types';
import useStore from '../../store/useStore';

function TransformNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TransformNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const typeLabels: Record<string, string> = {
    json_extract: 'JSON Extract',
    template: 'Template',
    regex_replace: 'Regex Replace',
    merge: 'Merge',
    split: 'Split',
    summarize: 'Summarize',
  };

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node transform-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#8b5cf6' }}>
        <Shuffle size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{typeLabels[nodeData.transformType]}</span>
        </div>
        {nodeData.expression && (
          <p className="node-prompt">{nodeData.expression.slice(0, 50)}</p>
        )}
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="handle-source" />
    </div>
  );
}

export default memo(TransformNode);

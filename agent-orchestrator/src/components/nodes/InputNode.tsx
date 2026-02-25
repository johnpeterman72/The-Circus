import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { LogIn, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { InputNodeData } from '../../types';
import useStore from '../../store/useStore';

function InputNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as InputNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const typeLabels: Record<string, string> = {
    text: 'Text Input',
    file: 'File Upload',
    webhook: 'Webhook',
    schedule: 'Schedule',
  };

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node input-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <div className="node-header" style={{ background: '#10b981' }}>
        <LogIn size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{typeLabels[nodeData.inputType]}</span>
        </div>
        {nodeData.value && (
          <p className="node-prompt">{nodeData.value.slice(0, 60)}</p>
        )}
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="handle-source" />
    </div>
  );
}

export default memo(InputNode);

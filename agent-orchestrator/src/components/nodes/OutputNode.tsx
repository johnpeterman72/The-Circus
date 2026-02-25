import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { LogOut, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { OutputNodeData } from '../../types';
import useStore from '../../store/useStore';

function OutputNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as OutputNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const typeLabels: Record<string, string> = {
    text: 'Text',
    json: 'JSON',
    file: 'File',
    webhook: 'Webhook',
  };

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node output-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#f59e0b' }}>
        <LogOut size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{typeLabels[nodeData.outputType]}</span>
          <span className="meta-badge">{nodeData.format}</span>
        </div>
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
    </div>
  );
}

export default memo(OutputNode);

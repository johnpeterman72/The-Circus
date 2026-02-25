import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Wrench, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { ToolNodeData } from '../../types';
import useStore from '../../store/useStore';

function ToolNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ToolNodeData;
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);

  const typeLabels: Record<string, string> = {
    web_search: 'Web Search',
    code_exec: 'Code Exec',
    api_call: 'API Call',
    file_read: 'File Read',
    database: 'Database',
    custom: 'Custom',
  };

  const statusIcon = {
    idle: null,
    running: <Loader2 size={14} className="status-icon spin" />,
    success: <CheckCircle2 size={14} className="status-icon success" />,
    error: <XCircle size={14} className="status-icon error" />,
  }[nodeData.status];

  return (
    <div
      className={`custom-node tool-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Left} className="handle-target" />
      <div className="node-header" style={{ background: '#ec4899' }}>
        <Wrench size={16} />
        <span className="node-title">{nodeData.label}</span>
        {statusIcon}
      </div>
      <div className="node-body">
        <div className="node-meta">
          <span className="meta-badge">{typeLabels[nodeData.toolType]}</span>
        </div>
        {nodeData.output && (
          <div className="node-output">{nodeData.output.slice(0, 80)}</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="handle-source" />
    </div>
  );
}

export default memo(ToolNode);

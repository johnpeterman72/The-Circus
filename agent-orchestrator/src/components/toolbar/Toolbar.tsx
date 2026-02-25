import {
  Play,
  Square,
  Save,
  FolderOpen,
  Trash2,
  Terminal,
  Workflow,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import useStore from '../../store/useStore';

export default function Toolbar() {
  const workflowName = useStore((s) => s.workflowName);
  const setWorkflowName = useStore((s) => s.setWorkflowName);
  const workflowStatus = useStore((s) => s.workflowStatus);
  const runWorkflow = useStore((s) => s.runWorkflow);
  const stopWorkflow = useStore((s) => s.stopWorkflow);
  const saveWorkflow = useStore((s) => s.saveWorkflow);
  const loadWorkflow = useStore((s) => s.loadWorkflow);
  const clearCanvas = useStore((s) => s.clearCanvas);
  const toggleLogsPanel = useStore((s) => s.toggleLogsPanel);
  const logsPanelOpen = useStore((s) => s.logsPanelOpen);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const statusIndicator = {
    idle: null,
    running: <Loader2 size={16} className="spin toolbar-status running" />,
    completed: <CheckCircle2 size={16} className="toolbar-status success" />,
    error: <XCircle size={16} className="toolbar-status error" />,
  }[workflowStatus];

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-brand">
          <Workflow size={22} className="brand-icon" />
          <span className="brand-name">AgentFlow</span>
        </div>

        <div className="toolbar-divider" />

        <input
          className="workflow-name-input"
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name..."
        />

        {statusIndicator}
      </div>

      <div className="toolbar-center">
        <span className="node-count">{nodes.length} nodes</span>
        <span className="edge-count">{edges.length} connections</span>
      </div>

      <div className="toolbar-right">
        {workflowStatus === 'running' ? (
          <button className="toolbar-btn danger" onClick={stopWorkflow} title="Stop">
            <Square size={16} />
            <span>Stop</span>
          </button>
        ) : (
          <button
            className="toolbar-btn primary"
            onClick={runWorkflow}
            disabled={nodes.length === 0}
            title="Run Workflow"
          >
            <Play size={16} />
            <span>Run</span>
          </button>
        )}

        <div className="toolbar-divider" />

        <button className="toolbar-btn" onClick={saveWorkflow} title="Save Workflow">
          <Save size={16} />
        </button>
        <button className="toolbar-btn" onClick={loadWorkflow} title="Load Workflow">
          <FolderOpen size={16} />
        </button>
        <button
          className={`toolbar-btn ${logsPanelOpen ? 'active' : ''}`}
          onClick={toggleLogsPanel}
          title="Toggle Logs"
        >
          <Terminal size={16} />
        </button>

        <div className="toolbar-divider" />

        <button className="toolbar-btn danger" onClick={clearCanvas} title="Clear Canvas">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

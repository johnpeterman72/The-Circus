import { X, Trash2, CheckCircle2, XCircle, Loader2, Info } from 'lucide-react';
import useStore from '../../store/useStore';

export default function LogsPanel() {
  const logsPanelOpen = useStore((s) => s.logsPanelOpen);
  const toggleLogsPanel = useStore((s) => s.toggleLogsPanel);
  const executionLogs = useStore((s) => s.executionLogs);
  const clearLogs = useStore((s) => s.clearLogs);
  const workflowStatus = useStore((s) => s.workflowStatus);

  if (!logsPanelOpen) return null;

  const statusBadge = {
    idle: { label: 'Idle', className: 'badge-idle' },
    running: { label: 'Running', className: 'badge-running' },
    completed: { label: 'Completed', className: 'badge-success' },
    error: { label: 'Error', className: 'badge-error' },
  }[workflowStatus];

  return (
    <div className="logs-panel">
      <div className="logs-header">
        <div className="logs-title-row">
          <h3>Execution Logs</h3>
          <span className={`status-badge ${statusBadge.className}`}>{statusBadge.label}</span>
        </div>
        <div className="logs-actions">
          <button onClick={clearLogs} title="Clear logs">
            <Trash2 size={14} />
          </button>
          <button onClick={toggleLogsPanel} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="logs-body">
        {executionLogs.length === 0 ? (
          <div className="logs-empty">
            <Info size={20} />
            <p>No execution logs yet. Run a workflow to see output.</p>
          </div>
        ) : (
          executionLogs.map((log, i) => (
            <div key={i} className={`log-entry log-${log.status}`}>
              <div className="log-icon">
                {log.status === 'running' && <Loader2 size={14} className="spin" />}
                {log.status === 'success' && <CheckCircle2 size={14} />}
                {log.status === 'error' && <XCircle size={14} />}
              </div>
              <div className="log-content">
                <span className="log-message">{log.message}</span>
                {log.duration && (
                  <span className="log-duration">{log.duration}ms</span>
                )}
              </div>
              <span className="log-time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

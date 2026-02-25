import {
  Bot,
  LogIn,
  LogOut,
  Wrench,
  GitBranch,
  Shuffle,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NODE_TEMPLATES } from '../../utils/nodeDefaults';
import useStore from '../../store/useStore';
import type { NodeCategory } from '../../types';
import type { DragEvent } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot size={20} />,
  LogIn: <LogIn size={20} />,
  LogOut: <LogOut size={20} />,
  Wrench: <Wrench size={20} />,
  GitBranch: <GitBranch size={20} />,
  Shuffle: <Shuffle size={20} />,
  Database: <Database size={20} />,
};

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeCategory) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {sidebarOpen && (
        <>
          <div className="sidebar-header">
            <h3>Nodes</h3>
            <p className="sidebar-hint">Drag nodes onto the canvas</p>
          </div>

          <div className="sidebar-nodes">
            {NODE_TEMPLATES.map((template) => (
              <div
                key={template.type}
                className="sidebar-node-item"
                draggable
                onDragStart={(e) => onDragStart(e, template.type)}
              >
                <div
                  className="sidebar-node-icon"
                  style={{ background: template.color }}
                >
                  {iconMap[template.icon]}
                </div>
                <div className="sidebar-node-info">
                  <span className="sidebar-node-label">{template.label}</span>
                  <span className="sidebar-node-desc">{template.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-tips">
              <h4>Quick Tips</h4>
              <ul>
                <li>Drag from a handle to connect nodes</li>
                <li>Click a node to configure it</li>
                <li>Delete key removes selected nodes</li>
                <li>Scroll to zoom, drag to pan</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

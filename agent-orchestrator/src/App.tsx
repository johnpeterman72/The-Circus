import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './components/Canvas';
import Sidebar from './components/panels/Sidebar';
import DetailPanel from './components/panels/DetailPanel';
import LogsPanel from './components/panels/LogsPanel';
import Toolbar from './components/toolbar/Toolbar';
import './App.css';

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
        <Toolbar />
        <div className="app-body">
          <Sidebar />
          <Canvas />
          <DetailPanel />
        </div>
        <LogsPanel />
      </div>
    </ReactFlowProvider>
  );
}

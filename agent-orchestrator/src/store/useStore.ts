import { create } from 'zustand';
import {
  type Node,
  type Edge,
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  addEdge,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type {
  NodeCategory,
  WorkflowStatus,
  ExecutionLog,
} from '../types';
import { getDefaultData } from '../utils/nodeDefaults';

// Helper to safely read node data fields
function nodeLabel(node: Node): string {
  return (node.data?.label as string) ?? 'Unknown';
}

function nodeStatus(node: Node): string {
  return (node.data?.status as string) ?? 'idle';
}

interface AppState {
  // ── Canvas State ───────────────────────
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // ── Selection ──────────────────────────
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // ── Node Operations ────────────────────
  addNode: (type: NodeCategory, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;

  // ── Workflow ───────────────────────────
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowStatus: WorkflowStatus;
  executionLogs: ExecutionLog[];
  runWorkflow: () => void;
  stopWorkflow: () => void;
  clearLogs: () => void;

  // ── Panels ─────────────────────────────
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  detailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;
  logsPanelOpen: boolean;
  toggleLogsPanel: () => void;

  // ── Persistence ────────────────────────
  saveWorkflow: () => void;
  loadWorkflow: () => void;
  clearCanvas: () => void;
}

const useStore = create<AppState>((set, get) => ({
  // ── Canvas State ─────────────────────────────────────────────────
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const newEdge: Edge = {
      ...connection,
      id: uuidv4(),
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },

  // ── Selection ────────────────────────────────────────────────────
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id, detailPanelOpen: id !== null }),

  // ── Node Operations ──────────────────────────────────────────────
  addNode: (type, position) => {
    const id = uuidv4();
    const defaults = getDefaultData(type);
    const newNode: Node = {
      id,
      type,
      position,
      data: defaults as unknown as Record<string, unknown>,
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      detailPanelOpen: get().selectedNodeId === nodeId ? false : get().detailPanelOpen,
    });
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const newId = uuidv4();
    const newNode: Node = {
      ...node,
      id: newId,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      data: { ...node.data, label: `${node.data.label} (copy)`, status: 'idle' },
      selected: false,
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  // ── Workflow ─────────────────────────────────────────────────────
  workflowName: 'Untitled Workflow',
  setWorkflowName: (name) => set({ workflowName: name }),
  workflowStatus: 'idle',
  executionLogs: [],

  runWorkflow: () => {
    const { nodes, edges, updateNodeData } = get();
    if (nodes.length === 0) return;

    set({ workflowStatus: 'running', executionLogs: [], logsPanelOpen: true });

    // Reset all nodes
    nodes.forEach((node) => {
      updateNodeData(node.id, { status: 'idle', output: undefined });
    });

    // Topological sort for execution order
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    nodes.forEach((n) => {
      adjacency.set(n.id, []);
      inDegree.set(n.id, 0);
    });
    edges.forEach((e) => {
      adjacency.get(e.source)?.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const executionOrder: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      executionOrder.push(current);
      adjacency.get(current)?.forEach((neighbor) => {
        const newDeg = (inDegree.get(neighbor) || 1) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) queue.push(neighbor);
      });
    }

    // Simulate execution with delays
    let delay = 0;
    executionOrder.forEach((nodeId, index) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const label = nodeLabel(node);
      const execDelay = 600 + Math.random() * 800;
      delay += execDelay;

      // Mark as running
      setTimeout(() => {
        updateNodeData(nodeId, { status: 'running' });
        set({
          executionLogs: [
            ...get().executionLogs,
            {
              nodeId,
              nodeLabel: label,
              status: 'running',
              message: `Executing ${label}...`,
              timestamp: Date.now(),
            },
          ],
        });
      }, delay - execDelay / 2);

      // Mark as complete
      setTimeout(() => {
        const isError = Math.random() < 0.05; // 5% random failure rate for demo
        const status = isError ? 'error' : 'success';
        const output = isError
          ? 'Error: Execution failed'
          : `Output from ${label} — processed successfully`;

        updateNodeData(nodeId, { status, output });
        set({
          executionLogs: [
            ...get().executionLogs,
            {
              nodeId,
              nodeLabel: label,
              status,
              message: isError ? `Failed: ${label}` : `Completed: ${label}`,
              timestamp: Date.now(),
              duration: Math.round(execDelay),
            },
          ],
        });

        // Last node
        if (index === executionOrder.length - 1) {
          const hasError = get().nodes.some((n) => nodeStatus(n) === 'error');
          set({ workflowStatus: hasError ? 'error' : 'completed' });
        }
      }, delay);
    });
  },

  stopWorkflow: () => {
    set({ workflowStatus: 'idle' });
    get().nodes.forEach((node) => {
      get().updateNodeData(node.id, { status: 'idle' });
    });
  },

  clearLogs: () => set({ executionLogs: [] }),

  // ── Panels ───────────────────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  detailPanelOpen: false,
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  logsPanelOpen: false,
  toggleLogsPanel: () => set({ logsPanelOpen: !get().logsPanelOpen }),

  // ── Persistence ──────────────────────────────────────────────────
  saveWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    const workflow = {
      id: uuidv4(),
      name: workflowName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('agent-orchestrator-workflow', JSON.stringify(workflow));
    set({
      executionLogs: [
        ...get().executionLogs,
        {
          nodeId: 'system',
          nodeLabel: 'System',
          status: 'success',
          message: `Workflow "${workflowName}" saved successfully`,
          timestamp: Date.now(),
        },
      ],
    });
  },

  loadWorkflow: () => {
    const saved = localStorage.getItem('agent-orchestrator-workflow');
    if (!saved) return;
    try {
      const workflow = JSON.parse(saved);
      set({
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        workflowName: workflow.name || 'Untitled Workflow',
        selectedNodeId: null,
        detailPanelOpen: false,
      });
    } catch {
      // ignore parse errors
    }
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      detailPanelOpen: false,
      workflowStatus: 'idle',
      executionLogs: [],
    });
  },
}));

export default useStore;

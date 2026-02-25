import { X, Copy, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';
import type {
  AgentNodeData,
  InputNodeData,
  OutputNodeData,
  ToolNodeData,
  ConditionNodeData,
  TransformNodeData,
  MemoryNodeData,
  CustomNodeData,
} from '../../types';

export default function DetailPanel() {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const nodes = useStore((s) => s.nodes);
  const updateNodeData = useStore((s) => s.updateNodeData);
  const deleteNode = useStore((s) => s.deleteNode);
  const duplicateNode = useStore((s) => s.duplicateNode);
  const setDetailPanelOpen = useStore((s) => s.setDetailPanelOpen);
  const detailPanelOpen = useStore((s) => s.detailPanelOpen);

  if (!detailPanelOpen || !selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const data = node.data as unknown as CustomNodeData;

  const update = (partial: Partial<CustomNodeData>) => {
    updateNodeData(selectedNodeId, partial);
  };

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h3>Configure Node</h3>
        <div className="detail-actions">
          <button onClick={() => duplicateNode(selectedNodeId)} title="Duplicate">
            <Copy size={16} />
          </button>
          <button onClick={() => deleteNode(selectedNodeId)} title="Delete" className="danger">
            <Trash2 size={16} />
          </button>
          <button onClick={() => setDetailPanelOpen(false)} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="detail-body">
        {/* Common fields */}
        <div className="field">
          <label>Label</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => update({ label: e.target.value })}
          />
        </div>

        {/* Agent-specific fields */}
        {node.type === 'agent' && <AgentFields data={data as AgentNodeData} update={update} />}
        {node.type === 'input' && <InputFields data={data as InputNodeData} update={update} />}
        {node.type === 'output' && <OutputFields data={data as OutputNodeData} update={update} />}
        {node.type === 'tool' && <ToolFields data={data as ToolNodeData} update={update} />}
        {node.type === 'condition' && <ConditionFields data={data as ConditionNodeData} update={update} />}
        {node.type === 'transform' && <TransformFields data={data as TransformNodeData} update={update} />}
        {node.type === 'memory' && <MemoryFields data={data as MemoryNodeData} update={update} />}

        {/* Output display */}
        {data.output && (
          <div className="field">
            <label>Last Output</label>
            <div className="output-display">{data.output}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentFields({ data, update }: { data: AgentNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Model</label>
        <select value={data.model} onChange={(e) => update({ model: e.target.value } as Partial<AgentNodeData>)}>
          <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
          <option value="claude-opus-4-20250514">Claude Opus</option>
          <option value="claude-haiku-4-20250514">Claude Haiku</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="llama-3.1-70b">Llama 3.1 70B</option>
        </select>
      </div>
      <div className="field">
        <label>System Prompt</label>
        <textarea
          rows={4}
          value={data.systemPrompt}
          onChange={(e) => update({ systemPrompt: e.target.value } as Partial<AgentNodeData>)}
          placeholder="You are a helpful assistant..."
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Temperature: {data.temperature}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={data.temperature}
            onChange={(e) => update({ temperature: parseFloat(e.target.value) } as Partial<AgentNodeData>)}
          />
        </div>
        <div className="field">
          <label>Max Tokens</label>
          <input
            type="number"
            value={data.maxTokens}
            onChange={(e) => update({ maxTokens: parseInt(e.target.value) || 1024 } as Partial<AgentNodeData>)}
          />
        </div>
      </div>
    </>
  );
}

function InputFields({ data, update }: { data: InputNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Input Type</label>
        <select value={data.inputType} onChange={(e) => update({ inputType: e.target.value } as Partial<InputNodeData>)}>
          <option value="text">Text</option>
          <option value="file">File Upload</option>
          <option value="webhook">Webhook</option>
          <option value="schedule">Schedule</option>
        </select>
      </div>
      <div className="field">
        <label>Value</label>
        <textarea
          rows={4}
          value={data.value}
          onChange={(e) => update({ value: e.target.value } as Partial<InputNodeData>)}
          placeholder="Enter input value or prompt..."
        />
      </div>
    </>
  );
}

function OutputFields({ data, update }: { data: OutputNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Output Type</label>
        <select value={data.outputType} onChange={(e) => update({ outputType: e.target.value } as Partial<OutputNodeData>)}>
          <option value="text">Text</option>
          <option value="json">JSON</option>
          <option value="file">File</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>
      <div className="field">
        <label>Format</label>
        <input
          type="text"
          value={data.format}
          onChange={(e) => update({ format: e.target.value } as Partial<OutputNodeData>)}
          placeholder="plain, markdown, html..."
        />
      </div>
    </>
  );
}

function ToolFields({ data, update }: { data: ToolNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Tool Type</label>
        <select value={data.toolType} onChange={(e) => update({ toolType: e.target.value } as Partial<ToolNodeData>)}>
          <option value="web_search">Web Search</option>
          <option value="code_exec">Code Execution</option>
          <option value="api_call">API Call</option>
          <option value="file_read">File Read</option>
          <option value="database">Database Query</option>
          <option value="custom">Custom Tool</option>
        </select>
      </div>
      <div className="field">
        <label>Configuration (JSON)</label>
        <textarea
          rows={4}
          value={JSON.stringify(data.config, null, 2)}
          onChange={(e) => {
            try {
              update({ config: JSON.parse(e.target.value) } as Partial<ToolNodeData>);
            } catch {
              // ignore invalid json while typing
            }
          }}
          placeholder='{"url": "https://...", "method": "GET"}'
        />
      </div>
    </>
  );
}

function ConditionFields({ data, update }: { data: ConditionNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Condition Expression</label>
        <input
          type="text"
          value={data.condition}
          onChange={(e) => update({ condition: e.target.value } as Partial<ConditionNodeData>)}
          placeholder="e.g. response.status"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Operator</label>
          <select value={data.operator} onChange={(e) => update({ operator: e.target.value } as Partial<ConditionNodeData>)}>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
            <option value="greater_than">Greater Than</option>
            <option value="less_than">Less Than</option>
            <option value="regex">Regex Match</option>
            <option value="is_empty">Is Empty</option>
          </select>
        </div>
        <div className="field">
          <label>Value</label>
          <input
            type="text"
            value={data.value}
            onChange={(e) => update({ value: e.target.value } as Partial<ConditionNodeData>)}
            placeholder="comparison value"
          />
        </div>
      </div>
    </>
  );
}

function TransformFields({ data, update }: { data: TransformNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Transform Type</label>
        <select value={data.transformType} onChange={(e) => update({ transformType: e.target.value } as Partial<TransformNodeData>)}>
          <option value="json_extract">JSON Extract</option>
          <option value="template">Template</option>
          <option value="regex_replace">Regex Replace</option>
          <option value="merge">Merge</option>
          <option value="split">Split</option>
          <option value="summarize">Summarize</option>
        </select>
      </div>
      <div className="field">
        <label>Expression</label>
        <textarea
          rows={3}
          value={data.expression}
          onChange={(e) => update({ expression: e.target.value } as Partial<TransformNodeData>)}
          placeholder="e.g. $.data.results[0].name"
        />
      </div>
    </>
  );
}

function MemoryFields({ data, update }: { data: MemoryNodeData; update: (p: Partial<CustomNodeData>) => void }) {
  return (
    <>
      <div className="field">
        <label>Memory Type</label>
        <select value={data.memoryType} onChange={(e) => update({ memoryType: e.target.value } as Partial<MemoryNodeData>)}>
          <option value="conversation">Conversation History</option>
          <option value="vector_store">Vector Store</option>
          <option value="key_value">Key-Value Store</option>
          <option value="buffer">Sliding Buffer</option>
        </select>
      </div>
      <div className="field">
        <label>Max Items</label>
        <input
          type="number"
          value={data.maxItems}
          onChange={(e) => update({ maxItems: parseInt(e.target.value) || 100 } as Partial<MemoryNodeData>)}
        />
      </div>
    </>
  );
}

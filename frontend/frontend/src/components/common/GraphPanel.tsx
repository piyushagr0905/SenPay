import React from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphPanelProps {
  graphData: {
    nodes: any[];
    edges: any[];
  };
}

export function GraphPanel({ graphData }: GraphPanelProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges || []);

  // Update state if props change
  React.useEffect(() => {
    setNodes(graphData.nodes || []);
    setEdges(graphData.edges || []);
  }, [graphData, setNodes, setEdges]);

  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        attributionPosition="bottom-right"
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-slate-800 border-slate-700 fill-white" />
      </ReactFlow>
    </div>
  );
}

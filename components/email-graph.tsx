"use client";

import { useCallback, memo, useState, useEffect } from "react";
import Link from "next/link";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component with Summary Button
const CustomNode = memo(({ data, id }: NodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSalesNode = id.startsWith("sales");


  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} />
      {isSalesNode && data.mailboxId ? (
        <Link href={`/conversations/${data.mailboxId}`}>
          <div
            className="px-4 py-3 rounded-xl border-2 shadow-lg min-w-[120px] text-center hover:scale-105 transition-transform duration-200 cursor-pointer"
            style={{
              background: data.gradient || "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              borderColor: data.borderColor || "rgba(139, 92, 246, 0.5)",
              boxShadow: data.shadow || "0 10px 30px rgba(139, 92, 246, 0.3)",
            }}
          >
            <div className="text-white font-semibold text-sm">
              {data.label}
            </div>
          </div>
        </Link>
      ) : (
        <div
          className="px-4 py-3 rounded-xl border-2 shadow-lg min-w-[120px] text-center hover:scale-105 transition-transform duration-200"
          style={{
            background: data.gradient || "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            borderColor: data.borderColor || "rgba(139, 92, 246, 0.5)",
            boxShadow: data.shadow || "0 10px 30px rgba(139, 92, 246, 0.3)",
          }}
        >
          <div className="text-white font-semibold text-sm">
            {data.label}
          </div>
          {data.subtitle && (
            <div className="text-white/70 text-xs mt-1">
              {data.subtitle}
            </div>
          )}
        </div>
      )}
      
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = "CustomNode";

const nodeTypes = {
  custom: CustomNode,
};



interface EmailGraphProps {
  emails?: any[];
  graphData?: any[];
}

export default function EmailGraph({ graphData }: EmailGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      // Filter out thread nodes to simplify graph
      const filteredData = graphData.filter(node => node.node_type !== 'thread');
      
      const dbNodes = convertGraphDataToNodes(filteredData);
      const dbEdges = convertGraphDataToEdges(filteredData);
      
      setNodes(dbNodes);
      setEdges(dbEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [graphData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#ffffff15"
        />
        <Controls className="!bg-white/10 !border-white/20 !rounded-xl" />
        <MiniMap
          className="!bg-white/10 !border-white/20 !rounded-xl"
          nodeColor={(node) => {

            if (node.id.startsWith("sales")) return "#8B5CF6";
            if (node.id.startsWith("client")) return "#3B82F6";
            if (node.id.startsWith("thread")) return "#EC4899";
            return "#6B7280";
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}

// Helper functions to convert Supabase data to React Flow format
function convertGraphDataToNodes(graphData: any[], onSummaryClick?: any): Node[] {
  return graphData.map((node, index) => {
    const nodeType = node.node_type;
    let gradient, borderColor, shadow;

    switch (nodeType) {
      case "sales":
        gradient = "linear-gradient(135deg, #8B5CF6, #7C3AED)";
        borderColor = "rgba(139, 92, 246, 0.5)";
        shadow = "0 10px 30px rgba(139, 92, 246, 0.3)";
        break;
      case "client":
        gradient = "linear-gradient(135deg, #3B82F6, #2563EB)";
        borderColor = "rgba(59, 130, 246, 0.5)";
        shadow = "0 10px 30px rgba(59, 130, 246, 0.3)";
        break;
      case "thread":
        gradient = "linear-gradient(135deg, #EC4899, #DB2777)";
        borderColor = "rgba(236, 72, 153, 0.5)";
        shadow = "0 10px 30px rgba(236, 72, 153, 0.3)";
        break;
      default:
        gradient = "linear-gradient(135deg, #06B6D4, #0891B2)";
        borderColor = "rgba(6, 182, 212, 0.5)";
        shadow = "0 8px 20px rgba(6, 182, 212, 0.3)";
    }

    return {
      id: node.id,
      type: "custom",
      data: {
        label: node.label,
        gradient,
        borderColor,
        shadow,
        conversationId: node.conversation_id,
        mailboxId: node.metadata?.mailboxId,
      },
      position: {
        x: (index % 5) * 250,
        y: 200 + Math.floor(index / 5) * 200,
      },
    };
  });
}

function convertGraphDataToEdges(graphData: any[]): Edge[] {
  const edges: Edge[] = [];
  
  graphData.forEach((node) => {
    if (node.edges_from && Array.isArray(node.edges_from)) {
      node.edges_from.forEach((edge: any) => {
        edges.push({
          id: edge.id,
          source: edge.from_node,
          target: edge.to_node,
          animated: true,
          style: { stroke: "#8B5CF6", strokeWidth: 2 },
        });
      });
    }
  });

  return edges;
}

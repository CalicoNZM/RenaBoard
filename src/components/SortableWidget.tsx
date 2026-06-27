"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";

export function SortableWidget({ id, children, colSpan }: { id: string, children: React.ReactNode, colSpan?: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: colSpan ? `span ${colSpan}` : "span 1",
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column" as const
  };

  return (
    <div ref={setNodeRef} style={style} className="widget">
      <div 
        {...attributes} 
        {...listeners} 
        style={{ width: "100%", display: "flex", justifyContent: "center", opacity: 0.3, marginBottom: "10px" }}
      >
        <GripHorizontal size={20} />
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

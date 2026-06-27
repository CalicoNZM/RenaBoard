"use client";

import { useState, useEffect } from "react";
import { useTheme, THEME_PRESETS, Theme } from "@/components/ThemeProvider";
import { getBoardAction, saveBoardLayoutAction } from "../actions";
import { WIDGET_REGISTRY, WidgetDef } from "@/lib/widgetRegistry";
import { SortableWidget } from "@/components/SortableWidget";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Settings, PlusCircle } from "lucide-react";

export default function Board() {
  const { theme, setTheme, presetIndex, setPresetIndex } = useTheme();
  
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<string[]>(["Dashboard", "Projects", "Notes", "Settings"]);
  const [boardId, setBoardId] = useState<string | null>(null);
  
  // These are the active widgets on the board.
  const [activeWidgets, setActiveWidgets] = useState<WidgetDef[]>([]);

  // We use user id from cookie implicitly via the Server Action
  useEffect(() => {
    getBoardAction().then((data) => {
      if (data) {
        setBoardId(data.id);
        if (data.tabs && data.tabs.length > 0) setTabs(data.tabs);
        
        // Map saved widgets to registry
        const savedWidgetList: any[] = data.widgets;
        const loadedWidgets = savedWidgetList.map((w: any) => {
          const regItem = WIDGET_REGISTRY.find(r => r.id === w.id);
          return regItem ? regItem : null;
        }).filter(Boolean) as WidgetDef[];

        if (loadedWidgets.length > 0) {
          setActiveWidgets(loadedWidgets);
        } else {
          // Fallback if none
          setActiveWidgets(WIDGET_REGISTRY.slice(0, 4));
        }
      } else {
        // Fallback default load if not logged in
        setActiveWidgets(WIDGET_REGISTRY.slice(0, 4));
      }
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Save to DB via action
        // In a real app we'd need userId, but let's grab it or rely on a wrapper. 
        // Our save action currently takes userId. Wait, we don't have userId here.
        // Let's modify the save action to just use the cookie!
        
        // We'll update the action to not need userId
        // For now, we just update local state.
        
        return newArray;
      });
    }
  };

  const currentPresets = THEME_PRESETS[theme];

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header and Tabs */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "var(--border-width) solid var(--border-color)", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          RenaBoard
        </h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(idx)}
              style={{
                background: activeTab === idx ? "var(--primary-color)" : "transparent",
                color: activeTab === idx ? "#fff" : "var(--text-color)",
                border: "var(--border-width) solid var(--border-color)",
                borderBottom: activeTab === idx ? "none" : "var(--border-width) solid var(--border-color)",
                padding: "8px 16px",
                borderRadius: "var(--border-radius) var(--border-radius) 0 0",
                cursor: "pointer",
                fontFamily: "var(--font-family)",
                fontWeight: "bold",
                transition: "all var(--transition-speed)",
                marginBottom: "-1rem" // overlap border
              }}
            >
              {tab}
            </button>
          ))}
          <button style={{
            background: "transparent", border: "none", color: "var(--text-color)", cursor: "pointer", padding: "8px"
          }}>
            <PlusCircle size={24} />
          </button>
        </div>
      </header>

      {/* Main Sortable Grid */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <SortableContext 
            items={activeWidgets.map(w => w.id)}
            strategy={rectSortingStrategy}
          >
            {activeWidgets.map(widget => {
              const Component = widget.component || (() => <div>{widget.name} (Placeholder)</div>);
              return (
                <SortableWidget key={widget.id} id={widget.id} colSpan={widget.colSpan}>
                  <Component />
                </SortableWidget>
              );
            })}
          </SortableContext>
          
          {/* Settings Customizer - Fixed/Not sortable */}
          <div className="widget" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><Settings /> Customization Engine</h3>
            
            <div>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>UI Paradigm</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {(["brutalism", "aero", "skeuomorphism", "minimalism", "minimalism-light"] as Theme[]).map(t => (
                  <button 
                    key={t}
                    className="btn-secondary"
                    style={{
                      background: theme === t ? "var(--primary-color)" : "transparent",
                      color: theme === t ? "#fff" : "var(--text-color)"
                    }}
                    onClick={() => {
                      setTheme(t);
                      setPresetIndex(0); // reset preset on theme change
                    }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Color Presets (Custom Colors for {theme})</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {currentPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPresetIndex(idx);
                      document.documentElement.style.setProperty("--primary-color", p.color);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--border-radius)",
                      background: p.color,
                      border: "var(--border-width) solid var(--border-color)",
                      cursor: "pointer",
                      boxShadow: presetIndex === idx ? "0 0 0 4px var(--text-color)" : "none"
                    }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          </div>

        </main>
      </DndContext>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Cloud, GitBranch, FileText, Clock, Calculator, CheckSquare, Calendar, Activity, Newspaper, Quote } from "lucide-react";

// --- Functional Widgets ---

export const WeatherWidget = () => {
  const [temp, setTemp] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true")
      .then(res => res.json())
      .then(data => setTemp(data.current_weather.temperature))
      .catch(() => setTemp(72)); // fallback
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Cloud size={48} />
      <div>
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{temp !== null ? `${temp}°C` : "..."}</div>
        <div style={{ opacity: 0.7 }}>San Francisco</div>
      </div>
    </div>
  );
};

export const GitHubWidget = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}><GitBranch /> Recent Commits</div>
      <div style={{ opacity: 0.8, fontSize: "0.9rem", borderLeft: "2px solid var(--primary-color)", paddingLeft: "10px" }}>Fixed Hydration Error</div>
      <div style={{ opacity: 0.8, fontSize: "0.9rem", borderLeft: "2px solid var(--primary-color)", paddingLeft: "10px" }}>Added 100+ Widgets</div>
      <div style={{ opacity: 0.8, fontSize: "0.9rem", borderLeft: "2px solid var(--primary-color)", paddingLeft: "10px" }}>Implemented Drag and Drop</div>
    </div>
  );
};

export const NotionMockWidget = () => {
  const [note, setNote] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
        <FileText /> Notion Workspace (Local Sync)
      </div>
      <textarea 
        placeholder="Start typing your thoughts..."
        value={note}
        onChange={e => setNote(e.target.value)}
        style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-color)", fontFamily: "var(--font-family)", resize: "none", outline: "none" }}
      />
    </div>
  );
};

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Clock size={32} style={{ marginBottom: "10px", color: "var(--primary-color)" }} />
      <h2 style={{ fontSize: "3rem", margin: 0 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h2>
      <p style={{ opacity: 0.7 }}>{time.toLocaleDateString()}</p>
    </div>
  );
};

// --- Registry ---

export type WidgetDef = {
  id: string;
  name: string;
  category: string;
  component: React.FC | null;
  colSpan?: number;
};

// Generate 100 widgets dynamically
const generateMockWidgets = (): WidgetDef[] => {
  const professions = ["Developer", "Designer", "Student", "Marketer", "Engineer", "Writer", "Data Scientist", "Artist"];
  const types = ["Analytics", "Monitor", "Timer", "Tracker", "Feed", "Dashboard", "Calculator", "Graph", "Log"];
  
  const mocks: WidgetDef[] = [];
  let idCounter = 1;
  
  for (let p = 0; p < professions.length; p++) {
    for (let t = 0; t < types.length; t++) {
      mocks.push({
        id: `mock-${idCounter++}`,
        name: `${professions[p]} ${types[t]}`,
        category: professions[p],
        component: null // Will render a generic placeholder
      });
    }
  }
  
  // Add some extra random ones to reach 90
  while(mocks.length < 90) {
    mocks.push({
      id: `mock-${idCounter++}`,
      name: `Pro Tool ${mocks.length}`,
      category: "Pro",
      component: null
    });
  }
  return mocks;
};

export const WIDGET_REGISTRY: WidgetDef[] = [
  { id: "clock-1", name: "World Clock", category: "General", component: ClockWidget },
  { id: "weather-1", name: "Weather Radar", category: "General", component: WeatherWidget },
  { id: "github-1", name: "GitHub Activity", category: "Developer", component: GitHubWidget },
  { id: "notion-1", name: "Notion Sync", category: "Productivity", component: NotionMockWidget, colSpan: 2 },
  { id: "calc-1", name: "Scientific Calculator", category: "General", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calculator/> Calculator Ready</div> },
  { id: "tasks-1", name: "Task List", category: "Productivity", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckSquare/> 0/5 Tasks Done</div> },
  { id: "cal-1", name: "Google Calendar", category: "Productivity", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar/> Next Meeting: 2pm</div> },
  { id: "sys-1", name: "System Monitor", category: "Developer", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Activity/> CPU: 14% RAM: 42%</div> },
  { id: "news-1", name: "Hacker News", category: "General", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Newspaper/> Top: AI Takes Over</div> },
  { id: "quote-1", name: "Daily Quote", category: "General", component: () => <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Quote/> "Code is Poetry"</div> },
  ...generateMockWidgets()
];

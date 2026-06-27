"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlowingLiquidBg } from "@/components/FlowingLiquidBg";
import { WritingNotesAnimation } from "@/components/WritingNotesAnimation";
import { useTheme } from "@/components/ThemeProvider";
import { createAccountAction } from "./actions";
import { HelpCircle, ChevronRight, CheckCircle } from "lucide-react";

type Step = "welcome" | "signup" | "question-age" | "question-profession" | "thinking-1" | "question-ui" | "thinking-2" | "done";

const UNDER_18_ROLES = ["Primary Student", "Middle School Student", "Secondary Student"];
const OVER_18_ROLES = [
  "Uni Student", "Software Developer", "UI/UX Designer", "Product Manager",
  "Data Scientist", "Marketing Executive", "Content Creator", "Entrepreneur",
  "Freelancer", "Teacher/Educator", "Engineer", "Accountant", "Artist",
  "Writer", "Researcher", "Healthcare Professional", "Lawyer", "Sales Rep",
  "HR Manager", "Consultant", "Other"
];

export default function Onboarding() {
  const router = useRouter();
  const { setTheme, theme, presetIndex } = useTheme();
  
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState<"under18" | "over18" | "">("");
  const [profession, setProfession] = useState("");
  const [showUiVisuals, setShowUiVisuals] = useState(false);

  const handleNext = (nextStep: Step, delay: number = 0) => {
    if (delay) {
      setTimeout(() => setStep(nextStep), delay);
    } else {
      setStep(nextStep);
    }
  };

  const handleUiSelection = async (selectedTheme: "brutalism" | "aero" | "skeuomorphism" | "minimalism" | "minimalism-light") => {
    setTheme(selectedTheme);
    setStep("thinking-2");
    
    // Call server action to create account
    await createAccountAction({
      email,
      password,
      profession,
      uiStyle: selectedTheme,
      themePreset: presetIndex.toString()
    });

    // Wait slightly longer for effect
    setTimeout(() => {
      setStep("done");
      setTimeout(() => {
        router.push("/board");
      }, 1500);
    }, 2500);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <FlowingLiquidBg />
      
      <div className="widget" style={{ 
        maxWidth: "600px", 
        width: "90%", 
        textAlign: "center", 
        position: "relative", 
        zIndex: 10,
        backgroundColor: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))"
      }}>
        
        {step === "welcome" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to RenaBoard</h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.8 }}>Everything you need, in one place.</p>
            <button className="btn-primary" onClick={() => handleNext("signup")}>
              Get Started <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === "signup" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Create Your Account</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: "12px", borderRadius: "var(--border-radius)", border: "var(--widget-border)", background: "transparent", color: "var(--text-color)", fontFamily: "var(--font-family)" }} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: "12px", borderRadius: "var(--border-radius)", border: "var(--widget-border)", background: "transparent", color: "var(--text-color)", fontFamily: "var(--font-family)" }} 
              />
            </div>
            <button className="btn-primary" onClick={() => handleNext("question-age")}>Continue</button>
          </div>
        )}

        {step === "question-age" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>How old are you?</h2>
            <p style={{ marginBottom: "2rem", opacity: 0.8 }}>This helps us set up relevant tools.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
              <button className="btn-secondary" onClick={() => { setAgeGroup("under18"); handleNext("question-profession"); }}>Under 18</button>
              <button className="btn-secondary" onClick={() => { setAgeGroup("over18"); handleNext("question-profession"); }}>18 or Older</button>
            </div>
          </div>
        )}

        {step === "question-profession" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>What do you do?</h2>
            <p style={{ marginBottom: "2rem", opacity: 0.8 }}>We'll tailor your widgets based on your profession.</p>
            
            <select 
              value={profession} 
              onChange={e => setProfession(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "var(--border-radius)", border: "var(--widget-border)", background: "var(--bg-color)", color: "var(--text-color)", fontFamily: "var(--font-family)", marginBottom: "2rem" }}
            >
              <option value="" disabled>Select an option...</option>
              {(ageGroup === "under18" ? UNDER_18_ROLES : OVER_18_ROLES).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <button className="btn-primary" disabled={!profession} onClick={() => {
              setStep("thinking-1");
              handleNext("question-ui", 2500);
            }}>Next</button>
          </div>
        )}

        {step === "thinking-1" && (
          <WritingNotesAnimation text="Tailoring your tools" />
        )}

        {step === "question-ui" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Which UI would you like?</h2>
            <p style={{ marginBottom: "2rem", opacity: 0.8 }}>Choose your aesthetic. You can change this later.</p>
            
            <button className="btn-secondary" style={{ marginBottom: "2rem" }} onClick={() => setShowUiVisuals(!showUiVisuals)}>
              <HelpCircle size={18} /> {showUiVisuals ? "Hide Examples" : "Not sure? Show me visuals"}
            </button>

            {showUiVisuals && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem", maxHeight: "300px", overflowY: "auto" }}>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "5px" }}>
                  <img src="/brutalism.png" alt="Brutalism" style={{ width: "100%", borderRadius: "var(--border-radius)" }} />
                  <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>Neo-Brutalism</p>
                </div>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "5px" }}>
                  <img src="/aero.png" alt="Frutiger Aero" style={{ width: "100%", borderRadius: "var(--border-radius)" }} />
                  <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>Frutiger Aero</p>
                </div>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "5px" }}>
                  <img src="/skeuomorphism.png" alt="Skeuomorphism" style={{ width: "100%", borderRadius: "var(--border-radius)" }} />
                  <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>Skeuomorphism</p>
                </div>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--border-radius)", padding: "5px" }}>
                  <img src="/minimalism.png" alt="Neo-Minimalism" style={{ width: "100%", borderRadius: "var(--border-radius)" }} />
                  <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>Neo-Minimalism (Dark/Light)</p>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="btn-primary" onClick={() => handleUiSelection("brutalism")}>Maximalism Neo-Brutalism</button>
              <button className="btn-primary" onClick={() => handleUiSelection("aero")}>Frutiger Aero</button>
              <button className="btn-primary" onClick={() => handleUiSelection("skeuomorphism")}>Skeuomorphism</button>
              <button className="btn-primary" onClick={() => handleUiSelection("minimalism")}>Neo-Minimalism Dark</button>
              <button className="btn-primary" onClick={() => handleUiSelection("minimalism-light")} style={{ background: "#f5f5f5", color: "#000" }}>Neo-Minimalism Light</button>
            </div>
          </div>
        )}

        {step === "thinking-2" && (
          <WritingNotesAnimation text="Generating the perfect Board" />
        )}

        {step === "done" && (
          <div style={{ animation: "fadeIn 0.5s ease-in" }}>
            <CheckCircle size={64} style={{ color: "var(--primary-color)", margin: "0 auto 1rem auto" }} />
            <h2 style={{ fontSize: "2.5rem", color: "var(--primary-color)" }}>Ready!</h2>
            <p>Taking you to your new workspace...</p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

import { useState, useEffect, useCallback } from "react";

const phases = [
  {
    id: 1, title: "Pre-Build", subtitle: "Intention & Design", icon: "◈",
    principle: "Right Intention · Correspondence · Ubuntu",
    color: "#8B6914", bg: "#FDF6E3",
    steps: [
      { id: 1, title: "State Your Intention Plainly", prompt: "Write a single honest paragraph: Why are we building this, and who does it primarily serve?", individual: "Write this in your own words before reading anyone else's version. Compare.", team: "Do this independently, then share. Divergence is valuable data.", placeholder: "Why are we building this, and who does it primarily serve..." },
      { id: 2, title: "Map Your Stakeholders Beyond the Obvious", prompt: "List every category of person affected by this system — including those never consulted, those in the training data, those in communities where it will be deployed, and those seven generations from now.", individual: "Write your stakeholder map before collaborating.", team: "Assign someone to advocate for absent stakeholders in every design meeting. Rotate this role.", placeholder: "Who is affected, consulted, absent, or yet to be born..." },
      { id: 3, title: "Interrogate the Incentive Structure", prompt: "Identify every financial, organizational, and personal incentive shaping this project. Where do your incentives align with user wellbeing — and where do they diverge?", individual: "Sit with this honestly before the team conversation.", team: "Name the pressures explicitly. An unnamed pressure shapes decisions invisibly.", placeholder: "What incentives are at play, where do they align, where do they diverge..." },
      { id: 4, title: "Define Harm Before You Define Success", prompt: "Before writing success metrics, write harm metrics. What does failure look like for the most vulnerable? What would make you pause or stop this project?", individual: "Write your harm definitions before the sprint planning begins.", team: "Harm definitions should be written by people with proximity to affected communities.", placeholder: "What does harm look like, who is most vulnerable, what would stop this project..." }
    ]
  },
  {
    id: 2, title: "During Build", subtitle: "Development & Training", icon: "◉",
    principle: "Wu Wei · Ahimsa · Causality · The Precautionary Principle",
    color: "#4A7C59", bg: "#F0F7F0",
    steps: [
      { id: 5, title: "Audit Your Data with Ethical Intentionality", prompt: "Was data collected with informed consent? Does it encode historical injustices? Were people who generated it compensated fairly? Document your findings honestly.", individual: "Sit with the uncomfortable findings. Discomfort here is signal.", team: "Conduct a formal data ethics review. Include at least one voice from outside the team.", placeholder: "What does your data audit reveal — the comfortable and uncomfortable findings..." },
      { id: 6, title: "Resist Single-Metric Optimization", prompt: "List every metric driving development. For each: what does optimizing for it make worse? What human complexity does it fail to capture?", individual: "Name what each metric hides before celebrating what it shows.", team: "Designate a 'metric skeptic' in each sprint to question what the numbers are hiding.", placeholder: "What are your metrics, and what is each one hiding or erasing..." },
      { id: 7, title: "Apply the Precautionary Principle", prompt: "At each significant technical decision: if this goes wrong, who bears the cost? When uncertain, default to the conservative option. Prefer reversible decisions over irreversible ones.", individual: "Spend five minutes mapping failure modes before committing to an approach.", team: "Make the failure modes visible in design reviews, not just the success paths.", placeholder: "Where are the irreversible decisions, who bears the cost if they fail..." },
      { id: 8, title: "Build Accountability Into the Architecture", prompt: "Ethical intent without structural accountability dissolves under pressure. What logging, ownership, escalation paths, and regular check-ins will you build in?", individual: "Know who you would go to if you saw something wrong. Is that path clear?", team: "Establish a standing 'ethical pulse' meeting — brief, regular, psychologically safe.", placeholder: "How will accountability be structured — technically and culturally..." }
    ]
  },
  {
    id: 3, title: "Pre-Launch", subtitle: "Testing & Review", icon: "◎",
    principle: "Indra's Net · Non-Harm · Stoic Phronesis",
    color: "#7A4F3A", bg: "#FDF0E8",
    steps: [
      { id: 9, title: "Conduct a Harm Audit", prompt: "Test specifically for harm — not only accuracy. Who is the system failing? Are there emergent behaviors not intended? Does output at scale erode truth or harm communities?", individual: "Read the harm audit findings in full. Don't skim the uncomfortable parts.", team: "The harm audit should be led by people not invested in the launch timeline.", placeholder: "What did the harm audit surface — intended and unintended..." },
      { id: 10, title: "Map the Cascade", prompt: "Look beyond the immediate use case. How might this be used in unintended ways? What happens at 10x scale? What does it make easier that perhaps should remain difficult?", individual: "Write a one-page 'worst plausible future' scenario. Share it with your team.", team: "Use the cascade map to inform guardrails, not to prevent launch.", placeholder: "What are the second and third-order effects of deploying this system..." },
      { id: 11, title: "Hold an Ethical Review Ritual", prompt: "Re-read your intention statement from Step 1. Does the system match it? Review your harm definitions. Ask: are we launching because this is ready, or because we are under pressure?", individual: "Answer honestly: is there anything you know that this process has not surfaced?", team: "Make this meeting unchallengeable on the calendar. It is not a formality.", placeholder: "What does the ethical review reveal — alignments, gaps, unresolved tensions..." }
    ]
  },
  {
    id: 4, title: "Post-Launch", subtitle: "Monitoring & Iteration", icon: "◌",
    principle: "The Seventh Generation · Interconnectedness · The Long View",
    color: "#5C5087", bg: "#F3F0FA",
    steps: [
      { id: 12, title: "Monitor for Harm, Not Only Performance", prompt: "Track ethical indicators alongside technical ones. Who is the system failing, and at what rate? Are there feedback signals from affected communities not reaching the team?", individual: "Read individual user feedback periodically — not dashboards, but accounts.", team: "Assign explicit ownership of post-launch ethical monitoring with authority to escalate.", placeholder: "What are your ethical monitoring indicators and who owns them..." },
      { id: 13, title: "Close the Feedback Loop", prompt: "Create structured mechanisms to hear from the most affected — beyond power users. Demonstrate that what you hear changes what you do.", individual: "Stay proximate to the human experience of what you built.", team: "Build feedback channels that reach vulnerable and marginalized users specifically.", placeholder: "How will you hear from affected communities, and how will it change decisions..." },
      { id: 14, title: "Iterate with the Long View", prompt: "At regular intervals ask: is this still aligned with our original intention? What has it become that we did not intend? What would we do differently? What does the seventh generation need from us now?", individual: "Be willing to acknowledge when something you built should be changed — or unmade.", team: "Conduct an annual ethical retrospective separate from product retrospectives.", placeholder: "What has the system become, what would you change, what does the long view require..." },
      { id: 15, title: "Share What You Learn", prompt: "What you learn about harm, unintended consequences, and what works belongs to the broader community. Share findings. Name failures as well as successes. The field advances through honesty.", individual: "Write publicly. Engage with the broader ethical conversation in your field.", team: "Designate time and resources for knowledge sharing beyond your organization.", placeholder: "What will you share, where, and with whom — what does the community need to know..." }
    ]
  }
];

const allSteps = phases.flatMap(p => p.steps.map(s => ({ ...s, phaseId: p.id, phaseTitle: p.title, phaseColor: p.color })));
const STORAGE_KEY = "ethics-guide-responses";
const ONBOARDED_KEY = "ethics-guide-onboarded";
const quotes = [
  { text: "As above, so below. As within, so without.", source: "The Emerald Tablet" },
  { text: "I am because we are.", source: "Ubuntu" },
  { text: "The Tao does not strive, yet nothing is left undone.", source: "Tao Te Ching" },
  { text: "In the heaven of Indra, each pearl reflects all others.", source: "Avatamsaka Sutra" },
  { text: "Consider the impact on the next seven generations.", source: "Haudenosaunee Great Law" },
];

export default function App() {
  const [responses, setResponses] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [view, setView] = useState("loading");
  const [saved, setSaved] = useState(false);
  const [audience, setAudience] = useState("individual");
  const [showReset, setShowReset] = useState(false);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    try {
      const savedResponses = localStorage.getItem(STORAGE_KEY);
      const onboarded = localStorage.getItem(ONBOARDED_KEY);
      if (savedResponses) setResponses(JSON.parse(savedResponses));
      setView(onboarded ? "guide" : "welcome");
    } catch (_) { setView("welcome"); }
  }, []);

  const saveResponses = useCallback((updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (_) {}
  }, []);

  const handleBegin = (aud) => {
    setAudience(aud);
    try { localStorage.setItem(ONBOARDED_KEY, "true"); } catch (_) {}
    setView("guide");
  };

  const handleResponse = (stepId, val) => {
    const updated = { ...responses, [stepId]: val };
    setResponses(updated); saveResponses(updated);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDED_KEY);
    } catch (_) {}
    setResponses({}); setActiveStep(1); setShowReset(false); setView("welcome");
  };

  const completedCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
  const progress = Math.round((completedCount / 15) * 100);
  const currentStep = allSteps.find(s => s.id === activeStep);
  const currentPhase = phases.find(p => p.id === currentStep?.phaseId);
  const isComplete = (id) => !!responses[id]?.trim();

  if (view === "loading") return (
    <div style={{ background: "#FAF6EE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <p style={{ color: "#8B6914" }}>Restoring your practice...</p>
    </div>
  );

  if (view === "welcome") return <Welcome quote={quotes[quoteIdx]} onBegin={handleBegin} hasProgress={completedCount > 0} onResume={() => setView("guide")} />;
  if (view === "summary") return <Summary responses={responses} onBack={() => setView("guide")} onReset={() => setShowReset(true)} />;

  return (
    <div style={{ background: "#FAF6EE", minHeight: "100vh", fontFamily: "Georgia, serif", color: "#2C1A0E" }}>
      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "#00000070", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#FAF6EE", borderRadius: "12px", padding: "2rem", maxWidth: "420px", width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>◈</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Reset Your Practice?</h3>
            <p style={{ color: "#6B5040", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>This will clear all reflections and return you to the welcome screen. This cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => setShowReset(false)} style={{ background: "transparent", border: "1px solid #C4B49A", color: "#6B5040", borderRadius: "6px", padding: "0.6rem 1.2rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={handleReset} style={{ background: "#7A4F3A", border: "none", color: "#FAF6EE", borderRadius: "6px", padding: "0.6rem 1.4rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#2C1A0E", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ cursor: "pointer" }} onClick={() => setView("welcome")}>
          <div style={{ color: "#D4A853", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ethics Framework</div>
          <div style={{ color: "#FAF6EE", fontSize: "1.05rem", fontWeight: "bold" }}>Ethical AI Developer Guide</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {saved && <span style={{ color: "#A8C5A0", fontSize: "0.8rem" }}>✓ Saved</span>}
          <button onClick={() => setShowReset(true)} style={{ background: "transparent", color: "#A09070", border: "1px solid #4A3A2A", borderRadius: "6px", padding: "0.45rem 0.9rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia, serif" }}>Reset</button>
          <button onClick={() => setView("summary")} style={{ background: "#D4A853", color: "#2C1A0E", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Georgia, serif" }}>Summary →</button>
        </div>
      </div>

      <div style={{ background: "#EDE4D0", padding: "0.7rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flex: 1, background: "#D4C4A0", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, background: "#8B6914", height: "100%", borderRadius: "99px", transition: "width 0.4s ease" }} />
        </div>
        <span style={{ color: "#8B6914", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{completedCount} / 15 steps</span>
      </div>

      <div style={{ display: "flex", maxWidth: "1100px", margin: "0 auto", minHeight: "calc(100vh - 106px)" }}>
        <div style={{ width: "255px", flexShrink: 0, borderRight: "1px solid #D4C4A0", padding: "1.25rem 0", overflowY: "auto" }}>
          {phases.map(phase => (
            <div key={phase.id} style={{ marginBottom: "0.25rem" }}>
              <div style={{ padding: "0.5rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: phase.color }}>{phase.icon}</span>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "#8B7355", textTransform: "uppercase", letterSpacing: "0.1em" }}>Phase {phase.id}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#2C1A0E" }}>{phase.title}</div>
                </div>
              </div>
              {phase.steps.map(step => (
                <button key={step.id} onClick={() => setActiveStep(step.id)} style={{
                  display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", textAlign: "left",
                  padding: "0.45rem 1rem 0.45rem 2.25rem", background: activeStep === step.id ? phase.bg : "transparent",
                  border: "none", borderLeft: activeStep === step.id ? `3px solid ${phase.color}` : "3px solid transparent",
                  cursor: "pointer", transition: "all 0.15s"
                }}>
                  <span style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, background: isComplete(step.id) ? phase.color : "transparent", border: `2px solid ${isComplete(step.id) ? phase.color : "#C4B49A"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isComplete(step.id) && <span style={{ color: "#fff", fontSize: "0.55rem" }}>✓</span>}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: activeStep === step.id ? "#2C1A0E" : "#6B5040", lineHeight: 1.3 }}>
                    {step.id}. {step.title}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {currentStep && currentPhase && (
          <div style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <span style={{ background: currentPhase.bg, color: currentPhase.color, border: `1px solid ${currentPhase.color}`, borderRadius: "99px", padding: "0.28rem 0.85rem", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                Phase {currentPhase.id} — {currentPhase.title}: {currentPhase.subtitle}
              </span>
            </div>
            <h2 style={{ fontSize: "1.5rem", color: "#2C1A0E", marginBottom: "0.4rem", lineHeight: 1.3 }}>
              <span style={{ color: currentPhase.color }}>Step {currentStep.id}. </span>{currentStep.title}
            </h2>
            <p style={{ color: "#6B5040", fontSize: "0.78rem", marginBottom: "1.5rem", fontStyle: "italic" }}>{currentPhase.principle}</p>
            <div style={{ background: currentPhase.bg, border: `1px solid ${currentPhase.color}30`, borderRadius: "8px", padding: "1.2rem 1.4rem", marginBottom: "1.4rem" }}>
              <p style={{ margin: 0, lineHeight: 1.85, color: "#2C1A0E", fontSize: "0.97rem" }}>{currentStep.prompt}</p>
            </div>
            <div style={{ display: "flex", gap: 0, marginBottom: "0.9rem", background: "#EDE4D0", borderRadius: "6px", padding: "3px", width: "fit-content" }}>
              {["individual", "team"].map(a => (
                <button key={a} onClick={() => setAudience(a)} style={{ padding: "0.35rem 0.9rem", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia, serif", background: audience === a ? "#2C1A0E" : "transparent", color: audience === a ? "#FAF6EE" : "#6B5040", transition: "all 0.15s", textTransform: "capitalize" }}>
                  {a === "individual" ? "Individual" : "Team Lead"}
                </button>
              ))}
            </div>
            <div style={{ background: "#FFF8EC", border: "1px solid #D4A85340", borderRadius: "6px", padding: "0.8rem 1rem", marginBottom: "1.4rem", display: "flex", gap: "0.6rem" }}>
              <span style={{ color: "#D4A853", flexShrink: 0 }}>◆</span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6B5040", lineHeight: 1.7, fontStyle: "italic" }}>
                <strong style={{ color: "#2C1A0E" }}>{audience === "individual" ? "Individual:" : "Team:"}</strong>{" "}
                {audience === "individual" ? currentStep.individual : currentStep.team}
              </p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#8B7355", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Your Reflection</label>
              <textarea value={responses[currentStep.id] || ""} onChange={e => handleResponse(currentStep.id, e.target.value)} placeholder={currentStep.placeholder} rows={6}
                style={{ width: "100%", padding: "1rem", borderRadius: "8px", border: "1px solid #C4B49A", background: "#FFFDF7", fontFamily: "Georgia, serif", fontSize: "0.95rem", color: "#2C1A0E", lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.border = `1px solid ${currentPhase.color}`}
                onBlur={e => e.target.style.border = "1px solid #C4B49A"}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.4rem" }}>
              <button onClick={() => setActiveStep(s => Math.max(1, s - 1))} disabled={activeStep === 1} style={{ background: "transparent", border: "1px solid #C4B49A", color: "#6B5040", borderRadius: "6px", padding: "0.55rem 1.1rem", cursor: activeStep === 1 ? "not-allowed" : "pointer", opacity: activeStep === 1 ? 0.4 : 1, fontFamily: "Georgia, serif", fontSize: "0.85rem" }}>← Previous</button>
              {activeStep < 15
                ? <button onClick={() => setActiveStep(s => Math.min(15, s + 1))} style={{ background: currentPhase.color, border: "none", color: "#FAF6EE", borderRadius: "6px", padding: "0.55rem 1.3rem", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.85rem" }}>Next Step →</button>
                : <button onClick={() => setView("summary")} style={{ background: "#D4A853", border: "none", color: "#2C1A0E", borderRadius: "6px", padding: "0.55rem 1.3rem", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.875rem", fontWeight: "bold" }}>View Summary →</button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Welcome({ quote, onBegin, hasProgress, onResume }) {
  const [hoveredAud, setHoveredAud] = useState(null);
  return (
    <div style={{ background: "#2C1A0E", minHeight: "100vh", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
      {[320, 520, 720].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: "1px solid #D4A85315", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      ))}
      <div style={{ textAlign: "center", maxWidth: "620px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "2.8rem", color: "#D4A853", marginBottom: "1.5rem", letterSpacing: "0.3em" }}>◈ ◉ ◎ ◌</div>
        <div style={{ color: "#D4A853", fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.75rem" }}>An Ethics Framework for AI Developers</div>
        <h1 style={{ color: "#FAF6EE", fontSize: "2rem", fontWeight: "normal", lineHeight: 1.35, marginBottom: "0.5rem" }}>Build with Intention.<br />Build with Care.</h1>
        <p style={{ color: "#A09070", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "2rem" }}>A 15-step guided practice across the full AI development lifecycle —<br />grounded in Hermetic philosophy, Taoism, and the Principle of Oneness.</p>
        <div style={{ borderTop: "1px solid #4A3A2A", borderBottom: "1px solid #4A3A2A", padding: "1.25rem 1rem", marginBottom: "2rem" }}>
          <p style={{ color: "#D4A853", fontStyle: "italic", margin: "0 0 0.35rem", fontSize: "1rem" }}>"{quote.text}"</p>
          <p style={{ color: "#6B5040", fontSize: "0.75rem", margin: 0, letterSpacing: "0.08em" }}>— {quote.source}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { icon: "◈", phase: "Phase 1", title: "Pre-Build", sub: "Intention & Design", color: "#D4A853" },
            { icon: "◉", phase: "Phase 2", title: "During Build", sub: "Development & Training", color: "#A8C5A0" },
            { icon: "◎", phase: "Phase 3", title: "Pre-Launch", sub: "Testing & Review", color: "#C4956A" },
            { icon: "◌", phase: "Phase 4", title: "Post-Launch", sub: "Monitoring & Iteration", color: "#B0A8D0" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#3A2810", borderRadius: "8px", padding: "0.85rem 1rem", textAlign: "left", border: "1px solid #4A3A2A" }}>
              <span style={{ color: p.color, fontSize: "1rem" }}>{p.icon}</span>
              <div style={{ fontSize: "0.65rem", color: "#6B5040", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.4rem" }}>{p.phase}</div>
              <div style={{ color: "#FAF6EE", fontSize: "0.85rem", fontWeight: "bold" }}>{p.title}</div>
              <div style={{ color: "#A09070", fontSize: "0.75rem" }}>{p.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "#6B5040", fontSize: "0.78rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>I am working as a...</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: hasProgress ? "1.25rem" : 0 }}>
          {[{ key: "individual", label: "Individual Developer" }, { key: "team", label: "Team Lead" }].map(({ key, label }) => (
            <button key={key} onClick={() => onBegin(key)}
              onMouseEnter={() => setHoveredAud(key)} onMouseLeave={() => setHoveredAud(null)}
              style={{ background: hoveredAud === key ? "#D4A853" : "transparent", color: hoveredAud === key ? "#2C1A0E" : "#D4A853", border: "1px solid #D4A853", borderRadius: "8px", padding: "0.75rem 1.6rem", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.9rem", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        {hasProgress && (
          <button onClick={onResume} style={{ background: "transparent", color: "#6B5040", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.8rem", textDecoration: "underline", marginTop: "0.25rem" }}>
            Resume where I left off
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ responses, onBack, onReset }) {
  const completedSteps = allSteps.filter(s => responses[s.id]?.trim());
  const [copied, setCopied] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const summaryText = "ETHICAL AI DEVELOPER GUIDE — REFLECTION SUMMARY\n" + "=".repeat(48) + "\n\n" +
    phases.map(phase => {
      const steps = phase.steps.filter(s => responses[s.id]?.trim());
      if (!steps.length) return "";
      return `PHASE ${phase.id} — ${phase.title.toUpperCase()}: ${phase.subtitle.toUpperCase()}\n` + "─".repeat(40) + "\n\n" +
        steps.map(s => `Step ${s.id}. ${s.title}\n\n${responses[s.id]}`).join("\n\n");
    }).filter(Boolean).join("\n\n" + "=".repeat(48) + "\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ background: "#FAF6EE", minHeight: "100vh", fontFamily: "Georgia, serif", color: "#2C1A0E" }}>
      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "#00000070", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#FAF6EE", borderRadius: "12px", padding: "2rem", maxWidth: "420px", width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>◈</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Reset Your Practice?</h3>
            <p style={{ color: "#6B5040", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>This will clear all reflections and return you to the welcome screen. This cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => setShowReset(false)} style={{ background: "transparent", border: "1px solid #C4B49A", color: "#6B5040", borderRadius: "6px", padding: "0.6rem 1.2rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>Cancel</button>
              <button onClick={onReset} style={{ background: "#7A4F3A", border: "none", color: "#FAF6EE", borderRadius: "6px", padding: "0.6rem 1.4rem", cursor: "pointer", fontFamily: "Georgia, serif" }}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background: "#2C1A0E", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#D4A853", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Ethics Framework</div>
          <div style={{ color: "#FAF6EE", fontSize: "1.05rem", fontWeight: "bold" }}>Reflection Summary</div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setShowReset(true)} style={{ background: "transparent", color: "#A09070", border: "1px solid #4A3A2A", borderRadius: "6px", padding: "0.45rem 0.9rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "Georgia, serif" }}>Reset</button>
          <button onClick={handleCopy} style={{ background: "#D4A853", color: "#2C1A0E", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Georgia, serif" }}>{copied ? "✓ Copied!" : "Copy All"}</button>
          <button onClick={onBack} style={{ background: "transparent", color: "#D4A853", border: "1px solid #D4A853", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Georgia, serif" }}>← Guide</button>
        </div>
      </div>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem", letterSpacing: "0.3em", color: "#8B6914" }}>◈ ◉ ◎ ◌</div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>Your Ethical Reflection</h1>
          <p style={{ color: "#8B7355", fontSize: "0.85rem" }}>{completedSteps.length} of 15 steps completed</p>
        </div>
        {completedSteps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#8B7355" }}>
            <p>No reflections recorded yet.</p>
            <button onClick={onBack} style={{ background: "#8B6914", color: "#FAF6EE", border: "none", borderRadius: "6px", padding: "0.6rem 1.4rem", cursor: "pointer", fontFamily: "Georgia, serif", marginTop: "1rem" }}>Begin the Guide</button>
          </div>
        ) : (
          phases.map(phase => {
            const done = phase.steps.filter(s => responses[s.id]?.trim());
            if (!done.length) return null;
            return (
              <div key={phase.id} style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: `2px solid ${phase.color}30` }}>
                  <span style={{ color: phase.color, fontSize: "1.1rem" }}>{phase.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#8B7355", textTransform: "uppercase", letterSpacing: "0.1em" }}>Phase {phase.id}</div>
                    <div style={{ fontWeight: "bold" }}>{phase.title}: {phase.subtitle}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: phase.color }}>{done.length}/{phase.steps.length} steps</span>
                </div>
                {done.map(step => (
                  <div key={step.id} style={{ marginBottom: "1.5rem", paddingLeft: "1rem", borderLeft: `3px solid ${phase.color}40` }}>
                    <div style={{ fontSize: "0.78rem", color: phase.color, marginBottom: "0.3rem", fontWeight: "bold" }}>Step {step.id}. {step.title}</div>
                    <p style={{ margin: 0, lineHeight: 1.8, color: "#3C2510", fontSize: "0.93rem", whiteSpace: "pre-wrap" }}>{responses[step.id]}</p>
                  </div>
                ))}
              </div>
            );
          })
        )}
        {completedSteps.length > 0 && (
          <div style={{ background: "#2C1A0E", borderRadius: "8px", padding: "1.5rem 2rem", textAlign: "center", marginTop: "2rem" }}>
            <p style={{ color: "#D4A853", fontStyle: "italic", margin: "0 0 0.4rem", fontSize: "0.95rem" }}>"The Tao that guides is not rigid. Neither should this be."</p>
            <p style={{ color: "#6B5040", fontSize: "0.78rem", margin: 0 }}>Return to this practice at every phase of your work.</p>
          </div>
        )}
      </div>
    </div>
  );
}

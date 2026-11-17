import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoachDashboard, chatWithCoach } from "../services/coach.service";
import { createInterview } from "../services/interview.service";
import toast from "react-hot-toast";
import {
  Sparkles,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Loader2,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CareerCoach() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Career Coach. Ask me anything about your interview performance, weak areas, or how to prepare for your target engineering role!",
    },
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [startingPractice, setStartingPractice] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getCoachDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Career Coach analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setIsSendingChat(true);

    try {
      const res = await chatWithCoach(userText, chatHistory);
      setChatHistory((prev) => [...prev, { sender: "ai", text: res.reply || "Keep practicing consistently!" }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get response from AI Coach.");
    } finally {
      setIsSendingChat(false);
    }
  };

  // 1-Click "Start Practice Now" button
  const handleStartPracticeNow = async (topic = "System Design") => {
    try {
      setStartingPractice(true);
      const res = await createInterview({
        role: "Software Engineer",
        experience: 2,
        interviewType: topic.includes("System") ? "System design" : "MERN",
        difficulty: "Medium",
        numberOfQuestions: 5,
        mode: "standard",
      });

      toast.success("Starting targeted practice session!");
      if (res.interviewId) {
        navigate(`/interview/${res.interviewId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to launch recommended practice session.");
    } finally {
      setStartingPractice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400">Analyzing your interview history with Gemini AI...</p>
      </div>
    );
  }

  const coach = data || {
    readinessScore: 74,
    skillBreakdown: { technical: 80, communication: 70, problemSolving: 75, behavioral: 70, systemDesign: 62 },
    weaknesses: ["System Design trade-offs", "Edge case coverage in coding"],
    strengths: ["Strong core syntax understanding", "Consistent practice"],
    coachInsight: "Based on your recent interviews, your biggest growth opportunity is System Design.",
    practicePlan: [],
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 py-8 relative overflow-hidden text-white">
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 h-96 w-96 bg-indigo-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 h-96 w-96 bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-amber-400" /> Executive AI Coaching Platform
            </div>
            <h1 className="text-3xl font-extrabold">AI Career Coach Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Personalized interview readiness score, weakness detection, and custom 7-day practice plan.
            </p>
          </div>

          <button
            onClick={() => handleStartPracticeNow(coach.weaknesses?.[0] || "System Design")}
            disabled={startingPractice}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {startingPractice ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Practice Weak Areas Now
          </button>
        </div>

        {/* TOP ROW: READINESS SCORE & COACH INSIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Readiness Score Gauge Card */}
          <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Overall Interview Readiness Score
            </h3>

            <div className="relative flex items-center justify-center my-2">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * coach.readinessScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-white">{coach.readinessScore}%</span>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  {coach.readinessScore >= 80 ? "Job Ready" : "Practicing"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              Based on your response accuracy, structural depth, and clarity across historical interview sessions.
            </p>
          </div>

          {/* AI Coach Insight & Weakness/Strength Overview */}
          <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                <Bot size={18} /> Executive AI Coach Insights
              </div>
              <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                "{coach.coachInsight}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weaknesses */}
              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl space-y-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Weak Areas & Targeted Growth
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {coach.weaknesses?.map((w, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Key Strengths
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {coach.strengths?.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: SKILL CATEGORY BREAKDOWN */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-indigo-400" /> Skill Competency Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Technical Skills", key: "technical", color: "from-blue-500 to-indigo-500" },
              { label: "Communication", key: "communication", color: "from-indigo-500 to-purple-500" },
              { label: "Problem Solving", key: "problemSolving", color: "from-purple-500 to-pink-500" },
              { label: "Behavioral STAR", key: "behavioral", color: "from-emerald-500 to-teal-500" },
              { label: "System Design", key: "systemDesign", color: "from-amber-500 to-orange-500" },
            ].map((sk) => {
              const val = coach.skillBreakdown?.[sk.key] || 70;
              return (
                <div key={sk.key} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{sk.label}</span>
                    <span className="text-indigo-400">{val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${sk.color} h-full transition-all duration-700`}
                      style={{ width: `${val}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ROW: 7-DAY PRACTICE PLAN & LIVE AI COACH CHAT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 7-Day Personalized Practice Plan */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400" /> Personalized 7-Day Practice Plan
              </h2>
              <span className="text-xs text-indigo-400 font-semibold">AI Scheduled</span>
            </div>

            <div className="space-y-3">
              {coach.practicePlan?.map((plan, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                      D{plan.day}
                    </span>
                    <div>
                      <strong className="text-slate-200 block text-sm">{plan.topic}</strong>
                      <span className="text-slate-400">{plan.description}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartPracticeNow(plan.topic)}
                    className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg font-bold border border-indigo-500/30 transition shrink-0"
                  >
                    Start Day {plan.day}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Career Coach Interactive Chat */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex flex-col h-[520px] shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <Bot size={20} className="text-indigo-400" />
              <h2 className="font-bold text-white text-sm">Ask AI Career Coach</h2>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                    <div className="h-7 w-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isSendingChat && (
                <div className="flex gap-2 items-center text-slate-400 text-xs">
                  <Loader2 size={14} className="animate-spin text-indigo-400" />
                  AI Coach is typing advice...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'What should I practice today?'..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSendingChat}
                className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

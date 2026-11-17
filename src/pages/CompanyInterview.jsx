import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createInterview } from "../services/interview.service";
import toast from "react-hot-toast";
import CheckoutModal from "../components/CheckoutModal";
import {
  Building2, Sparkles, ArrowRight, Briefcase, CreditCard, Lock, Unlock,
} from "lucide-react";

const COMPANIES = [
  { id: "google", label: "Google", emoji: "🔵" },
  { id: "amazon", label: "Amazon", emoji: "🟠" },
  { id: "microsoft", label: "Microsoft", emoji: "🟦" },
  { id: "meta", label: "Meta (Facebook)", emoji: "🔷" },
  { id: "apple", label: "Apple", emoji: "⬛" },
  { id: "netflix", label: "Netflix", emoji: "🔴" },
  { id: "tcs", label: "TCS", emoji: "🟢" },
  { id: "infosys", label: "Infosys", emoji: "🟣" },
  { id: "wipro", label: "Wipro", emoji: "💜" },
  { id: "accenture", label: "Accenture", emoji: "🟡" },
  { id: "deloitte", label: "Deloitte", emoji: "🔶" },
  { id: "cognizant", label: "Cognizant", emoji: "🔵" },
  { id: "capgemini", label: "Capgemini", emoji: "🔵" },
];

const FOCUS_TYPES = [
  { value: "DSA", label: "DSA & Coding" },
  { value: "System design", label: "System Design" },
  { value: "Behavioral", label: "Behavioral / HR" },
  { value: "MERN", label: "Full Stack (MERN)" },
  { value: "HR", label: "HR Round" },
];

// Free = ≤5 questions, Paid = >5 questions
const FREE_LIMIT = 5;

export default function CompanyInterview() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pendingConfig, setPendingConfig] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: "Software Engineer",
      experience: 2,
      interviewType: "DSA",
      difficulty: "Medium",
      numberOfQuestions: 5,
    },
  });

  const numQ = Number(watch("numberOfQuestions") || 5);
  const isPaidInterview = numQ > FREE_LIMIT;

  const onSubmit = async (data) => {
    if (!selectedCompany) {
      toast.error("Please select a company first.");
      return;
    }

    const config = {
      role: data.role,
      experience: Number(data.experience),
      interviewType: data.interviewType,
      difficulty: data.difficulty,
      numberOfQuestions: Number(data.numberOfQuestions),
      mode: "company",
      company: selectedCompany.label,
    };

    if (isPaidInterview) {
      // Open checkout — interview created server-side after payment verification
      setPendingConfig(config);
      setShowCheckout(true);
      return;
    }

    // Free interview (≤5 questions) — create directly
    try {
      setLoading(true);
      const res = await createInterview(config);
      toast.success(res.message || "Company interview generated!");
      if (res.interviewId) navigate(`/interview/${res.interviewId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-indigo-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 size={14} /> Company-Based Interview
          </div>
          <h1 className="text-4xl font-extrabold text-white">Company Interview Prep</h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto text-sm">
            AI-generated practice questions inspired by publicly known hiring patterns of top companies.
          </p>
          <div className="mt-3 inline-block bg-amber-950/40 border border-amber-500/20 text-amber-300 text-xs px-4 py-2 rounded-xl">
            ⚠️ These are <strong>AI-generated</strong> practice questions inspired by general hiring patterns — not official company questions.
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-16 w-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <Sparkles className="absolute text-amber-400 animate-pulse" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Generating Company Interview</h2>
              <p className="text-slate-400">Calibrating questions to {selectedCompany?.label}&apos;s hiring style…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Grid */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Select Target Company <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {COMPANIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      id={`company-${c.id}`}
                      onClick={() => setSelectedCompany(c)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        selectedCompany?.id === c.id
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg"
                          : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-base">{c.emoji}</span>
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Target Job Role</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, SDE-2"
                    {...register("role", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-amber-500 transition text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Focus Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Interview Focus</label>
                  <select
                    {...register("interviewType")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-500 transition text-sm"
                  >
                    {FOCUS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Difficulty</label>
                  <select
                    {...register("difficulty")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-500 transition text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Years of Experience</label>
                  <input
                    type="number" min="0" max="40"
                    {...register("experience")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-500 transition text-sm"
                  />
                </div>

                {/* Questions */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Questions
                    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full border ${
                      isPaidInterview
                        ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
                        : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                    }`}>
                      {isPaidInterview ? "💳 Paid" : "✅ Free"}
                    </span>
                  </label>
                  <input
                    type="number" min="1" max="20"
                    {...register("numberOfQuestions")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-500 transition text-sm"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    1–{FREE_LIMIT} questions = Free. {FREE_LIMIT + 1}–20 = Paid interview.
                  </p>
                </div>
              </div>

              {/* Paid notice */}
              {isPaidInterview && (
                <div className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                  <Lock size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-200 mb-0.5">Payment Required</strong>
                    You selected {numQ} questions (above the free limit of {FREE_LIMIT}). A secure payment via Razorpay is required. Your interview is created and unlocked only after server-side payment verification.
                  </div>
                </div>
              )}

              {!isPaidInterview && (
                <div className="flex items-start gap-3 p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                  <Unlock size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-200 mb-0.5">Free Interview</strong>
                    Up to {FREE_LIMIT} questions are free. Upgrade to a paid plan for more questions, adaptive difficulty, and company-focused deep dives.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                id="start-company-interview-btn"
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition-all duration-300 disabled:opacity-50 ${
                  isPaidInterview
                    ? "bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,.3)]"
                    : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,.3)]"
                }`}
              >
                {isPaidInterview ? (
                  <><CreditCard size={17} /> Proceed to Checkout</>
                ) : (
                  <><Sparkles size={17} /> Start Free Company Interview</>
                )}
                <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        interviewConfig={pendingConfig}
        defaultPlan="standard"
      />
    </div>
  );
}

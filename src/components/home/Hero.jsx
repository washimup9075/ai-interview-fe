import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-12">

        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
          >

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-xl">

              <Sparkles
                size={16}
                className="text-emerald-400"
              />

              <span className="text-sm font-medium text-emerald-300">
                AI Powered Interview Preparation
              </span>

            </div>

            {/* Heading */}

            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">

              Master Interviews.

              <span className="block text-emerald-400">

                Build Confidence.

              </span>

              Land Better Jobs.

            </h1>

            {/* Description */}

            <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">

              Practice AI mock interviews, improve communication,
              solve coding challenges and receive instant feedback—
              everything you need to crack your dream company.

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                to="/signup"
                className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,.35)]"
              >
                Get Started

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />

              </Link>

              <button className="flex items-center gap-2 rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-amber-400 hover:text-white">

                <PlayCircle size={18} />

                Watch Demo

              </button>

            </div>

            {/* Trusted */}

            <div className="mt-10 flex items-center gap-5">

              <div className="flex -space-x-3">

                <div className="h-11 w-11 rounded-full border-2 border-slate-950 bg-emerald-500" />

                <div className="h-11 w-11 rounded-full border-2 border-slate-950 bg-amber-400" />

                <div className="h-11 w-11 rounded-full border-2 border-slate-950 bg-slate-300" />

              </div>

              <div>

                <p className="font-semibold text-white">

                  Trusted by 12,000+ learners

                </p>

                <p className="text-sm text-slate-500">

                  Preparing for Google, Amazon, Microsoft & more

                </p>

              </div>

            </div>

            {/* Features */}

            <div className="mt-10 flex flex-wrap gap-5">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span className="text-slate-300">

                  AI Mock Interviews

                </span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span className="text-slate-300">

                  Coding Practice

                </span>

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span className="text-slate-300">

                  Resume Review

                </span>

              </div>

            </div>

            {/* Stats */}

            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">

              <div className="grid grid-cols-3">

                <div>

                  <h3 className="text-3xl font-bold text-white">

                    12K+

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Active Users

                  </p>

                </div>

                <div className="border-x border-slate-800 px-6">

                  <h3 className="text-3xl font-bold text-white">

                    350K+

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Interviews

                  </p>

                </div>

                <div className="pl-6">

                  <h3 className="text-3xl font-bold text-white">

                    95%

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Success Rate

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}

         

          <div className="hidden lg:flex items-center justify-center">
              <HeroVisual />
          </div>

        </div>

      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="relative border-t border-slate-900 bg-slate-950/60 py-20 px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">How PrepPilot Works</h2>
            <p className="mt-4 text-slate-400 text-base leading-7">
              Get interview-ready in three simple steps. Our AI handles the prompt engineering, generation, and grading under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-slate-800 transition">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Configure Role & Scope</h3>
              <p className="text-slate-400 text-sm leading-6">
                Specify your target job title, experience level, interview type (e.g. MERN, DSA, HR), and desired difficulty.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-slate-800 transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Conduct the Interview</h3>
              <p className="text-slate-400 text-sm leading-6">
                Answer dynamically generated questions in a clean, distraction-free environment. Save or skip questions as you progress.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-slate-800 transition">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-extrabold text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Review AI Assessment</h3>
              <p className="text-slate-400 text-sm leading-6">
                Receive instant question-by-question scoring and constructive feedback explaining what you nailed and where to expand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI BENEFITS SECTION */}
      <div className="relative border-t border-slate-900 bg-slate-950/20 py-20 px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                AI grading engine
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Evaluate your answers with Google Gemini.
              </h2>
              <p className="mt-6 text-slate-400 leading-8">
                PrepPilot leverages the state-of-the-art **gemini-3.6-flash** model on the backend. Your answers are graded on accuracy, vocabulary, structure, and job role relevance. 
              </p>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm leading-6">
                    **Context-aware grading**: Evaluates answer accuracy tailored to your experience level.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm leading-6">
                    **Constructive feedback loops**: Explains missing points and offers precise examples to perfect your phrasing.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm leading-6">
                    **Secure architecture**: API keys are kept strictly on the backend, ensuring a safe connection.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-6">Sample Evaluation Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold mb-1">Question</p>
                  <p className="text-sm text-slate-200">Explain the difference between REST and GraphQL.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold mb-1">Candidate Answer</p>
                  <p className="text-sm text-slate-400">REST uses URLs for endpoints while GraphQL lets you query exactly what you want in a single request.</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-indigo-400 font-bold">AI Feedback & Score</p>
                    <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                      Score: 8/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-5">
                    "Solid contrast. You correctly identified that REST uses endpoints and GraphQL uses selective queries. To improve, mention protocol formats (JSON over HTTP) and under/over-fetching disadvantages in REST."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xl font-bold text-white">
              Prep<span className="text-indigo-400">Pilot</span>
            </span>
            <p className="text-xs text-slate-500 mt-1">© 2026 PrepPilot. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Contact</span>
          </div>
        </div>
      </footer>

    </section>
  );
}
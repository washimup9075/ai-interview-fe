import { CheckCircle,Sparkles } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950">
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)] px-6 py-10 grid lg:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center">

          

        <div className="flex items-center gap-2 w-fit rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-indigo-400">
          <Sparkles size={18} />
          <span>AI Powered Interview Platform</span>
        </div>

          <h1 className="mt-6 text-5xl font-bold text-white leading-tight">
            Crack your
            <span className="text-indigo-500"> dream job </span>
            with AI.
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-xl">
            Practice real interview questions, improve communication,
            receive instant AI feedback, and monitor your progress—
            all from one platform.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-indigo-500" size={20} />
              AI Mock Interviews
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-indigo-500" size={20} />
              Resume Review
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-indigo-500" size={20} />
              Coding Assessments
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-indigo-500" size={20} />
              AI Performance Analytics
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center">
          {children}
        </div>

      </div>
    </div>
  );
}
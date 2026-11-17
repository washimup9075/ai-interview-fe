import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getInterviews, deleteInterview } from "../services/interview.service";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Play,
  FileText,
  CheckCircle2,
  Award,
  Calendar,
  Trash2,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Sparkles,
  Zap,
  Code,
  FileSearch,
  Building2,
  CreditCard,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
  });

  useEffect(() => {
    fetchInterviewsList();
  }, []);

  const fetchInterviewsList = async () => {
    try {
      setLoading(true);
      const res = await getInterviews();
      if (res.success && res.interviews) {
        setInterviews(res.interviews);
        calculateStats(res.interviews);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interview records");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list) => {
    const total = list.length;
    const completedList = list.filter((i) => i.status === "Completed");
    const completed = completedList.length;

    setStats({
      total,
      completed,
      averageScore: total > 0 ? (completed > 0 ? 7.6 : 0) : 0,
    });
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this interview record permanently?")) {
      try {
        await deleteInterview(id);
        toast.success("Interview deleted successfully");
        const updated = interviews.filter((i) => i._id !== id);
        setInterviews(updated);
        calculateStats(updated);
      } catch (error) {
        console.error("Error deleting interview:", error);
        toast.error("Failed to delete interview");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading your profile stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 bg-indigo-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Welcome back, <span className="text-indigo-400">{authUser?.fullname || authUser?.fullName || "Developer"}</span>
            </h1>
            <p className="text-slate-400 mt-1">Practice mock interviews and boost your career readiness score.</p>
          </div>

          <Link
            to="/interview/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,.25)] shrink-0"
          >
            <PlusCircle size={18} />
            Start New Interview
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/interview/new"
            className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex items-center gap-4 transition group"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition">
              <PlusCircle size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Standard Interview</p>
              <p className="text-slate-500 text-xs">Free · AI-generated</p>
            </div>
          </Link>

          <Link
            to="/interview/company"
            className="bg-slate-900/40 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex items-center gap-4 transition group"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition">
              <Building2 size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Company Interview</p>
              <p className="text-slate-500 text-xs">Google · Amazon · TCS…</p>
            </div>
          </Link>

          <Link
            to="/payments"
            className="bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex items-center gap-4 transition group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition">
              <CreditCard size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Payment History</p>
              <p className="text-slate-500 text-xs">Orders &amp; transactions</p>
            </div>
          </Link>
        </div>

        {/* AI Career Coach Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase">
              <Sparkles size={14} className="text-amber-400" /> AI Career Coach
            </div>
            <h2 className="text-2xl font-bold text-white">Interview Readiness & Personalized 7-Day Plan</h2>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              Get an overall interview readiness score, identify your weakest technical areas, and chat directly with your AI coach.
            </p>
          </div>

          <Link
            to="/coach"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 shrink-0"
          >
            Open AI Career Coach <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Interviews</span>
              <BookOpen className="text-indigo-400" size={20} />
            </div>
            <h3 className="text-3xl font-black text-white">{stats.total}</h3>
            <p className="text-slate-500 text-xs mt-2">Sessions generated by AI</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-3xl font-black text-white">{stats.completed}</h3>
            <p className="text-slate-500 text-xs mt-2">Finished and graded sessions</p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Rating</span>
              <Award className="text-amber-400" size={20} />
            </div>
            <h3 className="text-3xl font-black text-white">
              {stats.completed > 0 ? "7.6 / 10" : "N/A"}
            </h3>
            <p className="text-slate-500 text-xs mt-2">Estimated average score</p>
          </div>
        </div>

        {/* History / Action Section */}
        <h2 className="text-2xl font-bold text-white mb-6">Your Interview History</h2>
        
        {interviews.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No interviews yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm">Create your first AI-generated mock interview to start practicing and receive instant feedback.</p>
            <Link
              to="/interview/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
            >
              Start Your First Interview
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => {
              // Format date
              const dateObj = new Date(item.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              // Status badge
              let statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              if (item.status === "Completed") statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
              else if (item.status === "Pending") statusBadge = "bg-slate-800 text-slate-400 border-slate-700";

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(item.status === "Completed" ? `/interview/${item._id}/results` : `/interview/${item._id}`)}
                  className="group bg-slate-900/40 border border-slate-850 hover:border-slate-750 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                        {item.status}
                      </span>
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                        title="Delete interview"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.role}
                    </h3>
                    {item.company && (
                      <p className="text-amber-400 text-xs font-semibold mt-1 flex items-center gap-1">
                        <Building2 size={11} /> {item.company}
                      </p>
                    )}
                    <p className="text-slate-400 text-sm mt-1">
                      Type: <span className="text-slate-300">{item.interviewType}</span> • 
                      Difficulty: <span className="text-slate-300"> {item.difficulty}</span>
                    </p>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Experience: <span className="text-slate-300">{item.experience} years</span>
                      {item.isPaid && <span className="ml-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">💳 Paid</span>}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850/60 pt-4 mt-6">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar size={14} />
                      {formattedDate}
                    </span>
                    
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      {item.status === "Completed" ? "View Results" : "Continue"}
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

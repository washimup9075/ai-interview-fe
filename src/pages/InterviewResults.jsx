import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getInterviewById, deleteInterview } from "../services/interview.service";
import toast from "react-hot-toast";
import { Award, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, RotateCcw, Award as ScoreIcon, Trash2 } from "lucide-react";

export default function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await getInterviewById(id);
      if (res.success && res.interview) {
        setInterview(res.interview);
        setQuestions(res.interview.questions || []);
      } else {
        toast.error("Failed to load interview results");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading interview results:", error);
      toast.error("Results not found or unauthorized");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this interview record permanently?")) {
      try {
        await deleteInterview(id);
        toast.success("Interview deleted successfully");
        navigate("/dashboard");
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
        <p className="text-slate-400">Loading AI assessment results...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== "").length;
  
  const sumScores = questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const rawAverage = totalQuestions > 0 ? sumScores / totalQuestions : 0;
  const averageScore = parseFloat(rawAverage.toFixed(1));

  // Determine score level details
  let scoreColor = "text-red-500 border-red-500/20 bg-red-500/5";
  let scoreLabel = "Needs Focus";
  if (averageScore >= 8) {
    scoreColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    scoreLabel = "Excellent Work";
  } else if (averageScore >= 5) {
    scoreColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    scoreLabel = "Solid Practice";
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-[350px] w-[350px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
          >
            <Trash2 size={16} />
            Delete Record
          </button>
        </div>

        {/* Score Overview Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-xl grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Assessment Summary
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-3">{interview?.role}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Type: <span className="text-slate-300">{interview?.interviewType}</span> • 
              Difficulty: <span className="text-slate-300"> {interview?.difficulty}</span> • 
              Experience: <span className="text-slate-300"> {interview?.experience} yrs</span>
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Completion</p>
                <p className="text-xl font-bold text-slate-200 mt-1">{answeredQuestions} / {totalQuestions} Questions</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-slate-200 mt-1">{interview?.status}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6 text-center">
            <div className={`h-28 w-28 rounded-full border-2 flex flex-col items-center justify-center shadow-lg ${scoreColor}`}>
              <span className="text-3xl font-black">{averageScore}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">out of 10</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-4">{scoreLabel}</h3>
            <p className="text-xs text-slate-500 mt-1">Average rating across all questions</p>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/interview/new"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md hover:shadow-indigo-500/10 text-center"
          >
            <RotateCcw size={18} />
            Practice Another Role
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300 hover:text-white font-semibold py-3.5 px-6 rounded-xl transition text-center"
          >
            Go to My History
          </Link>
        </div>

        {/* Detailed Breakdown */}
        <h2 className="text-xl font-bold text-white mb-4">Question-by-Question AI Evaluation</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isExpanded = expandedQuestion === idx;
            const hasAnswer = q.answer && q.answer.trim() !== "";
            
            let qBadgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
            if (q.score >= 8) qBadgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            else if (q.score >= 5) qBadgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";

            return (
              <div
                key={q._id}
                className="bg-slate-900/30 border border-slate-850 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mr-4">
                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-sm font-semibold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-slate-200 font-semibold text-base line-clamp-2 md:line-clamp-none">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {hasAnswer ? (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${qBadgeColor}`}>
                            Score: {q.score}/10
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700/50">
                            Skipped
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="text-slate-500" size={20} />
                    ) : (
                      <ChevronDown className="text-slate-500" size={20} />
                    )}
                  </div>
                </div>

                {/* Details Accordion Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-slate-850 bg-slate-950/40 space-y-4">
                    {/* User Answer */}
                    <div className="pt-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Answer</h4>
                      <div className="mt-2 text-slate-300 text-sm leading-relaxed p-4 rounded-lg bg-slate-950/80 border border-slate-900">
                        {hasAnswer ? q.answer : <span className="italic text-slate-600">No response provided. Question was skipped.</span>}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Award size={14} className="text-indigo-400" />
                        AI Grading & Feedback
                      </h4>
                      <div className="mt-2 text-slate-300 text-sm leading-relaxed p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                        {q.aiFeedback ? q.aiFeedback : <span className="italic text-slate-600">No evaluation available. Please submit an answer to receive feedback.</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

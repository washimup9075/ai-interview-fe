import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getInterviewById } from "../services/interview.service";
import { executeCodeSandbox, submitCodingAnswer } from "../services/question.service";
import toast from "react-hot-toast";
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  ArrowRight,
  RotateCcw,
  Terminal,
  FileCode,
  Award,
} from "lucide-react";

export default function CodingInterviewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [aiReview, setAiReview] = useState(null);

  useEffect(() => {
    fetchCodingDetails();
  }, [id]);

  const fetchCodingDetails = async () => {
    try {
      setLoading(true);
      const res = await getInterviewById(id);
      if (res.success && res.interview) {
        setInterview(res.interview);
        const q = res.interview.questions?.[0];
        setQuestion(q);

        const initial = res.interview.codingProblem?.initialCode || `function solution(arg) {\n  // Write your code here\n  return arg;\n}`;
        setCode(q?.codeSubmitted || initial);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load coding interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    try {
      setExecuting(true);
      const testCases = interview?.codingProblem?.testCases || [
        { input: "5", expectedOutput: "5" }
      ];

      const res = await executeCodeSandbox(code, testCases);
      setTestResults(res);
      if (res.passedCount === res.totalCount) {
        toast.success(`All ${res.totalCount} test cases passed!`);
      } else {
        toast.error(`${res.passedCount}/${res.totalCount} test cases passed.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Execution failed.");
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!question) return;

    try {
      setSubmitting(true);
      const res = await submitCodingAnswer(question._id, code, language);
      if (res.success) {
        setAiReview(res.review || res.codeEvaluation);
        toast.success("AI Code Review completed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400">Loading Coding Workspace...</p>
      </div>
    );
  }

  const problem = interview?.codingProblem || {
    title: interview?.role + " Coding Challenge",
    description: question?.question || "Write an efficient function to resolve the challenge.",
    constraints: "Standard time & space limits apply.",
    sampleInput: "Sample Input",
    sampleOutput: "Sample Output",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="text-indigo-400" size={24} />
          <div>
            <h1 className="font-bold text-white text-base">{problem.title}</h1>
            <span className="text-xs text-indigo-400 uppercase font-semibold">
              {interview?.difficulty} • {language}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={executing || submitting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            {executing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run Code
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Submit & AI Code Review
          </button>

          <button
            onClick={() => navigate(`/interview/${id}/results`)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            View Results
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Panel: Problem Statement & Results */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-900/40 p-6 overflow-y-auto space-y-6 max-h-[calc(100vh-120px)]">
          {/* Problem Statement */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode size={20} className="text-indigo-400" /> Problem Statement
            </h2>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {problem.description}
            </div>

            {problem.constraints && (
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-400">
                <strong className="text-slate-300 block mb-1">Constraints:</strong>
                {problem.constraints}
              </div>
            )}
          </div>

          {/* Test Case Execution Output */}
          {testResults && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-400" /> Test Execution Results
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  testResults.passedCount === testResults.totalCount
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {testResults.passedCount} / {testResults.totalCount} Passed
                </span>
              </div>

              <div className="space-y-2">
                {testResults.testResults?.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      res.passed
                        ? "bg-emerald-950/20 border-emerald-500/30"
                        : "bg-red-950/20 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className={res.passed ? "text-emerald-400" : "text-red-400"}>
                        {res.passed ? "✓ Test Case Passed" : "✗ Test Case Failed"}
                      </span>
                      <span className="text-slate-500">Input: {res.input}</span>
                    </div>
                    <div className="text-slate-400">Expected: <code className="text-slate-200">{res.expected}</code></div>
                    <div className="text-slate-400">Actual: <code className="text-slate-200">{res.actual}</code></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Code Review Results */}
          {aiReview && (
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <Award size={18} className="text-amber-400" /> AI Code Review & Feedback
                </h3>
                <span className="bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold">
                  Score: {aiReview.overallScore ?? aiReview.score * 10}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Correctness</span>
                  <span className="font-bold text-emerald-400 text-sm">{aiReview.correctness ?? 8}/10</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Complexity</span>
                  <span className="font-bold text-indigo-400 text-xs">{aiReview.complexity || "O(N)"}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800 whitespace-pre-line">
                {aiReview.feedback || aiReview.aiFeedback}
              </div>

              {aiReview.improvedCode && (
                <div>
                  <span className="text-xs font-bold text-indigo-400 block mb-1">AI Optimized Solution:</span>
                  <pre className="p-3 bg-slate-950 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 overflow-x-auto">
                    {aiReview.improvedCode}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Monaco Code Editor */}
        <div className="lg:col-span-7 bg-slate-950 flex flex-col h-[calc(100vh-120px)]">
          <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <span>Editor Solution (JavaScript)</span>
            <button
              onClick={() => setCode(interview?.codingProblem?.initialCode || "")}
              className="flex items-center gap-1 hover:text-white"
            >
              <RotateCcw size={12} /> Reset Starter Code
            </button>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

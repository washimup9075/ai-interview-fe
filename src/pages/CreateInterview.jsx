import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createInterview } from "../services/interview.service";
import { parseResumeData } from "../services/resume.service";
import { analyzeJobDescriptionData } from "../services/jd.service";
import toast from "react-hot-toast";
import {
  Sparkles,
  Briefcase,
  Settings,
  AlertCircle,
  ArrowRight,
  FileText,
  FileSearch,
  Mic,
  Code,
  Upload,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";

export default function CreateInterview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("standard"); // standard | resume | jd | voice | coding
  const [loading, setLoading] = useState(false);

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [parsedResume, setParsedResume] = useState(null);
  const [isParsingResume, setIsParsingResume] = useState(false);

  // JD state
  const [jdText, setJdText] = useState("");
  const [parsedJd, setParsedJd] = useState(null);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "Full Stack Engineer",
      experience: 2,
      interviewType: "MERN",
      difficulty: "Medium",
      numberOfQuestions: 5,
    },
  });

  // Parse uploaded resume
  const handleParseResume = async () => {
    if (!resumeFile && !resumeText.trim()) {
      toast.error("Please select a resume file (PDF) or paste resume text.");
      return;
    }

    try {
      setIsParsingResume(true);
      let res;
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        res = await parseResumeData(formData);
      } else {
        res = await parseResumeData({ resumeText });
      }

      setParsedResume(res.analysis);
      if (res.resumeText) setResumeText(res.resumeText);
      if (res.analysis?.suggestedTopics?.length > 0) {
        setValue("role", res.analysis.suggestedTopics[0] + " Specialist");
      }
      toast.success("Resume parsed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process resume.");
    } finally {
      setIsParsingResume(false);
    }
  };

  // Analyze Job Description
  const handleAnalyzeJd = async () => {
    if (!jdText.trim()) {
      toast.error("Please paste the job description text.");
      return;
    }

    try {
      setIsAnalyzingJd(true);
      const res = await analyzeJobDescriptionData({
        jobDescriptionText: jdText,
        resumeText: resumeText || "",
      });

      setParsedJd(res.analysis);
      if (res.analysis?.jobTitle) {
        setValue("role", res.analysis.jobTitle);
      }
      toast.success("Job Description analyzed!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to analyze Job Description.");
    } finally {
      setIsAnalyzingJd(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let mode = activeTab;
      let finalType = data.interviewType;
      let currentResumeText = resumeText;
      let currentParsedResume = parsedResume;

      if (activeTab === "resume") {
        finalType = "Resume-Based";
        if (!currentResumeText.trim() && resumeFile) {
          toast.loading("Extracting content from uploaded PDF resume...", { id: "resume-extract" });
          const formData = new FormData();
          formData.append("resume", resumeFile);
          const parseRes = await parseResumeData(formData);
          currentResumeText = parseRes.resumeText || "";
          currentParsedResume = parseRes.analysis || null;
          setResumeText(currentResumeText);
          setParsedResume(currentParsedResume);
          toast.dismiss("resume-extract");
        }
        if (!currentResumeText.trim()) {
          toast.error("Please upload a PDF resume or paste resume text first.");
          setLoading(false);
          return;
        }
      } else if (activeTab === "jd") {
        finalType = "Job-Description";
        if (!jdText.trim()) {
          toast.error("Please paste the Job Description text first.");
          setLoading(false);
          return;
        }
      } else if (activeTab === "coding") {
        finalType = "Coding";
      }

      const payload = {
        ...data,
        experience: Number(data.experience),
        numberOfQuestions: Number(data.numberOfQuestions),
        interviewType: finalType,
        mode: mode,
        resumeText: currentResumeText,
        resumeAnalysis: currentParsedResume,
        jobDescriptionText: jdText,
        jdAnalysis: parsedJd,
      };

      const res = await createInterview(payload);
      toast.success(res.message || "Interview generated successfully!");
      if (res.interviewId) {
        navigate(`/interview/${res.interviewId}`);
      } else {
        throw new Error("Interview ID not returned");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(error.response?.data?.message || "Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 py-10 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} /> AI Interview Setup
          </div>
          <h1 className="text-4xl font-extrabold text-white">Create AI Interview</h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">
            Choose your preferred interview practice mode and customize parameters for real-time AI feedback.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl mb-8">
          {[
            { id: "standard", label: "Standard", icon: Settings },
            { id: "resume", label: "Resume-Based", icon: FileText },
            { id: "jd", label: "Job Description", icon: FileSearch },
            { id: "voice", label: "Voice Mode", icon: Mic },
            { id: "coding", label: "Coding Challenge", icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Card Form */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-16 w-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute text-indigo-400 animate-pulse" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Generating AI Interview</h2>
              <p className="text-slate-400 max-w-md">
                Our Gemini AI model is synthesizing personalized technical scenarios tailored to your setup...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* TAB 1: RESUME-BASED INTERVIEW */}
              {activeTab === "resume" && (
                <div className="p-5 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                    <FileText size={18} />
                    <span>Upload or Paste Resume for Targeted Questions</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload PDF */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Upload PDF Resume
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-950/60 hover:border-indigo-500 transition">
                          <Upload className="text-slate-400 mb-2" size={24} />
                          <p className="text-xs text-slate-400">
                            {resumeFile ? resumeFile.name : "Click to upload PDF resume"}
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.txt"
                            className="hidden"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Or Paste Raw Text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Or Paste Resume Text
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Paste skills, projects, and work experience here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleParseResume}
                    disabled={isParsingResume}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {isParsingResume ? (
                      <>
                        <div className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        Parsing Resume with Gemini AI...
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Extract & Preview Resume Insights
                      </>
                    )}
                  </button>

                  {/* Resume Parsed Summary Card */}
                  {parsedResume && (
                    <div className="mt-4 p-4 bg-slate-950/90 border border-indigo-500/30 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                          <CheckCircle2 size={16} /> Extracted Resume Summary
                        </span>
                        <span className="text-slate-400">{parsedResume.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedResume.skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      {parsedResume.projects?.length > 0 && (
                        <p className="text-slate-400">
                          <strong className="text-slate-300">Projects:</strong> {parsedResume.projects.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: JOB DESCRIPTION INTERVIEW */}
              {activeTab === "jd" && (
                <div className="p-5 bg-purple-950/30 border border-purple-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    <FileSearch size={18} />
                    <span>Paste Job Description to Match Role Requirements</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Job Description Text
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Paste the full job posting, responsibilities, and required qualifications..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-white placeholder-slate-500 outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyzeJd}
                    disabled={isAnalyzingJd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {isAnalyzingJd ? (
                      <>
                        <div className="h-3 w-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        Analyzing Job Match...
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Calculate Job Match & Interview Strategy
                      </>
                    )}
                  </button>

                  {/* JD Analysis Summary Card */}
                  {parsedJd && (
                    <div className="mt-4 p-4 bg-slate-950/90 border border-purple-500/30 rounded-xl text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-400">
                          {parsedJd.jobTitle} ({parsedJd.seniority || "Mid-Senior"})
                        </span>
                        <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-full font-bold">
                          Job Match: {parsedJd.matchScore}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedJd.requiredSkills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {parsedJd.missingSkills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md"
                          >
                            ✗ {skill} (Target Area)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VOICE MODE */}
              {activeTab === "voice" && (
                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
                  <Mic size={20} className="text-amber-400 shrink-0" />
                  <div>
                    <strong className="block font-bold text-white mb-0.5">Voice Interview Mode Enabled</strong>
                    Questions will be spoken aloud, and your voice answers will be transcribed live and graded by Gemini.
                  </div>
                </div>
              )}

              {/* TAB 4: CODING INTERVIEW */}
              {activeTab === "coding" && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl flex items-center gap-3 text-cyan-300 text-xs">
                  <Code size={20} className="text-cyan-400 shrink-0" />
                  <div>
                    <strong className="block font-bold text-white mb-0.5">Coding Challenge Mode Enabled</strong>
                    Includes interactive code editor, isolated VM sandbox execution, test case runner, and AI Code Review.
                  </div>
                </div>
              )}

              {/* COMMON INTERVIEW PARAMETERS */}
              {/* Job Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Target Job Role / Position
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Briefcase size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer, React Developer"
                    {...register("role", {
                      required: "Job role is required",
                    })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-11 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Category / Topic
                  </label>
                  <select
                    {...register("interviewType", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
                  >
                    <option value="MERN">MERN Stack</option>
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="HR">HR / Leadership</option>
                    <option value="System design">System Design</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Coding">Coding Challenge</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    {...register("difficulty", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Adaptive">Adaptive (Dynamic difficulty)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    {...register("experience", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    {...register("numberOfQuestions", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,.3)] disabled:opacity-50"
              >
                Start {activeTab.toUpperCase()} Interview
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

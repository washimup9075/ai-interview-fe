import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewById } from "../services/interview.service";
import { submitQuestionAnswer } from "../services/question.service";
import toast from "react-hot-toast";
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  PlayCircle,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Gauge,
  Zap,
} from "lucide-react";

export default function InterviewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMetrics, setVoiceMetrics] = useState({ fillerCount: 0, wpm: 0, wordCount: 0 });
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchInterviewDetails();
  }, [id]);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      rec.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Update voice metrics dynamically when answer text changes
  useEffect(() => {
    if (!answer) {
      setVoiceMetrics({ fillerCount: 0, wpm: 0, wordCount: 0 });
      return;
    }
    const words = answer.trim().split(/\s+/);
    const wordCount = words.length;
    const fillers = (answer.match(/\b(um|uh|like|you know|actually|basically|so)\b/gi) || []).length;
    setVoiceMetrics({
      wordCount,
      fillerCount: fillers,
      wpm: Math.round(wordCount * 1.5), // Approximate speaking rate
    });
  }, [answer]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      const res = await getInterviewById(id);
      if (res.success && res.interview) {
        setInterview(res.interview);

        // Check if coding interview mode
        if (res.interview.mode === "coding" || res.interview.interviewType === "Coding") {
          navigate(`/interview/${id}/coding`);
          return;
        }

        const qList = res.interview.questions || [];
        setQuestions(qList);

        const firstUnansweredIndex = qList.findIndex((q) => !q.answer || q.answer.trim() === "");
        if (firstUnansweredIndex === -1 && qList.length > 0) {
          navigate(`/interview/${id}/results`);
        } else {
          setCurrentIndex(firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0);
        }
      } else {
        toast.error("Failed to load interview details");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error("Interview not found or unauthorized");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech: Read question aloud
  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech is not supported in this browser.");
    }
  };

  // Toggle Microphone
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Voice recording started...");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAnswerSubmit = async (skip = false) => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    if (!skip && !answer.trim()) {
      toast.error("Please type your answer or click 'Skip Question'");
      return;
    }

    try {
      setSubmitting(true);
      const currentQuestion = questions[currentIndex];
      const answerText = skip ? "" : answer.trim();

      const res = await submitQuestionAnswer(currentQuestion._id, answerText);
      if (res.success) {
        toast.success(skip ? "Question skipped" : "Answer evaluated!");

        // Handle dynamically returned follow-up question
        if (res.followUpQuestion) {
          toast((t) => (
            <span className="flex items-center gap-2 font-bold text-amber-400">
              <Zap size={18} /> Gemini generated an adaptive follow-up question!
            </span>
          ));
          const updatedQList = [...questions];
          updatedQList.splice(currentIndex + 1, 0, res.followUpQuestion);
          setQuestions(updatedQList);
        }

        const updatedQuestions = [...questions];
        updatedQuestions[currentIndex] = res.question;
        setQuestions(updatedQuestions);

        setAnswer("");

        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length || res.followUpQuestion) {
          setCurrentIndex(nextIndex);
        } else {
          toast.success("Interview completed! View detailed results...");
          navigate(`/interview/${id}/results`);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end this interview early?")) {
      navigate(`/interview/${id}/results`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading interview workspace...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-center px-4">
        <AlertCircle className="text-red-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">No Questions Found</h2>
        <p className="text-slate-400 mb-6 max-w-sm">This interview has no questions associated with it.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 py-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 h-96 w-96 bg-indigo-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 h-96 w-96 bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-3xl bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full">
                {interview?.interviewType}
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Gauge size={12} /> {interview?.difficulty || "Adaptive"}
              </span>
              {interview?.mode === "voice" && (
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 rounded-full">
                  🎙️ Voice Mode
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{interview?.role}</h1>
          </div>

          <button
            onClick={handleEndInterview}
            className="text-xs font-semibold text-slate-400 hover:text-red-400 transition"
          >
            End Interview Early
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
            <span>Interview Progress</span>
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Follow-Up Badge */}
        {currentQuestion?.isFollowUp && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span>Gemini Adaptive Follow-Up Question (Digging Deeper)</span>
          </div>
        )}

        {/* Question Box */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 md:p-6 mb-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-sm shrink-0">
                Q{currentIndex + 1}
              </span>
              <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
                {currentQuestion?.question}
              </p>
            </div>

            {/* Read Aloud Button */}
            <button
              onClick={() => speakQuestion(currentQuestion?.question)}
              title="Read Question Aloud"
              className={`p-2 rounded-xl border transition ${
                isSpeaking
                  ? "bg-indigo-600 text-white border-indigo-400 animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Answer Workspace */}
        <div className="relative">
          {submitting && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center z-10 p-6">
              <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
              <h3 className="text-lg font-bold text-white mb-1">Gemini AI Evaluation in Progress</h3>
              <p className="text-slate-400 text-xs max-w-xs">
                Grading response accuracy, technical depth, and checking if an adaptive follow-up is needed...
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300">Your Candidate Response</label>

            {/* Voice Mic Toggle */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isRecording
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                  : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff size={14} /> Stop Recording...
                </>
              ) : (
                <>
                  <Mic size={14} /> Speak Answer (Mic)
                </>
              )}
            </button>
          </div>

          <textarea
            placeholder="Type or speak your answer here. Provide specific context, code architecture, or STAR framework examples..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitting}
            className="w-full min-h-[160px] rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 transition leading-relaxed resize-y text-sm"
          ></textarea>

          {/* Voice Analytics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mt-2 px-1">
            <div className="flex items-center gap-4">
              <span>Length: <strong className="text-slate-300">{voiceMetrics.wordCount} words</strong></span>
              <span>Pace: <strong className="text-slate-300">{voiceMetrics.wpm} WPM</strong></span>
              <span>Filler Words: <strong className={voiceMetrics.fillerCount > 3 ? "text-amber-400" : "text-emerald-400"}>{voiceMetrics.fillerCount}</strong></span>
            </div>
            <span>{answer.length} characters</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => handleAnswerSubmit(true)}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 text-xs font-semibold"
          >
            Skip Question
          </button>

          <button
            onClick={() => handleAnswerSubmit(false)}
            disabled={submitting}
            className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,.3)] disabled:opacity-50 text-sm"
          >
            Submit Answer & Grade
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

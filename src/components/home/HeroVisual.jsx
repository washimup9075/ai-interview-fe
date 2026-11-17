import { motion } from "framer-motion";
import {
  Bot,
  FileText,
  Briefcase,
  Code2,
  Sparkles,
} from "lucide-react";

const floating = (delay = 0) => ({
  y: [0, -12, 0],
  transition: {
    duration: 4,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

function Node({ icon, title, className }) {
  return (
    <motion.div
      animate={floating(Math.random())}
      whileHover={{ scale: 1.08 }}
      className={`absolute flex flex-col items-center gap-3 ${className}`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,.18)]">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-300">
        {title}
      </p>
    </motion.div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative -mt-60 h-[600px] w-[600px]">

      {/* Glow */}

      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-[90px]" />

      {/* Connecting Lines */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 600"
      >
        <line
          x1="300"
          y1="300"
          x2="300"
          y2="120"
          stroke="#1f2937"
          strokeWidth="2"
        />

        <line
          x1="300"
          y1="300"
          x2="120"
          y2="300"
          stroke="#1f2937"
          strokeWidth="2"
        />

        <line
          x1="300"
          y1="300"
          x2="480"
          y2="300"
          stroke="#1f2937"
          strokeWidth="2"
        />

        <line
          x1="300"
          y1="300"
          x2="300"
          y2="480"
          stroke="#1f2937"
          strokeWidth="2"
        />
      </svg>

      {/* Center */}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-900"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,.5)]">
          <Bot
            size={42}
            className="text-slate-950"
          />
        </div>
      </motion.div>

      {/* Nodes */}

      <Node
        icon={<FileText className="text-emerald-400" />}
        title="Resume"
        className="left-1/2 top-6 -translate-x-1/2"
      />

      <Node
        icon={<Briefcase className="text-emerald-400" />}
        title="Interview"
        className="left-6 top-1/2 -translate-y-1/2"
      />

      <Node
        icon={<Code2 className="text-emerald-400" />}
        title="Coding"
        className="right-6 top-1/2 -translate-y-1/2"
      />

      <Node
        icon={<Sparkles className="text-amber-400" />}
        title="Career"
        className="bottom-6 left-1/2 -translate-x-1/2"
      />
    </div>
  );
}
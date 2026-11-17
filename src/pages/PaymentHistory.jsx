import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPaymentHistory } from "../services/payment.service";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  ArrowRight,
  AlertCircle,
  IndianRupee,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  paid: { label: "Paid", icon: CheckCircle2, className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  created: { label: "Pending", icon: Clock, className: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  failed: { label: "Failed", icon: XCircle, className: "text-red-400 bg-red-500/10 border-red-500/20" },
  cancelled: { label: "Cancelled", icon: AlertCircle, className: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  refunded: { label: "Refunded", icon: AlertCircle, className: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getPaymentHistory();
      if (res.success) {
        setPayments(res.payments || []);
        const spent = (res.payments || [])
          .filter((p) => p.status === "paid")
          .reduce((acc, p) => acc + p.amount / 100, 0); // amount is in paise
        setTotalSpent(spent);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading payment history…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-10 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-64 w-64 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <CreditCard className="text-indigo-400" size={28} />
              Payment History
            </h1>
            <p className="text-slate-400 mt-1 text-sm">All your interview purchase records and transaction details.</p>
          </div>
          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-white text-sm flex items-center gap-1.5 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Transactions</p>
            <h3 className="text-3xl font-black text-white">{payments.length}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Successful Payments</p>
            <h3 className="text-3xl font-black text-emerald-400">{payments.filter((p) => p.status === "paid").length}</h3>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Spent</p>
            <h3 className="text-3xl font-black text-white flex items-center gap-1">
              <IndianRupee size={22} />
              {totalSpent.toFixed(0)}
            </h3>
          </div>
        </div>

        {/* Payment Records */}
        {payments.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <Receipt size={40} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No transactions yet</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Purchase a paid interview to see your transaction history here.
            </p>
            <Link
              to="/interview/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 transition text-sm"
            >
              Start New Interview <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">All Transactions</h2>
            {payments.map((payment) => {
              const statusConf = STATUS_CONFIG[payment.status] || STATUS_CONFIG.created;
              const StatusIcon = statusConf.icon;
              const date = new Date(payment.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const time = new Date(payment.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const amountINR = (payment.amount / 100).toFixed(0);

              return (
                <div
                  key={payment._id}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Plan icon */}
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <CreditCard size={20} className="text-indigo-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold text-sm">{payment.planLabel || "Interview Plan"}</h3>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConf.className} flex items-center gap-1`}
                        >
                          <StatusIcon size={10} />
                          {statusConf.label}
                        </span>
                      </div>

                      {payment.interview && (
                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                          <Building2 size={11} />
                          {payment.interview.role}
                          {payment.interview.company && ` @ ${payment.interview.company}`}
                          {" · "}
                          <span className="text-slate-500">{payment.interview.interviewType}</span>
                        </p>
                      )}

                      <div className="text-slate-500 text-xs mt-1 space-x-2">
                        <span>{date} {time}</span>
                        {payment.razorpayOrderId && (
                          <span className="font-mono opacity-60">Order: {payment.razorpayOrderId.slice(0, 18)}…</span>
                        )}
                        {payment.razorpayPaymentId && (
                          <span className="font-mono opacity-60">Pay ID: {payment.razorpayPaymentId.slice(0, 16)}…</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-white font-black text-xl flex items-center gap-0.5">
                      <IndianRupee size={16} />
                      {amountINR}
                    </span>

                    {payment.status === "paid" && payment.interview?._id && (
                      <Link
                        to={
                          payment.interview.status === "Completed"
                            ? `/interview/${payment.interview._id}/results`
                            : `/interview/${payment.interview._id}`
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        {payment.interview.status === "Completed" ? "View Results" : "Continue Interview"}
                        <ArrowRight size={12} />
                      </Link>
                    )}
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

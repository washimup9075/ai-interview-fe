import React, { useState, useEffect } from "react";
import { X, CreditCard, CheckCircle2, XCircle, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { createOrder, verifyPayment, cancelPayment } from "../services/payment.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PLAN_DETAILS = {
  basic: {
    label: "Basic Interview",
    price: "₹49",
    amountINR: 49,
    features: ["5 AI Questions", "Basic AI Feedback", "1 Interview Session"],
    color: "from-slate-700 to-slate-800",
    accent: "text-slate-300",
    border: "border-slate-600",
  },
  standard: {
    label: "Standard Interview",
    price: "₹99",
    amountINR: 99,
    features: ["10 AI Questions", "Detailed AI Feedback", "Company-Style Questions", "Score Breakdown"],
    color: "from-indigo-900 to-indigo-950",
    accent: "text-indigo-300",
    border: "border-indigo-500/40",
    popular: true,
  },
  premium: {
    label: "Premium Interview",
    price: "₹199",
    amountINR: 199,
    features: ["20 AI Questions", "Full AI Analysis", "Adaptive Difficulty", "Company-Focused", "Career Insights"],
    color: "from-purple-900 to-purple-950",
    accent: "text-purple-300",
    border: "border-purple-500/40",
  },
};

export default function CheckoutModal({ isOpen, onClose, interviewConfig, defaultPlan = "standard" }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | processing | success | failed | cancelled

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("idle");
      setSelectedPlan(defaultPlan);
    }
  }, [isOpen, defaultPlan]);

  if (!isOpen) return null;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay || document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const processServerVerification = async (payload) => {
    try {
      setPaymentStatus("processing");
      const verifyRes = await verifyPayment(payload);

      if (verifyRes.success) {
        setPaymentStatus("success");
        toast.success("Payment verified! Interview unlocked.");
        setTimeout(() => {
          onClose();
          navigate(`/interview/${verifyRes.interviewId}`);
        }, 1800);
      } else {
        setPaymentStatus("failed");
        toast.error(verifyRes.message || "Payment verification failed. Please contact support.");
      }
    } catch (err) {
      setPaymentStatus("failed");
      toast.error(err.response?.data?.message || "Verification error. Contact support.");
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus("processing");

      // 1. Create order on backend
      const orderData = await createOrder({
        plan: selectedPlan,
        interviewConfig,
      });

      if (!orderData || !orderData.success) {
        toast.error(orderData?.message || "Failed to create payment order.");
        setPaymentStatus("idle");
        return;
      }

      // 2. Handle Sandbox / Test mode fallback
      if (orderData.isSandbox || !orderData.key || orderData.key.includes("demo") || orderData.key.includes("REPLACE")) {
        // Simulated sandbox payment verification (instant test mode)
        toast("Processing sandbox test payment…", { icon: "💳" });
        setTimeout(() => {
          processServerVerification({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `pay_demo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            razorpaySignature: `sig_demo_${Date.now()}`,
            paymentDbId: orderData.paymentDbId,
          });
        }, 1200);
        return;
      }

      // 3. Load Razorpay SDK for live/test Razorpay API key
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        // Fallback to sandbox mode if script blocked or fails
        processServerVerification({
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: `pay_demo_${Date.now()}`,
          razorpaySignature: `sig_demo_${Date.now()}`,
          paymentDbId: orderData.paymentDbId,
        });
        return;
      }

      // 4. Open official Razorpay modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "PrepPilot AI Interviews",
        description: PLAN_DETAILS[selectedPlan]?.label || "Paid Interview Session",
        order_id: orderData.orderId,
        handler: function (razorpayResponse) {
          processServerVerification({
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            paymentDbId: orderData.paymentDbId,
          });
        },
        prefill: {
          name: interviewConfig?.userName || "",
          email: interviewConfig?.userEmail || "",
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: async function () {
            if (paymentStatus !== "success") {
              setPaymentStatus("cancelled");
              if (orderData.paymentDbId) {
                try { await cancelPayment(orderData.paymentDbId); } catch (_) {}
              }
              toast("Payment cancelled.", { icon: "ℹ️" });
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        setPaymentStatus("failed");
        toast.error(`Payment failed: ${response.error.description}`);
        if (orderData.paymentDbId) {
          try { await cancelPayment(orderData.paymentDbId); } catch (_) {}
        }
      });
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus("failed");
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    if (paymentStatus === "processing") return;
    setPaymentStatus("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <CreditCard size={16} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Unlock Paid Interview</h2>
              <p className="text-slate-400 text-xs">Secure checkout via Razorpay</p>
            </div>
          </div>
          {paymentStatus !== "processing" && (
            <button
              onClick={handleClose}
              id="checkout-close-btn"
              className="text-slate-500 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Payment Status States */}
          {paymentStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="animate-spin text-indigo-400 mb-4" size={40} />
              <h3 className="text-white font-bold text-lg">Processing Payment…</h3>
              <p className="text-slate-400 text-sm mt-1">Verifying transaction and unlocking interview questions.</p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="text-emerald-400 mb-4" size={48} />
              <h3 className="text-white font-bold text-xl">Payment Successful!</h3>
              <p className="text-slate-300 text-sm mt-2">Your interview is unlocked. Redirecting…</p>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <XCircle className="text-red-400 mb-4" size={48} />
              <h3 className="text-white font-bold text-xl">Payment Failed</h3>
              <p className="text-slate-400 text-sm mt-2">Your payment could not be processed.</p>
              <button
                onClick={() => setPaymentStatus("idle")}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentStatus === "cancelled" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="text-amber-400 mb-4" size={48} />
              <h3 className="text-white font-bold text-xl">Payment Cancelled</h3>
              <p className="text-slate-400 text-sm mt-2">You cancelled the payment. Your interview was not created.</p>
              <button
                onClick={() => setPaymentStatus("idle")}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentStatus === "idle" && (
            <>
              {/* Interview Config Summary */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-sm space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={12} /> Interview Preview
                </div>
                <p className="text-white font-medium">{interviewConfig?.role || "Interview Role"}</p>
                {interviewConfig?.company && (
                  <p className="text-slate-400">Company: <span className="text-slate-200">{interviewConfig.company}</span></p>
                )}
                <p className="text-slate-400">
                  {interviewConfig?.interviewType} • {interviewConfig?.difficulty} • {interviewConfig?.experience} yrs exp
                </p>
              </div>

              {/* Plan Selection */}
              <div>
                <p className="text-slate-300 text-sm font-semibold mb-3">Choose Your Plan</p>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
                    <button
                      key={key}
                      id={`plan-${key}`}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
                        selectedPlan === key
                          ? `bg-gradient-to-r ${plan.color} ${plan.border} border shadow-lg`
                          : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <div>
                        <p className={`font-bold text-sm ${selectedPlan === key ? plan.accent : "text-slate-300"}`}>
                          {plan.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {plan.features.map((f, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`font-black text-lg shrink-0 ml-3 ${selectedPlan === key ? "text-white" : "text-slate-300"}`}>
                        {plan.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Payments are secured via Razorpay. Server-side verification is applied before interview unlock.</span>
              </div>

              {/* Pay Button */}
              <button
                id="pay-now-btn"
                type="button"
                onClick={handlePayment}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all hover:shadow-[0_0_25px_rgba(99,102,241,.4)] flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                Pay {PLAN_DETAILS[selectedPlan]?.price} & Unlock Interview
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { PlusCircle, LayoutDashboard, LogOut, Sparkles, Building2, CreditCard } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    const authUser = useAuthStore((state) => state.authUser);
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white flex items-center gap-2"
        >
          Prep<span className="text-indigo-500">Pilot</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
            AI Coach
          </span>
        </Link>

        {/* Auth Buttons */}
        {authUser ? (
            <div className="flex items-center gap-2">
                <NavLink
                  className={navLinkClass}
                  to="/dashboard"
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={15} />
                    Dashboard
                  </span>
                </NavLink>

                <NavLink
                  className={navLinkClass}
                  to="/coach"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={15} className="text-amber-400" />
                    AI Career Coach
                  </span>
                </NavLink>

                <NavLink
                  className={navLinkClass}
                  to="/interview/company"
                >
                  <span className="flex items-center gap-1.5">
                    <Building2 size={15} className="text-amber-400" />
                    Company
                  </span>
                </NavLink>

                <NavLink
                  className={navLinkClass}
                  to="/payments"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard size={15} />
                    Payments
                  </span>
                </NavLink>

                <NavLink
                  to="/interview/new"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-sm"
                >
                  <PlusCircle size={15} />
                  New Interview
                </NavLink>

                <button
                 onClick={handleLogout}
                 className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
            </div>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className={navLinkClass}
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
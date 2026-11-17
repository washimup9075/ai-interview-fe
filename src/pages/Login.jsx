import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : "Login Failed");
      toast.error(errorMsg);
      console.error(error.response?.data);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <p className="text-indigo-400 font-medium">
          Welcome Back
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Login
        </h2>

        <p className="mt-2 text-slate-400">
          Continue your interview preparation journey.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >

          {/* Email */}

          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoggingIn ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Create Account
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}
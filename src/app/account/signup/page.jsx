import { useState } from "react";
import useAuth from "@/utils/useAuth";

function SignupPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/admin",
        redirect: true,
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-[#121212] border border-[#00ffff]/30 p-8 shadow-[0_0_20px_rgba(0,255,255,0.1)]"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-white tracking-tighter">
          NEW{" "}
          <span className="text-[#00ffff] drop-shadow-[0_0_8px_#00ffff]">
            ADMIN
          </span>
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff00ff] focus:ring-1 focus:ring-[#ff00ff] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff00ff] focus:ring-1 focus:ring-[#ff00ff] outline-none transition-all"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#00ffff] px-4 py-3 text-base font-bold text-black transition-all hover:bg-[#00d0d0] hover:shadow-[0_0_15px_#00ffff] disabled:opacity-50"
          >
            {loading ? "CREATING..." : "REGISTER ACCOUNT"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;

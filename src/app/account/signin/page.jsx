import { useState } from "react";
import useAuth from "@/utils/useAuth";

function SigninPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/admin",
        redirect: true,
      });
    } catch (err) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-[#121212] border border-[#ff00ff]/30 p-8 shadow-[0_0_20px_rgba(255,0,255,0.1)]"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-white tracking-tighter">
          ADMIN{" "}
          <span className="text-[#ff00ff] drop-shadow-[0_0_8px_#ff00ff]">
            ACCESS
          </span>
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lucky.dev"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] outline-none transition-all"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff00ff] px-4 py-3 text-base font-bold text-white transition-all hover:bg-[#d000d0] hover:shadow-[0_0_15px_#ff00ff] disabled:opacity-50"
          >
            {loading ? "AUTHORIZING..." : "ENTER DASHBOARD"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Secure admin login for Lucky Philip's Portfolio
          </p>
        </div>
      </form>
    </div>
  );
}

export default SigninPage;

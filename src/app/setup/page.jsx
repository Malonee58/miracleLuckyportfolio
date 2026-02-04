import { useState } from "react";

export default function SetupPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupAdmin = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "luckyphilip59@gmail.com",
          password: "Obanokho59",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: data.message });
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Failed to setup admin" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#121212] border border-[#a855f7]/30 p-8 shadow-[0_0_20px_rgba(168,85,247,0.1)] text-center">
        <h1 className="mb-6 text-3xl font-bold text-white tracking-tighter">
          ADMIN{" "}
          <span className="text-[#a855f7] drop-shadow-[0_0_8px_#a855f7]">
            SETUP
          </span>
        </h1>

        <p className="text-gray-400 mb-8">
          Click below to initialize your admin account
        </p>

        <button
          onClick={setupAdmin}
          disabled={loading || status?.type === "success"}
          className="w-full rounded-lg bg-[#a855f7] px-4 py-3 text-base font-bold text-white transition-all hover:bg-[#9333ea] hover:shadow-[0_0_15px_#a855f7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "SETTING UP..."
            : status?.type === "success"
              ? "SETUP COMPLETE ✓"
              : "SETUP ADMIN"}
        </button>

        {status && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        {status?.type === "success" && (
          <div className="mt-6 space-y-3">
            <a
              href="/account/signin"
              className="block w-full rounded-lg bg-[#00ffff] px-4 py-3 text-base font-bold text-black transition-all hover:bg-[#00d0d0]"
            >
              GO TO SIGN IN
            </a>
            <a
              href="/admin"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              or go to Admin Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

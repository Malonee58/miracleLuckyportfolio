import useAuth from "@/utils/useAuth";
import { useEffect } from "react";

function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#ff00ff] border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_10px_#ff00ff]"></div>
        <p className="text-[#ff00ff] font-bold">LOGGING OUT...</p>
      </div>
    </div>
  );
}

export default LogoutPage;

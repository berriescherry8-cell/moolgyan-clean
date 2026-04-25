"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_EMAILS = [
    "sharmadevendra715@gmail.com",
    "kpdeora1986@gmail.com",
    "berriescherry8@gmail.com",
  ];

  // Simple hash function for fallback mode
  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email is in admin list
    if (!ADMIN_EMAILS.includes(email)) {
      setError("Invalid admin email");
      setLoading(false);
      return;
    }

    // Try Supabase auth first
    const supabase = createClient();

    if (supabase) {
      // Supabase is available - use real auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Login failed");
        setLoading(false);
        return;
      }

      // Store admin session in localStorage for the layout guard
      localStorage.setItem("moolgyan_admin", email);
      localStorage.setItem("moolgyan_admin_session", Date.now().toString());

      router.push("/admin/dashboard");
    } else {
      // Supabase NOT available (static export without env vars)
      // Use fallback local auth with hardcoded credentials
      const hashedInput = simpleHash(password);
      const expectedHash = simpleHash("admin123"); // Default fallback password

      // In fallback mode, accept "admin123" as password
      if (password !== "admin123") {
        setError("Invalid password (fallback mode: use 'admin123')");
        setLoading(false);
        return;
      }

      // Store fallback auth in localStorage
      localStorage.setItem("moolgyan_admin", email);
      localStorage.setItem("moolgyan_admin_session", Date.now().toString());
      localStorage.setItem("moolgyan_fallback_auth", "true");

      router.push("/admin/dashboard");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ color: "white", marginBottom: 20 }}>Admin Login</h2>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 6, border: "1px solid #444", background: "#1a1a1a", color: "white" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 6, border: "1px solid #444", background: "#1a1a1a", color: "white" }}
        />

        <button
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "#ef4444", marginTop: 12, fontSize: 14 }}>
          {error}
        </p>
      )}

      <p style={{ color: "#888", marginTop: 20, fontSize: 12 }}>
        Fallback mode password: <code style={{ color: "#ccc" }}>admin123</code>
      </p>
    </div>
  );
}


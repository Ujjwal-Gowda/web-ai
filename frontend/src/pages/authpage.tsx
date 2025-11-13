import { useState } from "react";
function AuthPage() {
  const [showAuth, setShowAuth] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const API_URL = "http://localhost:5000";

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleAuth = async () => {
    try {
      const endpoint = showAuth === "signin" ? "/auth/signin" : "/auth/signup";
      const body =
        showAuth === "signin"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setAuthForm({ name: "", email: "", password: "" });
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      alert("Network error");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          AI Platform
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your all-in-one AI toolkit
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowAuth("signin")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${showAuth === "signin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setShowAuth("signup")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${showAuth === "signup"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {showAuth === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
              onKeyPress={(e) => handleKeyPress(e, handleAuth)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            onKeyPress={(e) => handleKeyPress(e, handleAuth)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            onKeyPress={(e) => handleKeyPress(e, handleAuth)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {showAuth === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthPage from "./pages/authpage";
function App() {
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />}></Route>
    </Routes>
  </BrowserRouter>;
  const [activeTab, setActiveTab] = useState<"chat" | "image" | "speech">(
    "chat",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState<"signin" | "signup">("signin");

  // Auth states
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Chat states
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Image states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Speech states
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<{
    text: string;
    language: string;
  } | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const URL = "https://web-ai-395a.onrender.com";
  let API_URL = "";
  if (!URL) {
    API_URL = "http://localhost:5000";
  } else {
    API_URL = "";
  }
  const token = localStorage.getItem("token");

  // Auth handlers
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
        setIsAuthenticated(true);
        setAuthForm({ name: "", email: "", password: "" });
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setChatHistory([]);
  };

  // Chat handler
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", content: data.response },
        ]);
      } else {
        alert(data.error || "Failed to get response");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // Image handler
  const handleImageUpload = async () => {
    if (!selectedImage || imageLoading) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch(`${API_URL}/ai/rmbg`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProcessedImage(data.image);
      } else {
        alert(data.error || "Failed to process image");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setImageLoading(false);
    }
  };

  // Speech handler
  const handleAudioUpload = async () => {
    if (!selectedAudio || audioLoading) return;

    setAudioLoading(true);
    const formData = new FormData();
    formData.append("file", selectedAudio);

    try {
      const response = await fetch(`${API_URL}/ai/text`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranscription({ text: data.text, language: data.language });
      } else {
        alert(data.error || "Failed to transcribe audio");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setAudioLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  if (!isAuthenticated) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Platform
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            💬 Chat AI
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "image"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            🖼️ Remove Background
          </button>
          <button
            onClick={() => setActiveTab("speech")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "speech"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            🎤 Speech to Text
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Start a conversation with AI...</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                        }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Background Remover
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setSelectedImage(e.target.files?.[0] || null);
                    setProcessedImage(null);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <p className="text-lg font-medium">Click to upload image</p>
                    <p className="text-sm mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
                {selectedImage && (
                  <p className="mt-4 text-sm text-indigo-600 font-medium">
                    {selectedImage.name}
                  </p>
                )}
              </div>

              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={imageLoading}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
                >
                  {imageLoading ? "Processing..." : "Remove Background"}
                </button>
              )}

              {processedImage && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Result:
                  </h3>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full rounded-lg border border-gray-200"
                  />
                  <a
                    href={processedImage}
                    download="no-background.png"
                    className="block w-full py-3 bg-green-600 text-white text-center rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Speech Tab */}
        {activeTab === "speech" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Speech to Text
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    setSelectedAudio(e.target.files?.[0] || null);
                    setTranscription(null);
                  }}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <p className="text-lg font-medium">Click to upload audio</p>
                    <p className="text-sm mt-2">MP3, WAV, M4A up to 25MB</p>
                  </div>
                </label>
                {selectedAudio && (
                  <p className="mt-4 text-sm text-indigo-600 font-medium">
                    {selectedAudio.name}
                  </p>
                )}
              </div>

              {selectedAudio && (
                <button
                  onClick={handleAudioUpload}
                  disabled={audioLoading}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
                >
                  {audioLoading ? "Transcribing..." : "Transcribe Audio"}
                </button>
              )}

              {transcription && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Language:{" "}
                      <span className="font-medium text-gray-800">
                        {transcription.language}
                      </span>
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {transcription.text}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(transcription.text)
                    }
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

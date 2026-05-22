"use client";


import { useEffect, useState } from "react";
import {
  detectQueryType,
  getStatusColor,
} from "@/lib/utils";
import TrainRoute from "@/components/train/TrainRoute";
import TrainMetrics from "@/components/train/TrainMetrics";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import {
  saveSearch,
  getRecentSearches,
} from "@/lib/supabase";
import RecentSearches from "@/components/train/RecentSearches";
import AIInsights from "@/components/ai/AIInsights";
import ChatMessages from "@/components/ai/ChatMessages";
import TypingIndicator from "@/components/ai/TypingIndicator";
import dynamic from "next/dynamic";

const TrainMap = dynamic(
  () => import("../train/TrainMap"),
  {
    ssr: false,
  }
);

export default function SearchBox() {

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [type, setType] = useState("");
  

  useEffect(() => {
  loadRecent();
}, []);

async function loadRecent() {
  const data = await getRecentSearches();

  setRecent(data);
}

function startVoiceSearch() {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";

  recognition.start();

  recognition.onresult = (event: any) => {
    const transcript =
      event.results[0][0].transcript;

    setQuery(transcript);
  };
}

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setTyping(true);

      setResult(null);

      const detectedType = detectQueryType(query);

      setType(detectedType);

      await saveSearch(query, detectedType);
      await loadRecent();

      const updatedMessages = [
  ...messages,
  {
    role: "user",
    content: query,
  },
];

setMessages(updatedMessages);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  message: query,
  type: detectedType,
  messages: updatedMessages,
}),
      });

      const data = await res.json();

      let parsed;

      try {
  parsed = JSON.parse(data.reply);

  if (!parsed) {
    parsed = {
      title: "Train Not Found",
      summary:
        "No train was found with that train number.",
      status: "NOT FOUND",
    };
  }
} catch {
  parsed = {
    title: "RailTrace AI",
    summary: data.reply,
  };
}

      setResult(parsed);

      setMessages([
  ...updatedMessages,
  {
    role: "assistant",
    content: parsed.summary || "",
  },
]);

    } catch (err) {
      console.error(err);
    } finally {
  setTyping(false);

  setLoading(false);
}
  }

  return (
    <section className="rt-search-section">
      <div className="rt-search-box">
        <input
          type="text"
          placeholder="12301 · NDLS · 4501234567 · Rajdhani..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
  className="rt-voice-btn"
  onClick={startVoiceSearch}
>
  🎤
</button>

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Thinking..." : "Search"}
        </button>
      </div>

      {type && (
        <div className="rt-query-type">
          Detected: {type.toUpperCase()}
        </div>
      )}

      {recent.length > 0 && !result && (
  <RecentSearches
    searches={recent}
    onSelect={(q) => {
      setQuery(q);
    }}
  />
)}

<ChatMessages messages={messages} />

{typing && <TypingIndicator />}

      {loading && <LoadingSkeleton />}

      {result && (
  <>
    <div className="rt-train-card">
      <div className="rt-train-top">
        <div>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
        </div>

        <div
  className={`rt-status-pill ${getStatusColor(
    result.status || ""
  )}`}
>
          {result.status || "LIVE"}
        </div>
      </div>

      <AIInsights
  summary={result.summary}
/>

      {result.details && (
        <div className="rt-grid">
          <div className="rt-item">
            <span>Train Number</span>
            <strong>{result.details.trainNumber}</strong>
          </div>

          <div className="rt-item">
            <span>Train Name</span>
            <strong>{result.details.trainName}</strong>
          </div>

          <div className="rt-item">
            <span>Source</span>
            <strong>{result.details.source}</strong>
          </div>

          <div className="rt-item">
            <span>Destination</span>
            <strong>{result.details.destination}</strong>
          </div>

          <div className="rt-item">
            <span>Journey Duration</span>
            <strong>{result.details.duration}</strong>
          </div>
        </div>
      )}
    </div>

    <TrainMetrics
    
  status={result?.status}
  delay={result?.delay}
  occupancy={result?.details?.occupancy}
  insights={result?.insights}
/>

   <TrainRoute route={result.route} />

<TrainMap route={result.route} />

</>
)}
    </section>
  );
}
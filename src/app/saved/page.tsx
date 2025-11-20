"use client";

import { useEffect, useState } from "react";

export default function SavedAnalysesPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 🔹 Fetch analyses for the logged-in user
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const token = localStorage.getItem("idToken"); // stored after Cognito login
        if (!token) {
          setError("You must be logged in to view saved analyses.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/get-analyses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setAnalyses(data.items);
        } else {
          setError(data.error || "Failed to fetch analyses");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  // 🔹 Delete analysis
  async function deleteAnalysis(id: string) {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.ok) {
        setAnalyses((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Error deleting analysis: " + data.error);
      }
    } catch {
      alert("Error deleting analysis");
    }
  }

  return (
    <main>
      <h1>Saved Resume Analyses</h1>

      {loading && <p>Loading saved analyses...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && analyses.length === 0 && (
        <p className="muted">No saved analyses found.</p>
      )}

      <div className="saved-list">
        {analyses.map((item) => {
          const expanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`saved-item ${expanded ? "expanded" : ""}`}
            >
              <div
                className="saved-header"
                onClick={() => setExpandedId(expanded ? null : item.id)}
              >
                <div>
                  <h2>Match Score: {item.match_score}/100</h2>
                  <p className="timestamp">
                    Saved on:{" "}
                    {new Date(
                      item.timestamp || item.timeStamp
                    ).toLocaleString()}
                  </p>
                </div>
                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAnalysis(item.id);
                  }}
                >
                  🗑️
                </button>
              </div>

              {expanded && (
                <div className="expanded-content">
                  <p>
                    <strong>Feedback:</strong> {item.feedback}
                  </p>
                  <p>
                    <strong>Missing Keywords:</strong>{" "}
                    {item.missing_keywords?.join(", ") || "None"}
                  </p>
                  {item.resume_text && (
                    <>
                      <h3>Extracted Resume</h3>
                      <pre className="text-box">{item.resume_text}</pre>
                    </>
                  )}
                  {item.job_description && (
                    <>
                      <h3>Job Description</h3>
                      <pre className="text-box">{item.job_description}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <a href="/dashboard" className="back-button">
        ← Back to Resume Checker
      </a>
    </main>
  );
}

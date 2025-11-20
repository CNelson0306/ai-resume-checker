"use client";

import { useState, useEffect } from "react";
import UploadBox from "../../../components/UploadBox";
import ProgressBar from "../../../components/ProgressBar";

export default function DashboardPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoggedIn(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");

    window.location.href =
      `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
      `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
      `&logout_uri=${process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI}`;
  }

  async function analyzeResume() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) return setError(data.error);
    setAnalysis(data);
  }

  async function rewriteResume() {
    setRewriting(true);

    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    const data = await res.json();
    setRewriting(false);

    setAnalysis((prev: any) => ({ ...prev, rewritten: data.rewritten }));
  }

  if (!loggedIn) return null;

  return (
    <main>
      {/* HEADER */}
      <header className="page-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="secondary">
          🔒 Logout
        </button>
      </header>

      {/* SAVED ANALYSES LINK */}
      <div className="full-width-btn">
        <a href="/saved">
          <button className="primary full">📂 View Saved Analyses</button>
        </a>
      </div>

      {/* UPLOAD RESUME */}
      <section className="card">
        <h2>Upload Resume</h2>
        <p className="muted">
          Upload a PDF or text file to extract your resume.
        </p>
        <UploadBox onTextReady={setResumeText} />
      </section>

      {/* RESUME & JD */}
      {resumeText && (
        <>
          {/* Extracted Resume */}
          <section className="card">
            <h2>Extracted Resume Text</h2>
            <textarea rows={8} value={resumeText} readOnly />
          </section>

          {/* Job Description */}
          <section className="card">
            <h2>Job Description</h2>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            {error && <p className="error-text">⚠️ {error}</p>}

            <button
              className="primary full mt-md"
              onClick={analyzeResume}
              disabled={loading || !jobDescription}
            >
              {loading ? "Analysing..." : "🚀 Analyse Resume"}
            </button>

            {loading && (
              <div className="mt-md">
                <ProgressBar
                  value={100}
                  label="AI Scanning Resume..."
                  isLoading
                />
              </div>
            )}
          </section>
        </>
      )}

      {/* RESULTS */}
      {analysis && (
        <section className="card">
          <h2>Analysis Results</h2>

          <ProgressBar value={analysis.match_score} label="Match Score" />

          <p>
            <strong>Missing Keywords:</strong>{" "}
            {analysis.missing_keywords.join(", ")}
          </p>

          <button
            className="primary full mt-md"
            onClick={rewriteResume}
            disabled={rewriting}
          >
            {rewriting ? "Rewriting..." : "✨ Rewrite My Resume"}
          </button>

          <button
            className="secondary full mt-sm"
            onClick={async () => {
              const token = localStorage.getItem("idToken");
              await fetch("/api/save-analysis", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  resumeText,
                  jobDescription,
                  ...analysis,
                }),
              });
              alert("Saved!");
            }}
          >
            💾 Save Analysis
          </button>

          {analysis.rewritten && (
            <section className="card mt-lg">
              <h3>Rewritten Resume</h3>
              <textarea rows={10} value={analysis.rewritten} readOnly />
            </section>
          )}
        </section>
      )}
    </main>
  );
}

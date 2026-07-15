import { useEffect, useRef, useState } from "react";
import axios from "axios";
import QRCode from "qrcode";

// ════════════════════════════════════════════════════════════════════
// TV VITRINA — xonadagi Android TV/Smart TV uchun to'liq ekran sahifa.
// URL: /tv  (APK WebView shu manzilni ochadi; brauzerda ham ishlaydi)
//
// Holatlar:
//   1) unpaired — katta 6 xonali kod ko'rsatiladi, admin panelda kiritadi
//   2) active   — vitrina: brending, xizmatlar, xona QR kodi
//   3) locked   — obuna tugagan: qulf ekrani
//   4) revoked  — qurilma uzilgan: yana aktivatsiya
//
// MUHIM: alohida axios (hsApi EMAS) — undagi 401-interceptor login sahifaga
// redirect qiladi, TV esa 401'da shunchaki aktivatsiyaga qaytishi kerak.
// ════════════════════════════════════════════════════════════════════

const API_URL = import.meta.env.VITE_API_URL || "/api";
const tvApi = axios.create({ baseURL: `${API_URL}/hotel-service/tv`, timeout: 15000 });

const LS = {
  token: "tv_token",
  deviceId: "tv_device_id",
  deviceKey: "tv_device_key",
};

export default function TvPage() {
  const [mode, setMode] = useState("boot"); // boot | pairing | active | locked | error
  const [pairCode, setPairCode] = useState("");
  const [content, setContent] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [clock, setClock] = useState(new Date());
  const pollRef = useRef(null);
  const contentRef = useRef(null);

  // ── Soat ──
  useEffect(() => {
    const iv = setInterval(() => setClock(new Date()), 30_000);
    return () => clearInterval(iv);
  }, []);

  // ── Boshlanish: token bormi? ──
  useEffect(() => {
    const token = localStorage.getItem(LS.token);
    if (token) startContentLoop(token);
    else startPairing();
    return () => {
      clearInterval(pollRef.current);
      clearInterval(contentRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 1) Aktivatsiya oqimi ──
  async function startPairing() {
    setMode("pairing");
    try {
      let deviceId = localStorage.getItem(LS.deviceId);
      let deviceKey = localStorage.getItem(LS.deviceKey);

      if (!deviceId || !deviceKey) {
        const { data } = await tvApi.post("/register");
        deviceId = data.device_id;
        deviceKey = data.device_key;
        localStorage.setItem(LS.deviceId, deviceId);
        localStorage.setItem(LS.deviceKey, deviceKey);
        setPairCode(data.pair_code);
      }

      clearInterval(pollRef.current);
      const poll = async () => {
        try {
          const { data } = await tvApi.get(`/status/${deviceId}`, { params: { key: deviceKey } });
          if (data.status === "active" && data.token) {
            clearInterval(pollRef.current);
            localStorage.setItem(LS.token, data.token);
            localStorage.removeItem(LS.deviceId);
            localStorage.removeItem(LS.deviceKey);
            startContentLoop(data.token);
          } else if (data.status === "unpaired") {
            setPairCode(data.pair_code || "");
          } else if (data.status === "revoked") {
            localStorage.removeItem(LS.deviceId);
            localStorage.removeItem(LS.deviceKey);
            startPairing();
          }
        } catch (err) {
          // Qurilma bazadan o'chirilgan bo'lsa — yangidan ro'yxatdan o'tamiz
          if (err.response?.status === 404) {
            localStorage.removeItem(LS.deviceId);
            localStorage.removeItem(LS.deviceKey);
            clearInterval(pollRef.current);
            startPairing();
          }
        }
      };
      poll();
      pollRef.current = setInterval(poll, 5000);
    } catch {
      setMode("error");
      setTimeout(startPairing, 10_000);
    }
  }

  // ── 2) Kontent oqimi (har 60 soniyada — heartbeat ham shu) ──
  function startContentLoop(token) {
    clearInterval(contentRef.current);
    const fetchContent = async () => {
      try {
        const { data } = await tvApi.get("/content", { headers: { "X-TV-Token": token } });
        if (data.locked) {
          setContent(data);
          setMode("locked");
          return;
        }
        setContent(data);
        setMode("active");
      } catch (err) {
        if (err.response?.status === 401) {
          // Uzilgan/bekor qilingan — aktivatsiyaga qaytamiz
          localStorage.removeItem(LS.token);
          clearInterval(contentRef.current);
          startPairing();
        }
        // Tarmoq xatosi bo'lsa — oxirgi kontent ko'rsatilib turadi
      }
    };
    fetchContent();
    contentRef.current = setInterval(fetchContent, 60_000);
  }

  // ── QR: mehmon sahifasi (shu frontend originida) ──
  useEffect(() => {
    if (mode !== "active" || !content?.hotel_id) return;
    const url =
      `${window.location.origin}/hotel-service/g` +
      `?h=${encodeURIComponent(content.hotel_id)}` +
      (content.room_number ? `&room=${encodeURIComponent(content.room_number)}` : "");
    QRCode.toDataURL(url, { width: 480, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [mode, content?.hotel_id, content?.room_number]);

  // ── Render ──
  const brand = content?.branding || {};
  const primary = brand.primary_color || "#2563eb";

  if (mode === "boot") return <TvShell primary={primary}><div className="tv-spin" /></TvShell>;

  if (mode === "pairing" || mode === "error") {
    return (
      <TvShell primary={primary}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📺</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10 }}>Qurilmani ulash</h1>
          <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 36, lineHeight: 1.5 }}>
            Panel → <b>TV qurilmalar</b> bo'limiga kirib, quyidagi kodni kiriting
          </p>
          {mode === "error" ? (
            <p style={{ fontSize: 22, color: "#f87171" }}>Serverga ulanib bo'lmadi — qayta urinilmoqda...</p>
          ) : (
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              {(pairCode || "······").split("").map((ch, i) => (
                <div key={i} style={{
                  width: 84, height: 104, borderRadius: 18,
                  background: "rgba(255,255,255,0.08)",
                  border: "2px solid rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, fontWeight: 800, fontFamily: "monospace",
                }}>
                  {ch}
                </div>
              ))}
            </div>
          )}
          <p style={{ marginTop: 40, fontSize: 15, opacity: 0.4 }}>TheHotelSaaS · Hotel TV</p>
        </div>
      </TvShell>
    );
  }

  if (mode === "locked") {
    return (
      <TvShell primary="#334155">
        <div style={{ textAlign: "center", maxWidth: 720 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>
            {content?.hotel_name || "Mehmonxona"}
          </h1>
          <p style={{ fontSize: 22, opacity: 0.75, lineHeight: 1.6 }}>
            Xizmat vaqtincha faol emas — obuna muddati tugagan.<br />
            Iltimos, administratsiyaga murojaat qiling.
          </p>
          <p style={{ marginTop: 40, fontSize: 15, opacity: 0.4 }}>TheHotelSaaS</p>
        </div>
      </TvShell>
    );
  }

  // ── ACTIVE: vitrina ──
  const services = content?.services || [];
  return (
    <TvShell primary={primary} align="stretch">
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 48px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {brand.logo_url ? (
            <img src={brand.logo_url} alt="" style={{ height: 56, objectFit: "contain" }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 800, color: "#fff",
            }}>
              {(content?.hotel_name || "H").charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{content?.hotel_name}</h1>
            {brand.welcome_text && (
              <p style={{ fontSize: 16, opacity: 0.6, marginTop: 3 }}>{brand.welcome_text}</p>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {clock.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </div>
          {content?.room_number && (
            <div style={{ fontSize: 16, opacity: 0.6 }}>Room {content.room_number}</div>
          )}
        </div>
      </div>

      {/* Body: xizmatlar + QR */}
      <div style={{
        flex: 1, display: "flex", gap: 40, padding: "36px 48px 28px", alignItems: "stretch",
      }}>
        {/* Xizmatlar grid */}
        <div style={{ flex: 1.5 }}>
          <p style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            opacity: 0.5, marginBottom: 18,
          }}>
            Xizmatlar · Services · Услуги
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}>
            {services.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: "22px 20px",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <span style={{ fontSize: 38 }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.2 }}>{s.name}</p>
                  {s.items_count > 0 && (
                    <p style={{ fontSize: 13, opacity: 0.55, marginTop: 3 }}>
                      {s.items_count} ta tanlov
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR panel */}
        <div style={{
          width: 380, borderRadius: 28, background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.12)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: 32, gap: 20,
        }}>
          <p style={{ fontSize: 21, fontWeight: 800, textAlign: "center", lineHeight: 1.35 }}>
            📱 Xizmat buyurtma qilish uchun skanerlang
          </p>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR" style={{
              width: 260, height: 260, borderRadius: 20, background: "#fff", padding: 10,
            }} />
          )}
          <p style={{ fontSize: 14, opacity: 0.55, textAlign: "center" }}>
            Scan to order room service · Отсканируйте для заказа
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "0 48px 20px", display: "flex", justifyContent: "space-between",
        fontSize: 13, opacity: 0.35,
      }}>
        <span>{content?.device_name}</span>
        <span>Powered by TheHotelSaaS</span>
      </div>
    </TvShell>
  );
}

// To'liq ekran qobiq — brend rangidan gradient fon
function TvShell({ primary = "#2563eb", align = "center", children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden",
      background: `radial-gradient(1200px 700px at 85% -10%, ${primary}33, transparent 60%),
                   radial-gradient(900px 600px at -10% 110%, ${primary}22, transparent 55%),
                   #0b1220`,
      color: "#f1f5f9",
      display: "flex", flexDirection: "column",
      alignItems: align === "center" ? "center" : "stretch",
      justifyContent: align === "center" ? "center" : "flex-start",
      fontFamily: "'Inter', system-ui, sans-serif",
      cursor: "none",
    }}>
      {children}
      <style>{`
        .tv-spin {
          width: 44px; height: 44px; border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #fff;
          animation: tvspin 0.9s linear infinite;
        }
        @keyframes tvspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

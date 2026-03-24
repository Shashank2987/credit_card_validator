import { useState } from "react";
import binDatabase from "./binData";
 
const cardTypeIcons = {
  Visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  Mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  "American Express": "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
  Discover: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Discover_Card_logo.svg",
};
 
function App() {
  const [card, setCard] = useState("");
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
 
  const luhnCheck = (num) => {
    let sum = 0;
    let doubleDigit = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (doubleDigit) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
  };
 
  const getCardType = (num) => {
    if (num.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(num)) return "Mastercard";
    if (/^3[47]/.test(num)) return "American Express";
    if (num.startsWith("6")) return "Discover";
    return "Unknown";
  };
 
  const getBankInfo = (num) => {
    const prefix = num.substring(0, 6);
    for (let entry of binDatabase) {
      if (entry.bin === prefix) return entry;
    }
    return { bank: "Unknown", country: "Unknown", flag: "un", domain: "example.com" };
  };
 
  const maskCard = (num) => {
    const padded = num.padEnd(16, "0").slice(0, 16);
    const groups = [];
    for (let i = 0; i < 16; i += 4) {
      groups.push(i < 12 ? "••••" : padded.slice(i, i + 4));
    }
    return groups;
  };
 
  const formatInput = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };
 
  const handleValidate = () => {
    const clean = card.replace(/\D/g, "");
    if (clean.length === 0) { setResult(null); return; }
    setAnimating(true);
    setTimeout(() => {
      if (luhnCheck(clean)) {
        const type = getCardType(clean);
        const info = getBankInfo(clean);
        setResult({
          valid: true,
          groups: maskCard(clean),
          type,
          bank: info.bank,
          country: info.country,
          flag: info.flag,
          domain: info.domain,
        });
      } else {
        setResult({ valid: false });
      }
      setAnimating(false);
    }, 600);
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; min-height: 100vh; font-family: 'Sora', sans-serif; }
 
        .bg { position: fixed; inset: 0; overflow: hidden; z-index: 0; }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
        .orb1 { width: 600px; height: 600px; background: #6366f1; top: -200px; left: -200px; animation: drift 12s ease-in-out infinite alternate; }
        .orb2 { width: 500px; height: 500px; background: #8b5cf6; bottom: -150px; right: -150px; animation: drift 15s ease-in-out infinite alternate-reverse; }
        .orb3 { width: 300px; height: 300px; background: #06b6d4; top: 40%; left: 60%; animation: drift 10s ease-in-out infinite alternate; }
        @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,40px) scale(1.1); } }
 
        .page { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .wrapper { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 20px; }
 
        .header { text-align: center; }
        .header-label { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #6366f1; margin-bottom: 8px; }
        .header-title { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .header-title span { color: #818cf8; }
 
        .card-visual {
          border-radius: 20px; padding: 28px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative; overflow: hidden; min-height: 190px;
          transition: background 0.5s;
        }
        .card-visual.invalid-card { background: linear-gradient(135deg, #2d0a0a 0%, #1a0505 100%) !important; }
        .card-visual::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .card-visual::after { content: ''; position: absolute; bottom: -80px; left: -40px; width: 250px; height: 250px; border-radius: 50%; background: rgba(255,255,255,0.03); }
 
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .chip { width: 42px; height: 32px; background: linear-gradient(135deg, #d4a843, #f0c060, #c9963c); border-radius: 6px; position: relative; overflow: hidden; }
        .chip::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 7px), repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 7px); }
        .network-logo { height: 28px; width: auto; filter: brightness(0) invert(1); opacity: 0.85; }
        .network-placeholder { width: 48px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
 
        .card-number { display: flex; gap: 16px; margin-bottom: 24px; }
        .card-group { font-family: 'Space Mono', monospace; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); letter-spacing: 2px; }
 
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .card-value { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); font-family: 'Space Mono', monospace; }
        .bank-logo { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.9); padding: 4px; object-fit: contain; }
 
        .panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; backdrop-filter: blur(20px); }
 
        .input-wrap { position: relative; margin-bottom: 14px; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; opacity: 0.4; }
        .card-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px 14px 44px; color: #fff; font-family: 'Space Mono', monospace; font-size: 15px; letter-spacing: 2px; outline: none; transition: border-color 0.2s, background 0.2s; }
        .card-input::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 1px; font-family: 'Sora', sans-serif; font-size: 13px; }
        .card-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.08); }
 
        .validate-btn { width: 100%; padding: 15px; border-radius: 12px; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .validate-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 12px 30px rgba(99,102,241,0.45); }
        .validate-btn:active { transform: translateY(0); }
        .validate-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
 
        .result-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 20px; backdrop-filter: blur(20px); animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
 
        .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; margin-bottom: 16px; }
        .badge-valid { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
        .badge-invalid { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; margin-bottom: 8px; }
 
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px 14px; }
        .info-item.full { grid-column: 1 / -1; }
        .info-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 5px; }
        .info-value { font-size: 14px; font-weight: 600; color: #e2e8f0; display: flex; align-items: center; gap: 7px; }
        .mono { font-family: 'Space Mono', monospace; font-size: 13px; }
        .flag-img { border-radius: 2px; }
 
        .invalid-msg { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; }
 
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
 
      <div className="bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>
 
      <div className="page">
        <div className="wrapper">
 
          <div className="header">
            <div className="header-label">Secure Tool</div>
            <h1 className="header-title">Card <span>Validator</span></h1>
          </div>
 
          <div className={`card-visual ${result && !result.valid ? "invalid-card" : ""}`}>
            <div className="card-top">
              <div className="chip" />
              {result?.valid && cardTypeIcons[result.type]
                ? <img src={cardTypeIcons[result.type]} alt={result.type} className="network-logo" />
                : <div className="network-placeholder" />
              }
            </div>
            <div className="card-number">
              {(result?.valid ? result.groups : ["••••", "••••", "••••", "••••"]).map((g, i) => (
                <span key={i} className="card-group">{g}</span>
              ))}
            </div>
            <div className="card-bottom">
              <div>
                <div className="card-label">Bank</div>
                <div className="card-value">{result?.valid ? result.bank : "— — — —"}</div>
              </div>
              <div>
                <div className="card-label">Network</div>
                <div className="card-value">{result?.valid ? result.type : "Unknown"}</div>
              </div>
              {result?.valid && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=64`}
                  alt="bank logo"
                  className="bank-logo"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>
 
          <div className="panel">
            <div className="input-wrap">
              <span className="input-icon">💳</span>
              <input
                className="card-input"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={card}
                onChange={(e) => setCard(formatInput(e.target.value))}
                maxLength={19}
              />
            </div>
            <button className="validate-btn" onClick={handleValidate} disabled={animating}>
              {animating ? <><span className="spinner" />Validating...</> : "Validate Card"}
            </button>
          </div>
 
          {result && !animating && (
            <div className="result-panel">
              {result.valid ? (
                <>
                  <div className="badge badge-valid">✓ Valid Card</div>
                  <div className="info-grid">
                    <div className="info-item full">
                      <div className="info-label">Masked Number</div>
                      <div className="info-value mono">{result.groups.join("  ")}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Network</div>
                      <div className="info-value">{result.type}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Bank</div>
                      <div className="info-value">{result.bank}</div>
                    </div>
                    <div className="info-item full">
                      <div className="info-label">Country</div>
                      <div className="info-value">
                        <img src={`https://flagcdn.com/24x18/${result.flag}.png`} alt={result.country} className="flag-img" />
                        {result.country}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="badge badge-invalid">✕ Invalid Card</div>
                  <p className="invalid-msg">This number failed the Luhn check. Please verify and try again.</p>
                </>
              )}
            </div>
          )}
 
        </div>
      </div>
    </>
  );
}
 
export default App;
import { useState, useEffect } from "react";
import binDatabase from "./binData";

const CARD_ICONS = {
  Visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  Mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  "American Express": "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
  Discover: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Discover_Card_logo.svg",
};

function App() {
  const [card, setCard] = useState("");
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const luhnCheck = (num) => {
    let sum = 0, dd = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let d = parseInt(num[i]);
      if (dd) { d *= 2; if (d > 9) d -= 9; }
      sum += d; dd = !dd;
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
    for (let e of binDatabase) if (e.bin === prefix) return e;
    return { bank: "Unknown", country: "Unknown", flag: "un", domain: "example.com" };
  };

  const maskGroups = (num) => {
    const p = num.padEnd(16, "0").slice(0, 16);
    return [p.slice(0,4), "••••", "••••", p.slice(12,16)];
  };

  const formatInput = (val) => {
    const c = val.replace(/\D/g, "").slice(0, 16);
    return c.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleValidate = () => {
    const clean = card.replace(/\D/g, "");
    if (!clean.length) { setResult(null); setFlipped(false); return; }
    setScanning(true);
    setFlipped(false);
    setTimeout(() => {
      if (luhnCheck(clean)) {
        const type = getCardType(clean);
        const info = getBankInfo(clean);
        setResult({ valid: true, groups: maskGroups(clean), type, ...info });
        setTimeout(() => setFlipped(true), 200);
      } else {
        setResult({ valid: false });
      }
      setScanning(false);
    }, 900);
  };

  const displayGroups = result?.valid ? result.groups : ["????", "????", "????", "????"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dim: rgba(201,168,76,0.15);
          --green-accent: #2ecc71;
          --red-accent: #e74c3c;
          --text: #f0ede6;
          --text-dim: rgba(240,237,230,0.45);
          --border: rgba(201,168,76,0.2);
          --panel: rgba(255,255,255,0.03);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b1b13; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: var(--text); overflow-x: hidden; }

        .scene { position: fixed; inset: 0; z-index: 0; overflow: hidden;
          background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(46,204,113,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 80% at 80% 90%, rgba(201,168,76,0.07) 0%, transparent 60%), #0b1b13; }
        .scene-line { position: absolute; left: 0; right: 0; height: 1px; background: var(--border); opacity: 0.35; }
        .scene-line:nth-child(1){top:20%;} .scene-line:nth-child(2){top:50%;} .scene-line:nth-child(3){top:80%;}
        .scene-col { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--border); opacity: 0.2; }
        .scene-col:nth-child(4){left:20%;} .scene-col:nth-child(5){left:50%;} .scene-col:nth-child(6){left:80%;}
        .corner { position: absolute; width: 56px; height: 56px; border-color: var(--gold); border-style: solid; opacity: 0.25; }
        .corner-tl{top:20px;left:20px;border-width:1px 0 0 1px;} .corner-tr{top:20px;right:20px;border-width:1px 1px 0 0;}
        .corner-bl{bottom:20px;left:20px;border-width:0 0 1px 1px;} .corner-br{bottom:20px;right:20px;border-width:0 1px 1px 0;}

        .page { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
        .wrapper { width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 24px;
          opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .wrapper.visible { opacity: 1; transform: translateY(0); }

        .header { text-align: center; }
        .header-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
        .header-eyebrow::before, .header-eyebrow::after { content:''; display:block; width:28px; height:1px; background:var(--gold); opacity:0.4; }
        .header-title { font-family: 'DM Serif Display', serif; font-size: 36px; font-weight: 400; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; }
        .header-title em { font-style: italic; color: var(--gold-light); }
        .header-sub { font-size: 12px; color: var(--text-dim); margin-top: 7px; font-weight: 300; letter-spacing: 0.2px; }

        .card-scene { perspective: 1200px; height: 215px; }
        .card-flipper { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.75s cubic-bezier(0.4,0,0.2,1); }
        .card-flipper.is-flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 18px; padding: 22px 26px; border: 1px solid var(--border); overflow: hidden; }

        .card-front {
          background: linear-gradient(135deg, #0f2318 0%, #0a1a10 40%, #071510 100%);
          box-shadow: 0 32px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.12);
        }
        .card-front::before { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 30%,rgba(201,168,76,0.04) 50%,transparent 70%); border-radius:18px; }
        .card-back { background: linear-gradient(135deg, #112518 0%, #0d1e14 100%); box-shadow: 0 32px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(201,168,76,0.08); transform: rotateY(180deg); }

        .scan-line { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); top:0; opacity:0; }
        .scanning .scan-line { opacity:1; animation: scan 0.9s ease-in-out; }
        @keyframes scan { 0%{top:0%;opacity:1;} 100%{top:100%;opacity:0;} }

        .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; }
        .chip-wrap { display:flex; align-items:center; gap:9px; }
        .chip { width:38px; height:28px; background:linear-gradient(135deg,#b8922a,#e8c97a,#b8922a); border-radius:5px; position:relative; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.4); }
        .chip::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(90deg,transparent,transparent 5px,rgba(0,0,0,0.12) 5px,rgba(0,0,0,0.12) 6px),repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(0,0,0,0.12) 5px,rgba(0,0,0,0.12) 6px); }
        .nfc { color:var(--gold); opacity:0.55; font-size:17px; letter-spacing:-2px; }
        .network-logo-wrap { height:24px; display:flex; align-items:center; }
        .network-logo { height:100%; width:auto; filter:brightness(0) invert(1); opacity:0.65; }
        .network-empty { width:42px; height:24px; border-radius:4px; border:1px dashed rgba(201,168,76,0.18); }

        .card-number-row { display:flex; gap:16px; margin-bottom:18px; }
        .card-group { font-family:'DM Mono',monospace; font-size:18px; font-weight:500; color:rgba(240,237,230,0.88); letter-spacing:3px; }
        .card-group.dim { color:rgba(240,237,230,0.25); }

        .card-footer { display:flex; justify-content:space-between; align-items:flex-end; }
        .cf-label { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--text-dim); margin-bottom:3px; }
        .cf-value { font-family:'DM Mono',monospace; font-size:11px; color:var(--text); }
        .bank-favicon { width:30px; height:30px; border-radius:6px; background:rgba(255,255,255,0.9); padding:3px; object-fit:contain; }

        .magstripe { height:38px; background:#090909; margin:-6px -26px 14px; }
        .cvv-strip { background:rgba(255,255,255,0.06); border-radius:4px; padding:9px 13px; display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .cvv-text { font-size:10px; color:var(--text-dim); letter-spacing:1px; }
        .cvv-dots { font-family:'DM Mono',monospace; font-size:15px; letter-spacing:4px; color:var(--text); }

        .input-panel { background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:18px 20px; }
        .input-panel-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:11px; font-weight:500; }
        .input-row { display:flex; gap:10px; }
        .input-wrap { position:relative; flex:1; }
        .card-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.2); border-radius:10px; padding:12px 14px 12px 40px; color:var(--text); font-family:'DM Mono',monospace; font-size:14px; letter-spacing:2px; outline:none; transition:border-color 0.2s,background 0.2s,box-shadow 0.2s; }
        .card-input::placeholder { color:var(--text-dim); font-family:'DM Sans',sans-serif; letter-spacing:0.3px; font-size:13px; }
        .card-input:focus { border-color:var(--gold); background:var(--gold-dim); box-shadow:0 0 0 3px rgba(201,168,76,0.07); }
        .input-prefix { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--gold); opacity:0.45; font-size:14px; pointer-events:none; }

        .verify-btn { padding:12px 20px; border-radius:10px; border:1px solid var(--gold); background:linear-gradient(135deg,rgba(201,168,76,0.14),rgba(201,168,76,0.07)); color:var(--gold-light); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.8px; cursor:pointer; white-space:nowrap; transition:all 0.2s; display:flex; align-items:center; gap:7px; }
        .verify-btn:hover { background:linear-gradient(135deg,rgba(201,168,76,0.26),rgba(201,168,76,0.13)); box-shadow:0 0 20px rgba(201,168,76,0.18); transform:translateY(-1px); }
        .verify-btn:active { transform:translateY(0); }
        .verify-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

        .result-wrap { border-radius:14px; overflow:hidden; animation:revealUp 0.4s cubic-bezier(0.16,1,0.3,1); }
        @keyframes revealUp { from{opacity:0;transform:translateY(10px) scale(0.98);} to{opacity:1;transform:translateY(0) scale(1);} }

        .res-valid { border:1px solid rgba(46,204,113,0.22); background:rgba(46,204,113,0.03); }
        .res-invalid { border:1px solid rgba(231,76,60,0.22); background:rgba(231,76,60,0.03); padding:18px 20px; }

        .res-header { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; }
        .status-dot { width:7px; height:7px; border-radius:50%; background:var(--green-accent); box-shadow:0 0 7px var(--green-accent); animation:pulse 2s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.8);} }
        .status-label { font-size:10px; font-weight:600; letter-spacing:2.5px; text-transform:uppercase; color:var(--green-accent); display:flex; align-items:center; gap:8px; }
        .res-time { font-size:10px; color:var(--text-dim); font-family:'DM Mono',monospace; }

        .res-body { padding:14px 18px; }
        .res-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .rg-cell { padding:11px 13px; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.045); border-radius:9px; }
        .rg-cell.full { grid-column:1/-1; }
        .rg-lbl { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--text-dim); margin-bottom:5px; font-weight:500; }
        .rg-val { font-size:13px; font-weight:500; color:var(--text); display:flex; align-items:center; gap:7px; }
        .rg-val.mono { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:1.5px; }

        .inv-inner { display:flex; align-items:center; gap:14px; }
        .inv-icon { width:38px; height:38px; border-radius:50%; background:rgba(231,76,60,0.1); border:1px solid rgba(231,76,60,0.22); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .inv-title { font-size:14px; font-weight:600; color:#e74c3c; margin-bottom:3px; }
        .inv-sub { font-size:12px; color:var(--text-dim); }

        .spinner { width:13px; height:13px; border:2px solid rgba(201,168,76,0.25); border-top-color:var(--gold); border-radius:50%; animation:spin 0.65s linear infinite; display:inline-block; }
        @keyframes spin { to{transform:rotate(360deg);} }

        .flip-btn { background:transparent; border:1px solid rgba(201,168,76,0.25); border-radius:100px; color:rgba(201,168,76,0.65); font-size:11px; font-family:'DM Sans',sans-serif; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:7px 18px; cursor:pointer; display:flex; align-items:center; gap:7px; transition:all 0.2s; }
        .flip-btn:hover { background:rgba(201,168,76,0.08); border-color:rgba(201,168,76,0.5); color:#e8c97a; }

        .footer-note { text-align:center; font-size:10px; color:var(--text-dim); letter-spacing:0.4px; opacity:0.6; }
      `}</style>

      <div className="scene">
        <div className="scene-line"/><div className="scene-line"/><div className="scene-line"/>
        <div className="scene-col"/><div className="scene-col"/><div className="scene-col"/>
        <div className="corner corner-tl"/><div className="corner corner-tr"/>
        <div className="corner corner-bl"/><div className="corner corner-br"/>
      </div>

      <div className="page">
        <div className={`wrapper ${mounted ? "visible" : ""}`}>

          <div className="header">
            <div className="header-eyebrow">Financial Security</div>
            <h1 className="header-title">Card <em>Validator</em></h1>
            <p className="header-sub">Luhn verification · BIN lookup · Network detection</p>
          </div>

          <div className="card-scene">
            <div className={`card-flipper ${flipped ? "is-flipped" : ""}`}>
              <div className={`card-face card-front ${scanning ? "scanning" : ""}`}>
                <div className="scan-line"/>
                <div className="card-header">
                  <div className="chip-wrap">
                    <div className="chip"/>
                    <span className="nfc">)))</span>
                  </div>
                  <div className="network-logo-wrap">
                    {result?.valid && CARD_ICONS[result.type]
                      ? <img src={CARD_ICONS[result.type]} alt={result.type} className="network-logo"/>
                      : <div className="network-empty"/>
                    }
                  </div>
                </div>
                <div className="card-number-row">
                  {displayGroups.map((g,i) => (
                    <span key={i} className={`card-group ${g === "????" ? "dim" : ""}`}>{g}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <div>
                    <div className="cf-label">Issuing Bank</div>
                    <div className="cf-value">{result?.valid ? result.bank.toUpperCase() : "— — — — —"}</div>
                  </div>
                  <div>
                    <div className="cf-label">Expires</div>
                    <div className="cf-value">••/••</div>
                  </div>
                  {result?.valid && (
                    <img src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=64`}
                      alt="bank" className="bank-favicon"
                      onError={(e)=>{e.target.style.display="none";}}/>
                  )}
                </div>
              </div>

              <div className="card-face card-back">
                <div className="magstripe"/>
                <div className="cvv-strip">
                  <span className="cvv-text">CVV / SECURITY CODE</span>
                  <span className="cvv-dots">• • •</span>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  {result?.valid && CARD_ICONS[result.type] && (
                    <img src={CARD_ICONS[result.type]} alt={result.type}
                      style={{height:20,filter:"brightness(0) invert(1)",opacity:0.45}}/>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"center",marginTop:"-6px"}}>
            <button className="flip-btn" onClick={() => setFlipped(f => !f)}>
              <span style={{fontSize:"15px",lineHeight:1}}>↺</span>
              {flipped ? "Show Front" : "Show Back"}
            </button>
          </div>

          <div className="input-panel">
            <div className="input-panel-label">Card Number</div>
            <div className="input-row">
              <div className="input-wrap">
                <span className="input-prefix">▸</span>
                <input className="card-input" type="text"
                  placeholder="0000 0000 0000 0000"
                  value={card}
                  onChange={(e) => setCard(formatInput(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                  maxLength={19}/>
              </div>
              <button className="verify-btn" onClick={handleValidate} disabled={scanning}>
                {scanning ? <span className="spinner"/> : "Verify"}
              </button>
            </div>
          </div>

          {result && !scanning && (
            <div className="result-wrap">
              {result.valid ? (
                <div className="res-valid">
                  <div className="res-header">
                    <div className="status-label">
                      <span className="status-dot"/>
                      Verification Passed
                    </div>
                    <span className="res-time">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="res-body">
                    <div className="res-grid">
                      <div className="rg-cell full">
                        <div className="rg-lbl">Masked PAN</div>
                        <div className="rg-val mono">{result.groups.join("  ")}</div>
                      </div>
                      <div className="rg-cell">
                        <div className="rg-lbl">Network</div>
                        <div className="rg-val">{result.type}</div>
                      </div>
                      <div className="rg-cell">
                        <div className="rg-lbl">Issuing Bank</div>
                        <div className="rg-val">{result.bank}</div>
                      </div>
                      <div className="rg-cell full">
                        <div className="rg-lbl">Country of Issue</div>
                        <div className="rg-val">
                          <img src={`https://flagcdn.com/24x18/${result.flag}.png`}
                            alt={result.country} style={{borderRadius:2,boxShadow:"0 1px 4px rgba(0,0,0,0.4)"}}/>
                          {result.country}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="res-invalid">
                  <div className="inv-inner">
                    <div className="inv-icon">✕</div>
                    <div>
                      <div className="inv-title">Verification Failed</div>
                      <div className="inv-sub">Number did not pass the Luhn algorithm check</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="footer-note">For educational use only · No card data is stored or transmitted</div>
        </div>
      </div>
    </>
  );
}

export default App;
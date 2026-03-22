import { useState } from "react";

function App() {
  const [card, setCard] = useState("");
  const [result, setResult] = useState(null);

  const luhnCheck = (num) => {
    let sum = 0;
    let doubleDigit = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);

      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

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

  const binDatabase = [
    { bin: "453201", bank: "JPMorgan Chase", country: "USA" },
    { bin: "431940", bank: "HDFC Bank", country: "India" },
    { bin: "524193", bank: "ICICI Bank", country: "India" },
    { bin: "531004", bank: "Axis Bank", country: "India" }
  ];

  const getBankInfo = (num) => {
    const prefix = num.substring(0, 6);
    for (let entry of binDatabase) {
      if (entry.bin === prefix) return entry;
    }
    return { bank: "Unknown", country: "Unknown" };
  };

  const maskCard = (num) => {
    return num.slice(0, -4).replace(/\d/g, "*") + num.slice(-4);
  };

  const handleValidate = () => {
    const clean = card.replace(/\D/g, "");

    if (clean.length === 0) {
      setResult(null);
      return;
    }

    if (luhnCheck(clean)) {
      const type = getCardType(clean);
      const info = getBankInfo(clean);

      setResult({
        valid: true,
        masked: maskCard(clean),
        type,
        bank: info.bank,
        country: info.country
      });
    } else {
      setResult({ valid: false });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardBox}>
        <h1 style={styles.title}>💳 Card Validator</h1>

        <input
          type="text"
          placeholder="Enter card number"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleValidate} style={styles.button}>
          Validate
        </button>

        {result && (
          <div style={styles.resultBox}>
            {result.valid ? (
              <>
                <p><strong>Card:</strong> {result.masked}</p>
                <p style={{ color: "green" }}>✔ VALID</p>
                <p><strong>Type:</strong> {result.type}</p>
                <p><strong>Bank:</strong> {result.bank}</p>
                <p><strong>Country:</strong> {result.country}</p>
              </>
            ) : (
              <p style={{ color: "red" }}>❌ INVALID CARD</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial"
  },
  cardBox: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    width: "350px",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "15px"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    marginBottom: "20px"
  },
  resultBox: {
    marginTop: "10px",
    textAlign: "left"
  }
};

export default App;
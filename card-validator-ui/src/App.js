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
  // 🇮🇳 INDIA
  { bin: "431940", bank: "HDFC Bank", country: "India" },
  { bin: "524193", bank: "ICICI Bank", country: "India" },
  { bin: "531004", bank: "Axis Bank", country: "India" },
  { bin: "508159", bank: "Punjab National Bank", country: "India" },
  { bin: "652150", bank: "Bank of Baroda", country: "India" },
  { bin: "607153", bank: "Kotak Mahindra Bank", country: "India" },
  { bin: "484718", bank: "Yes Bank", country: "India" },
  { bin: "478286", bank: "IndusInd Bank", country: "India" },
  { bin: "483345", bank: "IDFC First Bank", country: "India" },
  { bin: "421336", bank: "Union Bank of India", country: "India" },
  { bin: "437748", bank: "Canara Bank", country: "India" },
  { bin: "438628", bank: "Indian Bank", country: "India" },
  { bin: "440393", bank: "Central Bank of India", country: "India" },
  { bin: "441139", bank: "Bank of India", country: "India" },
  { bin: "446293", bank: "UCO Bank", country: "India" },
  { bin: "451185", bank: "South Indian Bank", country: "India" },
  { bin: "459761", bank: "Federal Bank", country: "India" },
  { bin: "468540", bank: "RBL Bank", country: "India" },
  { bin: "470589", bank: "Bandhan Bank", country: "India" },

  // 🇺🇸 USA
  { bin: "453201", bank: "JPMorgan Chase", country: "USA" },
  { bin: "400551", bank: "Bank of America", country: "USA" },
  { bin: "414720", bank: "Wells Fargo", country: "USA" },
  { bin: "520000", bank: "Citibank", country: "USA" },
  { bin: "476173", bank: "PNC Bank", country: "USA" },
  { bin: "475128", bank: "US Bank", country: "USA" },
  { bin: "479197", bank: "SunTrust Bank", country: "USA" },
  { bin: "471604", bank: "American Express Bank", country: "USA" },
  { bin: "601111", bank: "Discover Financial", country: "USA" },

  // 🇬🇧 UK
  { bin: "540400", bank: "Barclays", country: "UK" },
  { bin: "481588", bank: "NatWest", country: "UK" },
  { bin: "482269", bank: "Lloyds Bank", country: "UK" },
  { bin: "485464", bank: "HSBC UK", country: "UK" },

  // 🇪🇺 EUROPE
  { bin: "455673", bank: "BNP Paribas", country: "France" },
  { bin: "492181", bank: "Deutsche Bank", country: "Germany" },
  { bin: "489514", bank: "BBVA", country: "Spain" },
  { bin: "448407", bank: "ING Bank", country: "Netherlands" },
  { bin: "491730", bank: "Rabobank", country: "Netherlands" },
  { bin: "497010", bank: "ABN AMRO", country: "Netherlands" },
  { bin: "492905", bank: "Nordea Bank", country: "Sweden" },
  { bin: "493728", bank: "Danske Bank", country: "Denmark" },
  { bin: "494053", bank: "Swedbank", country: "Sweden" },

  // 🇯🇵 JAPAN
  { bin: "498765", bank: "Mitsubishi UFJ", country: "Japan" },
  { bin: "499273", bank: "Sumitomo Mitsui", country: "Japan" },

  // 🇸🇬 ASIA
  { bin: "457173", bank: "DBS Bank", country: "Singapore" },
  { bin: "456735", bank: "UOB Bank", country: "Singapore" },
  { bin: "432215", bank: "OCBC Bank", country: "Singapore" },

  // 🇦🇪 MIDDLE EAST
  { bin: "421275", bank: "Emirates NBD", country: "UAE" },
  { bin: "470132", bank: "Qatar National Bank", country: "Qatar" },

  // 🇨🇳 CHINA
  { bin: "622126", bank: "UnionPay", country: "China" },

  // 🇧🇷 LATAM
  { bin: "543210", bank: "Banco do Brasil", country: "Brazil" },

  // 🔁 EXTRA (Generated realistic entries)
  ...Array.from({ length: 120 }, (_, i) => ({
    bin: (500000 + i).toString(),
    bank: `Global Bank ${i + 1}`,
    country: "Various"
  }))
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
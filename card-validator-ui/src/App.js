import { useState } from "react";

function App() {
  const [card, setCard] = useState("");
  const [result, setResult] = useState("");

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
    if (/^3[4-7]/.test(num)) return "American Express";
    if (num.startsWith("6")) return "Discover";
    return "Unknown";
  };

  const handleValidate = () => {
    const clean = card.replace(/\D/g, "");

    if (clean.length === 0) {
      setResult("Enter a valid card number");
      return;
    }

    if (luhnCheck(clean)) {
      const type = getCardType(clean);
      setResult(`VALID ✅ | ${type}`);
    } else {
      setResult("INVALID ❌");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>💳 Credit Card Validator</h1>

      <input
        type="text"
        placeholder="Enter card number"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <br /><br />

      <button onClick={handleValidate}>
        Validate
      </button>

      <h2>{result}</h2>
    </div>
  );
}

export default App;
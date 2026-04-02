import { useState } from 'react';
import './input.css';

function Input() {
  const [news, setNews] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!news) return alert("Please enter some news text!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('news', news);

      const flaskResponse = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const flaskResult = await flaskResponse.text();

      const geminiResponse = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: "Explain this news and verify if it seems true or false",
          context: news
        }),
      });

      const geminiData = await geminiResponse.json();

      const finalResult = `
        <div style="text-align:left">
          <h3>🔍 AI Detection Result</h3>
          <p>${flaskResult}</p>

          <hr/>

          <h3>🤖 AI Explanation</h3>
          <p>${geminiData.answer}</p>
        </div>
      `;

      setResult(finalResult);

    } catch (error) {
      console.error("Error:", error);
      setResult("⚠️ Error connecting to server.");
    }

    setLoading(false);
  };

  return (
    <div className='input-full'>
      <div className="input-top">
        <p>Get the Truth</p>
      </div>

      <div className="input-card">
        <h1>Find if the Source is True or Not using our news truth finder model</h1>

        <div className='input-card-tag'>
          <button>#findtruth</button>
          <button>#analysis</button>
        </div>
      </div>

      <div className="input-button">
        <input
          type="text"
          value={news}
          onChange={(e) => setNews(e.target.value)}
          placeholder="Enter news text here..."
        />

        <button onClick={handleVerify}>
          {loading ? "Checking..." : "Verify!"}
        </button>
      </div>

      {result && (
        <div
          className="input-result"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      )}
    </div>
  );
}

export default Input;
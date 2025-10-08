import { useState } from 'react';
import './input.css';

function Input() {
  const [news, setNews] = useState('');
  const [result, setResult] = useState('');

  const handleVerify = async () => {
    if (!news) return alert("Please enter some news text!");

    try {
      const formData = new FormData();
      formData.append('news', news);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error("Error verifying news:", error);
      setResult("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className='input-full'>
      <div className="input-top">
        <span></span>
        <p>Get the Truth</p>
      </div>

      <div className="input-card">
        <h1>Find if the Source is True or Not using our news truth finder model</h1>
        <div className='input-card-tag'>
          <a>#findtruth</a>
          <a>#analysis</a>
        </div>
      </div>

      <div className="input-button">
        <input
          type="text"
          name="value"
          value={news}
          onChange={(e) => setNews(e.target.value)}
          placeholder="Enter news text here..."
        />
        <button onClick={handleVerify}>Verify!</button>
      </div>

      {result && (
        <div className="input-result" dangerouslySetInnerHTML={{ __html: result }} />
      )}
    </div>
  );
}

export default Input;

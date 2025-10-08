import { useEffect, useState } from "react";
import './recommendNews.css';
import ChatbotWidget from "./chatbot.js";

function RecommendNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=3e42b059c1174e03aab477787ae52525`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const newsContext = articles
    .slice(0, 10)
    .map(a => a.title + " " + (a.description || ""))
    .join("\n\n");

  return (
    <div className="recommend-news-container">
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="recommend-news-list">
          {articles.length === 0 ? (
            <p>No news found.</p>
          ) : (
            articles.slice(5, 8).map((article, index) => {
              const date = new Date(article.publishedAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              );
              return (
                <div key={index} className="recommend-news-card">
                  <div className="recommend-news-meta">
                    <span className="recommend-news-source">{article.source?.name}</span>
                    <span className="recommend-news-date">{date}</span>
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                </div>
              );
            })
          )}
        </div>
      )}
      <ChatbotWidget newsContext={newsContext} />
    </div>
  );
}

export default RecommendNews;

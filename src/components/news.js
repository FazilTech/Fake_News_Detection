import './news.css';
import { useEffect, useState } from "react";

function News() {
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

  return (
    <div className="news-container">
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="news-list">
          {articles.length === 0 ? (
            <p>No news found.</p>
          ) : (
            articles.slice(0, 3).map((article, index) => {
              const date = new Date(article.publishedAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              );
              return (
                <div key={index} className="news-card">
                  <div className="news-meta">
                    <span className="news-source">{article.source?.name}</span>
                    <span className="news-date">{date}</span>
                  </div>
                  <a href={article.url}>{article.title}</a>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default News;

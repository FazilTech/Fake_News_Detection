import News from './news.js';
import RecommendNews from './news-articals.js';
import './search.css';
import { useEffect, useState } from "react";

function SearchBar() {
  const [recommendedNews, setRecommendedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=3e42b059c1174e03aab477787ae52525`
        );
        const data = await response.json();
        setRecommendedNews(data.articles.slice(3, 4));
      } catch (error) {
        console.error("Error fetching recommended news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className='search-top'>
      <div className="search-text">
        <input type="text" placeholder="Article name, Tag name, ...." />
        <a>🔍</a>
      </div>

      <div className='search-recommend'>
        <div className='recommned-top'>
          <p>Recommend</p>
          <a>View More →</a>
        </div>

        <div className='recommend-bottom-up'>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            recommendedNews.map((news, index) => (
              <div key={index} className="news-image-card">
                {news.urlToImage && (
                  <>
                    <img src={news.urlToImage} alt={news.title} />
                    <div className="news-overlay">
                      <span className="news-meta">
                        {news.source?.name} •{" "}
                        {new Date(news.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <h3>{news.title}</h3>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className='recommend-bottom-down'>
            <RecommendNews/>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

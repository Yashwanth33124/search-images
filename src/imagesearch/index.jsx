import React, { useState } from "react";
import "./image.css";

const ImageSearch = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const ACCESS_KEY = "s-2sxe1RGs9nmtobx2YKgCaAjrk3u5hZOa1Jdgg1ZZA";

  const searchImages = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=20&client_id=${ACCESS_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images. Please try again later.");
      }

      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setImages([]);
    setSearched(false);
    setError(null);
  };

  return (
    <div className={`image-search-container ${darkMode ? "dark" : "light"}`}>
      
      {/* 🌗 Top-right Dark/Light Mode Toggle */}
      <div className="top-toggle" onClick={() => setDarkMode(!darkMode)}>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? "🌙" : "☀️"}</span>
      </div>

      <div className="content">
        <h2>Unsplash Images</h2>

        {/* 🔍 Search Box */}
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchImages()}
            placeholder="Search images..."
          />
          <button onClick={searchImages}>Search</button>

          {searched && (
            <button className="clear-btn" onClick={clearSearch}>
              Clear
            </button>
          )}
        </div>

        {/* 🌀 Loading / Error / No Results */}
        {loading && <p className="loading">Loading images...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && searched && images.length === 0 && !error && (
          <p className="loading">No images found.</p>
        )}

        {/* 🖼️ Images Grid */}
        <div className="images-grid">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSearch;

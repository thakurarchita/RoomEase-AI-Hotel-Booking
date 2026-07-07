import React, { useState, useEffect } from "react";
import "./ReviewsPage.css";

const ReviewsPage = () => {
  const [formData, setFormData] = useState({ name: "", review: "", rating: 0 });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8000/ramkrishna/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(sortReviews(data));
      } else {
        console.error("Error fetching reviews");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const sortReviews = (reviewsArray) => {
    const goodReviews = reviewsArray.filter(
      (r) => r.sentiment === "positive" || r.sentiment === "neutral"
    );
    const badReviews = reviewsArray.filter((r) => r.sentiment === "negative");
    return [...goodReviews, ...badReviews];
  };

  const handleRating = (ratingValue) => {
    setFormData({ ...formData, rating: ratingValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/ramkrishna/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Review submitted successfully!");
      setFormData({ name: "", review: "", rating: 0 });
      fetchReviews();
    } else {
      alert("Error submitting review!");
    }
  };

  return (
    <div className="reviews-container">
      {/* Review Form */}
      <div className="review-card">
        <h2 className="review-title">Share Your Experience</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="review-input-field"
            pattern="[A-Za-z]+(?:\s[A-Za-z]+)*"
            title="Please enter only letters and spaces."
          />
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= formData.rating ? "filled" : ""}`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            value={formData.review}
            onChange={(e) =>
              setFormData({ ...formData, review: e.target.value })
            }
            required
            className="review-textarea-field"
            rows="4"
          ></textarea>
          <button type="submit" className="review-submit-btn">
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h2 className="reviews-heading">User Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className={`review-item ${review.sentiment}`}>
                <h3>{review.name}</h3>
                <p className="stars">{"⭐".repeat(review.stars)}</p>
                <p>{review.review_text}</p>
                <small>{new Date(review.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;

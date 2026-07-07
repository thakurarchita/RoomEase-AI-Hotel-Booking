const csv = require("csv-parser");
const fs = require("fs");
const db = require("../database/connection");
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Add a single review
exports.submitReviews = async (req, res) => {
    let { name, rating, review } = req.body;

    if (!name || !rating || !review) {
        return res.status(400).json({ message: "All fields are required" });
    }

    rating = parseInt(rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Sentiment analysis
    const sentimentResult = sentiment.analyze(review);
    const sentimentScore = sentimentResult.comparative;

    const sql = "INSERT INTO reviews (name, stars, review_text, sentiment_score, created_at) VALUES (?, ?, ?, ?, NOW())";
    db.query(sql, [name, rating, review, sentimentScore], (err, result) => {
        if (err) {
            console.error("Error inserting review:", err);
            return res.status(500).json({ message: "Error inserting review", error: err });
        }
        res.status(201).json({ message: "Review added successfully", reviewId: result.insertId });
    });
}

// Bulk insert from CSV
exports.submitCSV = async (req, res) => {
    const filePath = "E:/PROJECT/ramkrishna_frontend/uploads/Finale_Reviews.csv";

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: "CSV file not found" });
    }

    const reviews = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            const name = row["Reviewer's Name"] ? row["Reviewer's Name"].trim() : null;
            const review = row["reviews"] ? row["reviews"].trim() : null;
            let rating = Math.floor(Math.random() * 5) + 1; // Random 1-5
            const created_at = new Date(row["Date"]).toISOString().slice(0, 19).replace("T", " ");

            if (name && review) {
                const sentimentResult = sentiment.analyze(review);
                const sentimentScore = sentimentResult.comparative;

                reviews.push([name, rating, review, created_at, sentimentScore]);
            }
        })
        .on("end", () => {
            if (reviews.length === 0) {
                return res.status(400).json({ message: "CSV file is empty or invalid format" });
            }

            const sql = "INSERT INTO reviews (name, stars, review_text, created_at, sentiment_score) VALUES ?";
            db.query(sql, [reviews], (err) => {
                if (err) {
                    console.error("Error inserting CSV data:", err);
                    return res.status(500).json({ message: "Error inserting CSV data", error: err });
                }
                res.status(201).json({ message: "CSV data inserted successfully" });
            });
        })
        .on("error", (err) => {
            console.error("Error reading CSV file:", err.message);
            res.status(500).json({ message: "Error reading CSV file", error: err.message });
        });
}

// Fetch all reviews
// Fetch all reviews
exports.getReviews = async (req, res) => {
    try {
        const query = "SELECT name, stars, review_text, created_at, sentiment_score FROM reviews ORDER BY sentiment_score DESC";

        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching reviews:", err);
                return res.status(500).json({ message: "Error fetching reviews" });
            }

            // Add sentiment label
            const reviewsWithSentiment = results.map(review => {
                let sentimentLabel = "neutral";

                // Adjust thresholds to correctly classify neutral, positive, and negative sentiments
                if (review.sentiment_score > 0.1) {
                    sentimentLabel = "positive";
                } else if (review.sentiment_score < -0.1) {
                    sentimentLabel = "negative";
                }

                return { ...review, sentiment: sentimentLabel };
            });

            res.json(reviewsWithSentiment);
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
 
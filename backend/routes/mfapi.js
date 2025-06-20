import axios from "axios";
import express from "express";

const router = express.Router();

// Proxy endpoint to search mutual funds
router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(
      `https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Proxy Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data from external API." });
  }
});

export default router;

import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Fund details by schemeCode
router.get("/mf/:schemeCode", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.mfapi.in/mf/${req.params.schemeCode}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch fund data" });
  }
});

// ✅ Search mutual funds
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  try {
    const response = await axios.get(
      `https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

export default router;

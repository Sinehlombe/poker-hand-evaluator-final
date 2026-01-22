/**
 * Express Server for Poker Hand Evaluator
 * 
 * This is the main server file that sets up Express,
 * middleware, routes, and error handling.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const { evaluateHand } = require("./services/handEvaluator");

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for frontend requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../../public")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ROUTES
// ============================================

/**
 * GET /api/health
 * Health check endpoint to verify server is running
 */
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "Poker Hand Evaluator API is running",
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/evaluate
 * Main endpoint to evaluate a poker hand
 * 
 * Expected request body:
 * {
 *   "cards": [
 *     { "rank": "A", "suit": "Spades" },
 *     { "rank": "K", "suit": "Spades" },
 *     { "rank": "Q", "suit": "Spades" },
 *     { "rank": "J", "suit": "Spades" },
 *     { "rank": "10", "suit": "Spades" }
 *   ]
 * }
 */
app.post("/api/evaluate", (req, res) => {
  try {
    const { cards } = req.body;

    // Validate request body
    if (!cards) {
      return res.status(400).json({
        error: "Missing required field: cards",
        message: "Request body must include a cards array"
      });
    }

    // Evaluate the hand
    const result = evaluateHand(cards);

    // Return successful response
    res.json({
      success: true,
      hand: result,
      cards: cards
    });

  } catch (error) {
    // Handle validation or evaluation errors
    console.error("Evaluation error:", error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      cards: req.body.cards || []
    });
  }
});

/**
 * GET /api/examples
 * Returns example hands for each poker hand type
 */
app.get("/api/examples", (req, res) => {
  const examples = [
    {
      handName: "Royal Flush",
      cards: [
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]
    },
    {
      handName: "Straight Flush",
      cards: [
        { rank: "9", suit: "Clubs" },
        { rank: "8", suit: "Clubs" },
        { rank: "7", suit: "Clubs" },
        { rank: "6", suit: "Clubs" },
        { rank: "5", suit: "Clubs" }
      ]
    },
    {
      handName: "Four of a Kind",
      cards: [
        { rank: "K", suit: "Hearts" },
        { rank: "K", suit: "Diamonds" },
        { rank: "K", suit: "Clubs" },
        { rank: "K", suit: "Spades" },
        { rank: "3", suit: "Hearts" }
      ]
    },
    {
      handName: "Full House",
      cards: [
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Diamonds" },
        { rank: "A", suit: "Clubs" },
        { rank: "8", suit: "Spades" },
        { rank: "8", suit: "Hearts" }
      ]
    },
    {
      handName: "Two Pair",
      cards: [
        { rank: "A", suit: "Spades" },
        { rank: "10", suit: "Clubs" },
        { rank: "10", suit: "Hearts" },
        { rank: "3", suit: "Diamonds" },
        { rank: "3", suit: "Spades" }
      ]
    }
  ];

  res.json({ examples });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      "GET /api/health",
      "POST /api/evaluate",
      "GET /api/examples"
    ]
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  Poker Hand Evaluator Server Started  ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`\n🃏 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/evaluate`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;

/**
 * Express Server for Poker Hand Evaluator
 * 
 * This is the main server that provides:
 * - Health check endpoint for monitoring
 * - REST API for poker hand evaluation
 * - Static file serving for the React frontend
 * - Comprehensive error handling and logging
 * 
 * Server runs on port 3000 by default
 * Accessible at http://localhost:3000
 * 
 * @module server
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

/**
 * Enable CORS (Cross-Origin Resource Sharing)
 * Allows requests from different origins during development
 */
app.use(cors());

/**
 * Parse JSON request bodies
 * Enables handling of JSON payloads in POST requests
 */
app.use(express.json());

/**
 * Serve static files from public directory
 * Serves the React frontend and associated assets
 */
app.use(express.static(path.join(__dirname, "../../public")));

/**
 * Request logging middleware
 * Logs all incoming requests with timestamp, method, and path
 */
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
 * 
 * Returns:
 * - status: "healthy" - indicates server is operational
 * - message: descriptive status message
 * - timestamp: server time when check was performed
 * 
 * Used by: Frontend health check, monitoring systems
 * 
 * @route GET /api/health
 * @returns {Object} Health status with timestamp
 * @example
 * GET /api/health
 * Response: {
 *   "status": "healthy",
 *   "message": "Poker Hand Evaluator API is running",
 *   "timestamp": "2026-01-22T10:30:00.000Z"
 * }
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
 * Validates the input hand and returns the highest poker hand ranking
 * detected in the provided 5 cards.
 * 
 * Request body format:
 * {
 *   "cards": [
 *     { "rank": "A", "suit": "Spades" },
 *     { "rank": "K", "suit": "Spades" },
 *     { "rank": "Q", "suit": "Spades" },
 *     { "rank": "J", "suit": "Spades" },
 *     { "rank": "10", "suit": "Spades" }
 *   ]
 * }
 * 
 * Success Response (200 OK):
 * {
 *   "success": true,
 *   "hand": {
 *     "rank": 10,
 *     "handName": "Royal Flush",
 *     "description": "A-K-Q-J-10 of the same suit - the best possible hand!"
 *   },
 *   "cards": [...]
 * }
 * 
 * Error Response (400 Bad Request):
 * {
 *   "success": false,
 *   "error": "A poker hand must contain exactly 5 cards",
 *   "cards": [...]
 * }
 * 
 * Valid Ranks: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
 * Valid Suits: Hearts, Diamonds, Clubs, Spades
 * 
 * @route POST /api/evaluate
 * @param {Object} req.body - Request body containing cards array
 * @param {Array} req.body.cards - Exactly 5 card objects to evaluate
 * @returns {Object} Evaluation result with hand ranking
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
 * 
 * Useful for:
 * - Testing the evaluation API
 * - Learning about different poker hands
 * - Quick demonstration of functionality
 * 
 * Returns an array of example hands, each with:
 * - handName: The name of the poker hand
 * - cards: Array of 5 cards representing that hand
 * 
 * @route GET /api/examples
 * @returns {Object} Object containing examples array
 * @returns {Array} examples - Array of example poker hands
 * @example
 * GET /api/examples
 * Response: {
 *   "examples": [
 *     {
 *       "handName": "Royal Flush",
 *       "cards": [
 *         { "rank": "A", "suit": "Hearts" },
 *         { "rank": "K", "suit": "Hearts" },
 *         ...
 *       ]
 *     },
 *     ...
 *   ]
 * }
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
 * 404 Handler for undefined routes
 * 
 * Handles requests to endpoints that don't exist
 * Returns helpful error message with list of available endpoints
 * 
 * Response Format (404):
 * {
 *   "error": "Route not found",
 *   "message": "Cannot {METHOD} {PATH}",
 *   "availableEndpoints": [...]
 * }
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
 * 
 * Catches all unhandled errors in middleware and routes
 * Logs error details for debugging
 * Returns generic error response to client
 * 
 * Response Format (500):
 * {
 *   "error": "Internal server error",
 *   "message": "{error message}"
 * }
 * 
 * Common error scenarios handled:
 * - Invalid JSON in request body
 * - Missing required fields
 * - Invalid card data
 * - Unexpected server errors
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

/**
 * Start the server and listen for connections
 * 
 * Logs startup information including:
 * - Server status
 * - Local URL for access
 * - API endpoint information
 * - Health check endpoint
 */
app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  Poker Hand Evaluator Server Started  ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`\n🃏 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/evaluate`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;

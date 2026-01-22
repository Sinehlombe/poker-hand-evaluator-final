/**
 * Poker Hand Evaluator - Complete Implementation
 * 
 * This module provides comprehensive poker hand evaluation, including:
 * - Validation of card inputs (rank, suit, count, duplicates)
 * - Detection of all 10 poker hand rankings
 * - Support for both high and low straights (wheel)
 * - Proper ranking of hands for comparison
 * 
 * @module handEvaluator
 */

/**
 * Mapping of card rank symbols to numeric values for comparison
 * Used for straight detection and high card evaluation
 * @constant {Object}
 */
const RANK_VALUES = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

/**
 * Hand ranking constants with numeric values
 * Higher numbers represent stronger hands
 * @constant {Object}
 */
const HAND_RANKINGS = {
  HIGH_CARD: 1,
  ONE_PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL_FLUSH: 10
};

/**
 * Validates a poker hand for correctness
 * 
 * Checks:
 * - Array is provided and contains exactly 5 cards
 * - All cards have rank and suit properties
 * - Ranks are valid (2-10, J, Q, K, A)
 * - Suits are valid (Hearts, Diamonds, Clubs, Spades)
 * - No duplicate cards exist in the hand
 * 
 * @param {Array<Object>} cards - Array of card objects
 * @param {string} cards[].rank - Card rank (2-10, J, Q, K, A)
 * @param {string} cards[].suit - Card suit (Hearts, Diamonds, Clubs, Spades)
 * @returns {Object} Validation result
 * @returns {boolean} isValid - Whether the hand is valid
 * @returns {string|null} error - Error message if invalid, null if valid
 */
function validateHand(cards) {
  if (!cards || !Array.isArray(cards)) {
    return { isValid: false, error: "Cards must be an array" };
  }
  if (cards.length !== 5) {
    return { isValid: false, error: "A poker hand must contain exactly 5 cards" };
  }
  const validRanks = Object.keys(RANK_VALUES);
  const validSuits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (!card.rank || !card.suit) {
      return { isValid: false, error: `Card ${i + 1} is missing rank or suit` };
    }
    if (!validRanks.includes(card.rank)) {
      return { isValid: false, error: `Invalid rank: ${card.rank}` };
    }
    if (!validSuits.includes(card.suit)) {
      return { isValid: false, error: `Invalid suit: ${card.suit}` };
    }
  }
  const cardStrings = cards.map(c => `${c.rank}_${c.suit}`);
  const uniqueCards = new Set(cardStrings);
  if (uniqueCards.size !== 5) {
    return { isValid: false, error: "Hand contains duplicate cards" };
  }
  return { isValid: true, error: null };
}

/**
 * Counts the frequency of each rank in a hand
 * Used to detect pairs, three of a kind, and four of a kind
 * 
 * @param {Array<Object>} cards - Array of card objects
 * @returns {Object} Object with ranks as keys and counts as values
 * @example
 * // Returns: { "K": 4, "3": 1 }
 * getRankCounts([
 *   { rank: "K", suit: "Hearts" },
 *   { rank: "K", suit: "Diamonds" },
 *   { rank: "K", suit: "Clubs" },
 *   { rank: "K", suit: "Spades" },
 *   { rank: "3", suit: "Hearts" }
 * ])
 */
function getRankCounts(cards) {
  const counts = {};
  cards.forEach(card => {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  });
  return counts;
}

/**
 * Extracts the count pattern from rank frequencies
 * Sorted in descending order for hand matching
 * 
 * @param {Object} rankCounts - Object from getRankCounts()
 * @returns {Array<number>} Sorted array of card counts
 * @example
 * // Returns: [4, 1] for four of a kind
 * getCountPattern({ "K": 4, "3": 1 })
 */
function getCountPattern(rankCounts) {
  return Object.values(rankCounts).sort((a, b) => b - a);
}

/**
 * Detects if all five cards are of the same suit
 * 
 * @param {Array<Object>} cards - Array of card objects
 * @returns {boolean} True if all cards are same suit
 */
function isFlush(cards) {
  const firstSuit = cards[0].suit;
  return cards.every(card => card.suit === firstSuit);
}

/**
 * Detects if the hand contains five consecutive ranks
 * Supports both regular straights and wheel (Ace-low straight: A-2-3-4-5)
 * 
 * @param {Array<Object>} cards - Array of card objects
 * @returns {boolean} True if hand contains a straight
 */
function isStraight(cards) {
  const values = cards.map(card => RANK_VALUES[card.rank]).sort((a, b) => a - b);
  
  // Regular straight: consecutive values
  let isConsecutive = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }
  if (isConsecutive) return true;
  
  // Wheel (Ace-low straight): A-2-3-4-5
  // Ace has value 14 but counts as 1 in a wheel
  const isWheel = values[0] === 2 && values[1] === 3 && 
                  values[2] === 4 && values[3] === 5 && values[4] === 14;
  return isWheel;
}

/**
 * Gets the highest rank value in a hand
 * Used for Royal Flush detection and high card determination
 * 
 * @param {Array<Object>} cards - Array of card objects
 * @returns {number} Numeric value of the highest card (1-14)
 */
function getHighCard(cards) {
  return Math.max(...cards.map(card => RANK_VALUES[card.rank]));
}

/**
 * Evaluates a poker hand and returns its ranking
 * 
 * Process:
 * 1. Validates the input hand
 * 2. Checks for each hand type from best to worst
 * 3. Returns the highest ranking hand found
 * 
 * Hand rankings (best to worst):
 * 1. Royal Flush - A-K-Q-J-10 same suit
 * 2. Straight Flush - Five consecutive cards same suit
 * 3. Four of a Kind - Four cards same rank
 * 4. Full House - Three of a kind + pair
 * 5. Flush - Five cards same suit
 * 6. Straight - Five consecutive cards
 * 7. Three of a Kind - Three cards same rank
 * 8. Two Pair - Two different pairs
 * 9. One Pair - Two cards same rank
 * 10. High Card - No matches
 * 
 * @param {Array<Object>} cards - Array of exactly 5 card objects
 * @param {string} cards[].rank - Card rank (2-10, J, Q, K, A)
 * @param {string} cards[].suit - Card suit (Hearts, Diamonds, Clubs, Spades)
 * @returns {Object} Hand evaluation result
 * @returns {number} rank - Numeric ranking (1-10)
 * @returns {string} handName - Name of the hand ranking
 * @returns {string} description - Description of the hand ranking
 * @throws {Error} If hand validation fails
 * 
 * @example
 * const hand = [
 *   { rank: "A", suit: "Spades" },
 *   { rank: "10", suit: "Clubs" },
 *   { rank: "10", suit: "Hearts" },
 *   { rank: "3", suit: "Diamonds" },
 *   { rank: "3", suit: "Spades" }
 * ];
 * const result = evaluateHand(hand);
 * // Returns: { rank: 3, handName: "Two Pair", description: "Two different pairs" }
 */
function evaluateHand(cards) {
  const validation = validateHand(cards);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const rankCounts = getRankCounts(cards);
  const countPattern = getCountPattern(rankCounts);
  const flush = isFlush(cards);
  const straight = isStraight(cards);
  const highCard = getHighCard(cards);

  // Check for Royal Flush
  if (flush && straight && highCard === 14) {
    const sortedRanks = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
    if (sortedRanks[0] === 14 && sortedRanks[4] === 10) {
      return {
        rank: HAND_RANKINGS.ROYAL_FLUSH,
        handName: "Royal Flush",
        description: "A-K-Q-J-10 of the same suit - the best possible hand!"
      };
    }
  }

  // Check for Straight Flush
  if (flush && straight) {
    return {
      rank: HAND_RANKINGS.STRAIGHT_FLUSH,
      handName: "Straight Flush",
      description: "Five consecutive cards of the same suit"
    };
  }

  // Check for Four of a Kind
  if (countPattern[0] === 4) {
    return {
      rank: HAND_RANKINGS.FOUR_OF_A_KIND,
      handName: "Four of a Kind",
      description: "Four cards of the same rank"
    };
  }

  // Check for Full House
  if (countPattern[0] === 3 && countPattern[1] === 2) {
    return {
      rank: HAND_RANKINGS.FULL_HOUSE,
      handName: "Full House",
      description: "Three of a kind plus a pair"
    };
  }

  // Check for Flush
  if (flush) {
    return {
      rank: HAND_RANKINGS.FLUSH,
      handName: "Flush",
      description: "Five cards of the same suit"
    };
  }

  // Check for Straight
  if (straight) {
    return {
      rank: HAND_RANKINGS.STRAIGHT,
      handName: "Straight",
      description: "Five consecutive cards of different suits"
    };
  }

  // Check for Three of a Kind
  if (countPattern[0] === 3) {
    return {
      rank: HAND_RANKINGS.THREE_OF_A_KIND,
      handName: "Three of a Kind",
      description: "Three cards of the same rank"
    };
  }

  // Check for Two Pair
  if (countPattern[0] === 2 && countPattern[1] === 2) {
    return {
      rank: HAND_RANKINGS.TWO_PAIR,
      handName: "Two Pair",
      description: "Two different pairs"
    };
  }

  // Check for One Pair
  if (countPattern[0] === 2) {
    return {
      rank: HAND_RANKINGS.ONE_PAIR,
      handName: "One Pair",
      description: "Two cards of the same rank"
    };
  }

  // High Card
  return {
    rank: HAND_RANKINGS.HIGH_CARD,
    handName: "High Card",
    description: "No matching cards"
  };
}

module.exports = {
  evaluateHand,
  validateHand,
  HAND_RANKINGS,
  RANK_VALUES
};

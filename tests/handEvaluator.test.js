/**
 * Poker Hand Evaluator Test Suite
 * 
 * This test suite provides comprehensive coverage of:
 * - Hand validation logic
 * - All 10 poker hand ranking detections
 * - Edge cases (ace-low straights, various flush combinations)
 * - Error handling and invalid input scenarios
 */

const { evaluateHand, validateHand, HAND_RANKINGS } = require("../src/backend/services/handEvaluator");

describe("Hand Validation", () => {
  describe("Card Count Validation", () => {
    test("should reject hands with less than 5 cards", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("exactly 5 cards");
    });

    test("should reject hands with more than 5 cards", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" },
        { rank: "9", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
    });

    test("should reject empty array", () => {
      const result = validateHand([]);
      expect(result.isValid).toBe(false);
    });

    test("should reject null input", () => {
      const result = validateHand(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("array");
    });
  });

  describe("Rank and Suit Validation", () => {
    test("should reject hands with invalid ranks", () => {
      const result = validateHand([
        { rank: "X", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid rank");
    });

    test("should reject hands with invalid suits", () => {
      const result = validateHand([
        { rank: "A", suit: "InvalidSuit" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid suit");
    });

    test("should accept all valid ranks (2-A)", () => {
      const validRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
      validRanks.forEach(rank => {
        const hand = [
          { rank: rank, suit: "Hearts" },
          { rank: "K", suit: "Diamonds" },
          { rank: "Q", suit: "Clubs" },
          { rank: "J", suit: "Spades" },
          { rank: "10", suit: "Hearts" }
        ];
        const result = validateHand(hand);
        expect(result.isValid).toBe(true);
      });
    });

    test("should accept all valid suits", () => {
      const validSuits = ["Hearts", "Diamonds", "Clubs", "Spades"];
      validSuits.forEach(suit => {
        const hand = [
          { rank: "A", suit: suit },
          { rank: "K", suit: "Diamonds" },
          { rank: "Q", suit: "Clubs" },
          { rank: "J", suit: "Spades" },
          { rank: "10", suit: "Hearts" }
        ];
        const result = validateHand(hand);
        expect(result.isValid).toBe(true);
      });
    });

    test("should reject cards with missing rank", () => {
      const result = validateHand([
        { suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("missing rank or suit");
    });

    test("should reject cards with missing suit", () => {
      const result = validateHand([
        { rank: "A" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("missing rank or suit");
    });
  });

  describe("Duplicate Detection", () => {
    test("should reject hands with duplicate cards (same rank and suit)", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("duplicate");
    });

    test("should allow same rank with different suits", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Diamonds" },
        { rank: "Q", suit: "Clubs" },
        { rank: "J", suit: "Spades" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(true);
    });

    test("should detect multiple duplicates", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Diamonds" },
        { rank: "K", suit: "Diamonds" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(false);
    });
  });

  describe("Valid Hand Acceptance", () => {
    test("should accept valid Royal Flush hand", () => {
      const result = validateHand([
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ]);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("should accept valid mixed hand", () => {
      const result = validateHand([
        { rank: "2", suit: "Clubs" },
        { rank: "7", suit: "Diamonds" },
        { rank: "J", suit: "Hearts" },
        { rank: "K", suit: "Spades" },
        { rank: "A", suit: "Clubs" }
      ]);
      expect(result.isValid).toBe(true);
    });
  });
});

describe("Hand Evaluation Rankings", () => {
  describe("Royal Flush Detection", () => {
    test("should detect Royal Flush with Spades", () => {
      const hand = [
        { rank: "A", suit: "Spades" },
        { rank: "K", suit: "Spades" },
        { rank: "Q", suit: "Spades" },
        { rank: "J", suit: "Spades" },
        { rank: "10", suit: "Spades" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ROYAL_FLUSH);
      expect(result.handName).toBe("Royal Flush");
      expect(result.rank).toBe(10);
    });

    test("should detect Royal Flush with Hearts", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "10", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ROYAL_FLUSH);
    });

    test("should detect Royal Flush with Diamonds", () => {
      const hand = [
        { rank: "A", suit: "Diamonds" },
        { rank: "K", suit: "Diamonds" },
        { rank: "Q", suit: "Diamonds" },
        { rank: "J", suit: "Diamonds" },
        { rank: "10", suit: "Diamonds" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ROYAL_FLUSH);
    });

    test("should detect Royal Flush with Clubs", () => {
      const hand = [
        { rank: "A", suit: "Clubs" },
        { rank: "K", suit: "Clubs" },
        { rank: "Q", suit: "Clubs" },
        { rank: "J", suit: "Clubs" },
        { rank: "10", suit: "Clubs" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ROYAL_FLUSH);
    });

    test("should not confuse flush with Royal Flush", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "9", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FLUSH);
    });
  });

  describe("Straight Flush Detection", () => {
    test("should detect Straight Flush", () => {
      const hand = [
        { rank: "9", suit: "Clubs" },
        { rank: "8", suit: "Clubs" },
        { rank: "7", suit: "Clubs" },
        { rank: "6", suit: "Clubs" },
        { rank: "5", suit: "Clubs" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT_FLUSH);
      expect(result.handName).toBe("Straight Flush");
    });

    test("should detect Straight Flush (low straight)", () => {
      const hand = [
        { rank: "5", suit: "Hearts" },
        { rank: "4", suit: "Hearts" },
        { rank: "3", suit: "Hearts" },
        { rank: "2", suit: "Hearts" },
        { rank: "A", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT_FLUSH);
    });

    test("should not confuse straight with straight flush", () => {
      const hand = [
        { rank: "9", suit: "Clubs" },
        { rank: "8", suit: "Hearts" },
        { rank: "7", suit: "Clubs" },
        { rank: "6", suit: "Hearts" },
        { rank: "5", suit: "Clubs" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT);
    });
  });

  describe("Four of a Kind Detection", () => {
    test("should detect Four of a Kind", () => {
      const hand = [
        { rank: "K", suit: "Hearts" },
        { rank: "K", suit: "Diamonds" },
        { rank: "K", suit: "Clubs" },
        { rank: "K", suit: "Spades" },
        { rank: "3", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FOUR_OF_A_KIND);
      expect(result.handName).toBe("Four of a Kind");
    });

    test("should detect Four of a Kind with low cards", () => {
      const hand = [
        { rank: "2", suit: "Hearts" },
        { rank: "2", suit: "Diamonds" },
        { rank: "2", suit: "Clubs" },
        { rank: "2", suit: "Spades" },
        { rank: "A", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FOUR_OF_A_KIND);
    });
  });

  describe("Full House Detection", () => {
    test("should detect Full House", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Diamonds" },
        { rank: "A", suit: "Clubs" },
        { rank: "8", suit: "Spades" },
        { rank: "8", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FULL_HOUSE);
      expect(result.handName).toBe("Full House");
    });

    test("should detect Full House (low trips)", () => {
      const hand = [
        { rank: "2", suit: "Hearts" },
        { rank: "2", suit: "Diamonds" },
        { rank: "2", suit: "Clubs" },
        { rank: "K", suit: "Spades" },
        { rank: "K", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FULL_HOUSE);
    });
  });

  describe("Flush Detection", () => {
    test("should detect Flush (Hearts)", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Hearts" },
        { rank: "J", suit: "Hearts" },
        { rank: "9", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FLUSH);
      expect(result.handName).toBe("Flush");
    });

    test("should detect Flush (Spades)", () => {
      const hand = [
        { rank: "2", suit: "Spades" },
        { rank: "5", suit: "Spades" },
        { rank: "7", suit: "Spades" },
        { rank: "9", suit: "Spades" },
        { rank: "K", suit: "Spades" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FLUSH);
    });

    test("should detect Flush (Diamonds)", () => {
      const hand = [
        { rank: "3", suit: "Diamonds" },
        { rank: "6", suit: "Diamonds" },
        { rank: "8", suit: "Diamonds" },
        { rank: "J", suit: "Diamonds" },
        { rank: "A", suit: "Diamonds" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.FLUSH);
    });
  });

  describe("Straight Detection", () => {
    test("should detect high Straight", () => {
      const hand = [
        { rank: "A", suit: "Spades" },
        { rank: "K", suit: "Hearts" },
        { rank: "Q", suit: "Clubs" },
        { rank: "J", suit: "Diamonds" },
        { rank: "10", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT);
      expect(result.handName).toBe("Straight");
    });

    test("should detect wheel (Ace-low Straight)", () => {
      const hand = [
        { rank: "5", suit: "Clubs" },
        { rank: "4", suit: "Diamonds" },
        { rank: "3", suit: "Hearts" },
        { rank: "2", suit: "Spades" },
        { rank: "A", suit: "Clubs" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT);
    });

    test("should detect middle Straight", () => {
      const hand = [
        { rank: "9", suit: "Hearts" },
        { rank: "8", suit: "Clubs" },
        { rank: "7", suit: "Diamonds" },
        { rank: "6", suit: "Hearts" },
        { rank: "5", suit: "Spades" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.STRAIGHT);
    });
  });

  describe("Three of a Kind Detection", () => {
    test("should detect Three of a Kind", () => {
      const hand = [
        { rank: "Q", suit: "Hearts" },
        { rank: "Q", suit: "Diamonds" },
        { rank: "Q", suit: "Clubs" },
        { rank: "5", suit: "Spades" },
        { rank: "2", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.THREE_OF_A_KIND);
      expect(result.handName).toBe("Three of a Kind");
    });

    test("should detect Three of a Kind with high kicker", () => {
      const hand = [
        { rank: "3", suit: "Hearts" },
        { rank: "3", suit: "Diamonds" },
        { rank: "3", suit: "Clubs" },
        { rank: "A", suit: "Spades" },
        { rank: "K", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.THREE_OF_A_KIND);
    });
  });

  describe("Two Pair Detection", () => {
    test("should detect Two Pair (assessment example)", () => {
      const hand = [
        { rank: "A", suit: "Spades" },
        { rank: "10", suit: "Clubs" },
        { rank: "10", suit: "Hearts" },
        { rank: "3", suit: "Diamonds" },
        { rank: "3", suit: "Spades" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.TWO_PAIR);
      expect(result.handName).toBe("Two Pair");
    });

    test("should detect Two Pair (high pairs)", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Diamonds" },
        { rank: "K", suit: "Clubs" },
        { rank: "K", suit: "Spades" },
        { rank: "5", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.TWO_PAIR);
    });

    test("should detect Two Pair (low pairs)", () => {
      const hand = [
        { rank: "2", suit: "Hearts" },
        { rank: "2", suit: "Clubs" },
        { rank: "3", suit: "Diamonds" },
        { rank: "3", suit: "Spades" },
        { rank: "K", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.TWO_PAIR);
    });
  });

  describe("One Pair Detection", () => {
    test("should detect One Pair", () => {
      const hand = [
        { rank: "10", suit: "Spades" },
        { rank: "10", suit: "Hearts" },
        { rank: "8", suit: "Spades" },
        { rank: "7", suit: "Hearts" },
        { rank: "4", suit: "Clubs" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ONE_PAIR);
      expect(result.handName).toBe("One Pair");
    });

    test("should detect One Pair (high pair)", () => {
      const hand = [
        { rank: "A", suit: "Hearts" },
        { rank: "A", suit: "Diamonds" },
        { rank: "K", suit: "Clubs" },
        { rank: "Q", suit: "Spades" },
        { rank: "J", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ONE_PAIR);
    });

    test("should detect One Pair (low pair)", () => {
      const hand = [
        { rank: "2", suit: "Hearts" },
        { rank: "2", suit: "Clubs" },
        { rank: "K", suit: "Diamonds" },
        { rank: "Q", suit: "Spades" },
        { rank: "J", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.ONE_PAIR);
    });
  });

  describe("High Card Detection", () => {
    test("should detect High Card", () => {
      const hand = [
        { rank: "K", suit: "Diamonds" },
        { rank: "Q", suit: "Diamonds" },
        { rank: "7", suit: "Spades" },
        { rank: "4", suit: "Spades" },
        { rank: "3", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.HIGH_CARD);
      expect(result.handName).toBe("High Card");
    });

    test("should detect High Card (Ace high)", () => {
      const hand = [
        { rank: "A", suit: "Spades" },
        { rank: "K", suit: "Diamonds" },
        { rank: "Q", suit: "Clubs" },
        { rank: "J", suit: "Hearts" },
        { rank: "9", suit: "Spades" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.HIGH_CARD);
    });

    test("should detect High Card (low cards)", () => {
      const hand = [
        { rank: "9", suit: "Hearts" },
        { rank: "7", suit: "Clubs" },
        { rank: "5", suit: "Diamonds" },
        { rank: "3", suit: "Spades" },
        { rank: "2", suit: "Hearts" }
      ];
      const result = evaluateHand(hand);
      expect(result.rank).toBe(HAND_RANKINGS.HIGH_CARD);
    });
  });
});

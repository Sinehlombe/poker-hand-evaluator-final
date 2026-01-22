const { evaluateHand, validateHand, HAND_RANKINGS } = require("../src/backend/services/handEvaluator");

describe("Hand Validation", () => {
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

  test("should reject hands with duplicate cards", () => {
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

  test("should accept valid hands", () => {
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
});

describe("Royal Flush Detection", () => {
  test("should detect Royal Flush", () => {
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
});

describe("Two Pair Detection", () => {
  test("should detect Two Pair", () => {
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
});

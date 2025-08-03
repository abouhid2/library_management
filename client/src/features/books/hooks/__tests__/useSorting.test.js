import { renderHook, act } from "@testing-library/react";
import useSorting from "../useSorting";

describe("useSorting", () => {
  const mockItems = [
    { id: 1, title: "Zebra Book", author: "Alice", genre: "Fiction", copies: 5 },
    { id: 2, title: "Apple Book", author: "Bob", genre: "Non-Fiction", copies: 3 },
    { id: 3, title: "Banana Book", author: "Charlie", genre: "Fiction", copies: 7 },
  ];

  describe("Initial State", () => {
    it("returns unsorted items when no sort field is provided", () => {
      const { result } = renderHook(() => useSorting(mockItems));

      expect(result.current.sortedItems).toEqual(mockItems);
      expect(result.current.sortField).toBeNull();
      expect(result.current.sortDirection).toBe("asc");
    });

    it("returns sorted items with default sort field", () => {
      const { result } = renderHook(() => useSorting(mockItems, "title", "asc"));

      expect(result.current.sortedItems[0].title).toBe("Apple Book");
      expect(result.current.sortedItems[1].title).toBe("Banana Book");
      expect(result.current.sortedItems[2].title).toBe("Zebra Book");
      expect(result.current.sortField).toBe("title");
      expect(result.current.sortDirection).toBe("asc");
    });
  });

  describe("Sorting Functionality", () => {
    it("sorts by title in ascending order", () => {
      const { result } = renderHook(() => useSorting(mockItems));

      act(() => {
        result.current.handleSortChange("title", "asc");
      });

      expect(result.current.sortedItems[0].title).toBe("Apple Book");
      expect(result.current.sortedItems[1].title).toBe("Banana Book");
      expect(result.current.sortedItems[2].title).toBe("Zebra Book");
    });

    it("sorts by title in descending order", () => {
      const { result } = renderHook(() => useSorting(mockItems));

      act(() => {
        result.current.handleSortChange("title", "desc");
      });

      expect(result.current.sortedItems[0].title).toBe("Zebra Book");
      expect(result.current.sortedItems[1].title).toBe("Banana Book");
      expect(result.current.sortedItems[2].title).toBe("Apple Book");
    });

    it("sorts by author in ascending order", () => {
      const { result } = renderHook(() => useSorting(mockItems));

      act(() => {
        result.current.handleSortChange("author", "asc");
      });

      expect(result.current.sortedItems[0].author).toBe("Alice");
      expect(result.current.sortedItems[1].author).toBe("Bob");
      expect(result.current.sortedItems[2].author).toBe("Charlie");
    });

    it("sorts by numeric values", () => {
      const { result } = renderHook(() => useSorting(mockItems));

      act(() => {
        result.current.handleSortChange("copies", "asc");
      });

      expect(result.current.sortedItems[0].copies).toBe(3);
      expect(result.current.sortedItems[1].copies).toBe(5);
      expect(result.current.sortedItems[2].copies).toBe(7);
    });
  });

  describe("Nested Object Sorting", () => {
    const nestedItems = [
      { id: 1, book: { title: "Zebra Book" }, user: { name: "Alice" } },
      { id: 2, book: { title: "Apple Book" }, user: { name: "Bob" } },
      { id: 3, book: { title: "Banana Book" }, user: { name: "Charlie" } },
    ];

    it("sorts by nested object properties", () => {
      const { result } = renderHook(() => useSorting(nestedItems));

      act(() => {
        result.current.handleSortChange("book.title", "asc");
      });

      expect(result.current.sortedItems[0].book.title).toBe("Apple Book");
      expect(result.current.sortedItems[1].book.title).toBe("Banana Book");
      expect(result.current.sortedItems[2].book.title).toBe("Zebra Book");
    });

    it("sorts by nested user properties", () => {
      const { result } = renderHook(() => useSorting(nestedItems));

      act(() => {
        result.current.handleSortChange("user.name", "asc");
      });

      expect(result.current.sortedItems[0].user.name).toBe("Alice");
      expect(result.current.sortedItems[1].user.name).toBe("Bob");
      expect(result.current.sortedItems[2].user.name).toBe("Charlie");
    });
  });

  describe("Edge Cases", () => {
    it("handles null items", () => {
      const { result } = renderHook(() => useSorting(null));

      expect(result.current.sortedItems).toBeNull();
    });

    it("handles empty array", () => {
      const { result } = renderHook(() => useSorting([]));

      expect(result.current.sortedItems).toEqual([]);
    });

    it("handles items with missing properties", () => {
      const itemsWithMissingProps = [
        { id: 1, title: "Book 1" },
        { id: 2, title: "Book 2", author: "Author" },
        { id: 3 },
      ];

      const { result } = renderHook(() => useSorting(itemsWithMissingProps));

      act(() => {
        result.current.handleSortChange("author", "asc");
      });

      expect(result.current.sortedItems).toHaveLength(3);
    });

    it("handles null/undefined values in properties", () => {
      const itemsWithNullProps = [
        { id: 1, title: "Book 1", author: null },
        { id: 2, title: "Book 2", author: "Author" },
        { id: 3, title: "Book 3", author: undefined },
      ];

      const { result } = renderHook(() => useSorting(itemsWithNullProps));

      act(() => {
        result.current.handleSortChange("author", "asc");
      });

      expect(result.current.sortedItems).toHaveLength(3);
    });
  });

  describe("Case Insensitive Sorting", () => {
    it("sorts case-insensitively", () => {
      const caseItems = [
        { id: 1, title: "zebra book" },
        { id: 2, title: "Apple Book" },
        { id: 3, title: "BANANA BOOK" },
      ];

      const { result } = renderHook(() => useSorting(caseItems));

      act(() => {
        result.current.handleSortChange("title", "asc");
      });

      expect(result.current.sortedItems[0].title).toBe("Apple Book");
      expect(result.current.sortedItems[1].title).toBe("BANANA BOOK");
      expect(result.current.sortedItems[2].title).toBe("zebra book");
    });
  });
}); 
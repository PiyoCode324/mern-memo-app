// hooks/utils/sortMemos.js

/**
 * Sorts memos by pin status, completion status, and creation date.
 *
 * Sorting rules:
 * - Pinned memos come first
 * - Incomplete memos come before completed ones
 * - Newer memos come before older ones (or the reverse, based on order)
 *
 * @param {Array} memosToSort - The array of memos to sort
 * @param {string} order - Sorting order: "newest" or "oldest"
 * @returns {Array} Sorted array of memos
 */
export const sortMemos = (memosToSort, order) => {
  // Create a shallow copy to avoid mutating the original array
  const sorted = [...memosToSort];

  sorted.sort((a, b) => {
    // Sort by pinned status (true comes before false)
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

    // Sort by completion status (incomplete comes before completed)
    if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;

    // Sort by creation date
    if (order === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (order === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);

    // If no sorting condition is met, keep the original order
    return 0;
  });

  return sorted;
};

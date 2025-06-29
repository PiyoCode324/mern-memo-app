import { useMemo } from "react";
import { sortMemos } from "./utils/sortMemos";

export const useFilteredMemos = (
  memos,
  searchQuery,
  filterCategory,
  sortOrder
) => {
  // Step 1: Filter memos based on search keyword and selected category
  const filteredMemos = useMemo(() => {
    return memos.filter((memo) => {
      // Check if the title or content includes the search keyword (case-insensitive)
      const matchesSearch =
        memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if the category matches (if a filter is applied)
      const matchesCategory = filterCategory
        ? memo.category === filterCategory
        : true;

      // Return memos that match both the search query and the selected category
      return matchesSearch && matchesCategory;
    });
  }, [memos, searchQuery, filterCategory]);

  // Step 2: Sort the filtered memos based on the selected order
  const sortedAndFilteredMemos = useMemo(() => {
    return sortMemos(filteredMemos, sortOrder);
  }, [filteredMemos, sortOrder]);

  // Return both filtered and sorted memos
  return { filteredMemos, sortedAndFilteredMemos };
};

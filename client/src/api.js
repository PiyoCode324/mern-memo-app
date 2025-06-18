export async function fetchMemos() {
  try {
    // Fetch memos data from the API
    const res = await fetch('/api/memos');
    // Throw an error if the response is not OK
    if (!res.ok) throw new Error('Failed to fetch memos data');
    // Parse the response JSON
    const data = await res.json();
    // Return the memos array
    return data.memos;
  } catch (err) {
    // Log any errors to the console
    console.error(err);
    // Return an empty array if an error occurs
    return [];
  }
}

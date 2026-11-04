import { tavily as Tavily } from "@tavily/core";

export const searchinternet = async ({ query }) => {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn("TAVILY_API_KEY not configured. Skipping web search.");
      return JSON.stringify({ message: "Web search unavailable (API key not set)." });
    }
    const tavily = Tavily({ apiKey });
    const result = await tavily.search(query, {
      maxResults: 5,
      searchDepth: "advanced",
    });
    return JSON.stringify(result);
  } catch (error) {
    console.error("Tavily search error:", error);
    return JSON.stringify({ error: error.message || "Failed to search the internet" });
  }
};

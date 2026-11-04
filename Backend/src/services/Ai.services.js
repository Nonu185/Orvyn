
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as z from "zod";
import { searchinternet } from "./Internet.service.js";

let geminimodel = null;
let agent = null;

function getGeminiModel() {
  if (!geminimodel) {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing GOOGLE_API_KEY. Please set GOOGLE_API_KEY in your Render environment variables."
      );
    }
    geminimodel = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: apiKey,
    });
  }
  return geminimodel;
}

function getAgent() {
  if (!agent) {
    const model = getGeminiModel();
    const searchinternettool = tool(searchinternet, {
      name: "searchinternet",
      description: "use this tool to search the internet for latest information",
      schema: z.object({
        query: z.string().describe("the query to search on the internet"),
      }),
    });

    agent = createReactAgent({
      llm: model,
      tools: [searchinternettool],
    });
  }
  return agent;
}

// chat response generation
export async function generateResponse(messages) {
  try {
    const currentAgent = getAgent();
    const formattedMessages = messages
      .map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role === "AI") {
          return new AIMessage(msg.content);
        }
        return null;
      })
      .filter(Boolean);

    const response = await currentAgent.invoke({
      messages: formattedMessages,
    });
    const lastMsg = response.messages[response.messages.length - 1];
    return typeof lastMsg.content === "string"
      ? lastMsg.content
      : JSON.stringify(lastMsg.content);
  } catch (err) {
    console.error("AI generateResponse error:", err);
    throw err;
  }
}

// chat title generation
export async function generatechatTitle(message) {
  try {
    const model = getGeminiModel();
    const response = await model.invoke([
      new SystemMessage(
        `Don't use quotes while generating the title. You are a helpful assistant that generates concise titles for chat conversations. You must generate a title in 2-4 words.`
      ),
      new HumanMessage(`Generate title for the chat conversation: ${message}`),
    ]);
    return typeof response.content === "string"
      ? response.content.replace(/["']/g, "").trim()
      : "New Chat";
  } catch (error) {
    console.warn("Failed to generate AI title, using fallback:", error.message);
    const words = message.trim().split(/\s+/).slice(0, 4).join(" ");
    return words || "New Chat";
  }
}

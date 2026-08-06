import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage,SystemMessage,AIMessage,} from "@langchain/core/messages"
import { ChatMistralAI, } from "@langchain/mistralai"
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as z from 'zod';
import { searchinternet } from "./Internet.service.js";

//models
const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY
});
const mistralmodel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
})

//tools
const searchinternettool = tool(searchinternet,{
  name:"searchinternet",
  description:"use this tool to search the internet for latest information",
  schema:z.object({
    query:z.string().describe("the query to search on the internet")
  })
})

//agents
const agent = createReactAgent({
  llm: geminimodel,
  tools:[searchinternettool],
})

//chat response generation
export async function generateResponse(messages){
  const response = await agent.invoke({
    messages:[
      ...messages.map(msg=>{
        if(msg.role === "user"){
          return new HumanMessage(msg.content);
        }
        else if(msg.role === "AI"){
          return new AIMessage(msg.content);
        }
      })
    ]
  })
  const lastMsg = response.messages[response.messages.length - 1];
  return lastMsg.content;
}
//chat title generation
export async function generatechatTitle(message){
  const response = await mistralmodel.invoke([
    new SystemMessage(` dont use " " this quates while generating the title you are a helpful assistant that generates concise titles for the chat conversations
      User will provide the first message of the conversation.
      You have to generate a title for the conversation in 2-4 words `),
    new HumanMessage(`generate title for the chat conversation : ${message}`),
  ]);
  return response.text;
}
    


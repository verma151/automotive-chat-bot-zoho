import Groq from "groq-sdk";

import { executeTool, toolDefinitions } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type GroqMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
};

export async function runAgent(
  message: string,
  history: any[] = []
) {
  // Convert any old Gemini history into Groq-compatible history
  const normalizedHistory: GroqMessage[] = history
    .filter(
      (msg) =>
        msg.role === "user" ||
        msg.role === "assistant"
    )
    .map((msg) => ({
      role: msg.role,
      content:
        msg.content ??
        msg.parts
          ?.map((part: any) => part.text || "")
          .join("") ??
        "",
    }));

  const messages: GroqMessage[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },

    ...normalizedHistory,

    {
      role: "user",
      content: message,
    },
  ];

  while (true) {
    console.log(
      "Sending messages to Groq:",
      JSON.stringify(messages, null, 2)
    );

    const completion =
      await groq.chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "openai/gpt-oss-120b",

        messages,

        tools: toolDefinitions,

        tool_choice: "auto",

        temperature: 0.2,
      });

    const assistantMessage =
      completion.choices[0].message;

    console.log(
      "Groq response:",
      JSON.stringify(
        assistantMessage,
        null,
        2
      )
    );

    /*
     * No tool call means Groq has produced
     * the final answer.
     */
    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {
      return assistantMessage.content || "";
    }

    /*
     * IMPORTANT:
     * Explicitly construct the assistant message.
     * Don't push assistantMessage directly.
     */
    messages.push({
      role: "assistant",
      content: assistantMessage.content || null,
      tool_calls: assistantMessage.tool_calls,
    });

    /*
     * Execute all requested tools.
     */
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;

      let args: any;

      try {
        args = JSON.parse(
          toolCall.function.arguments
        );
      } catch (error) {
        console.error(
          "Invalid tool arguments:",
          toolCall.function.arguments
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            success: false,
            error: "Invalid tool arguments",
          }),
        });

        continue;
      }

      console.log(
        "Tool requested:",
        toolName
      );

      console.log(
        "Arguments:",
        args
      );

      try {
        const result = await executeTool(
          toolName,
          args
        );

        console.log(
          "Tool result:",
          result
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      } catch (error) {
        console.error(
          `Tool ${toolName} failed:`,
          error
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            success: false,
            error: `Tool ${toolName} failed`,
          }),
        });
      }
    }
  }
}
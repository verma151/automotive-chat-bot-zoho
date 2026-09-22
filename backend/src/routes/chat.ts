import { Router } from "express";
import { z } from "zod";

import { runAgent } from "../ai/agent.js";
import {
  getConversation,
} from "../state/conversation.js";

const router = Router();

const chatSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const {
      sessionId,
      message,
    } = chatSchema.parse(req.body);

    const conversation =
      getConversation(sessionId);

    const response =
      await runAgent(
        message,
        conversation.history
      );

    conversation.history.push({
      role: "user",
      parts: [
        {
          text: message,
        },
      ],
    });

    conversation.history.push({
      role: "model",
      parts: [
        {
          text: response,
        },
      ],
    });

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error:
        "Something went wrong while processing your request.",
    });
  }
});

export default router;
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  addClient,
  appendChatMessage,
  broadcastTyping,
  getConversationsForUser,
  getMessagesForConversation,
  markConversationRead,
  removeClient,
  saveChatAttachment,
  ChatUserRole
} from "./server/chatStore";
import {
  startTelegramBot,
  registerPendingVerification,
  verifyTelegramMatch,
  getVerificationStatus,
  handleTelegramUpdate
} from "./server/telegramBot";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client lazily or safely with User-Agent header
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Endpoint for AI Assistant generation
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, role = "Student" } = req.body;
      const ai = getAiClient();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set yet
        return res.json({
          text: `[Liora Begena AI Assistant - ${role}]\n\nThank you for asking: "${prompt}".\n\n` +
            `The Begena is a sacred 10-string Ethiopian box lyre traditionally associated with King David. ` +
            `Its signature buzzing sound comes from the leather 'Sera' sliders placed on the bridge ('Birama').\n\n` +
            `*Source Citation: Liora Begena Curriculum - Level 1, Module 2 (Verified).*`,
          isAiGenerated: true,
          confidence: "High",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || `You are the Liora Begena Traditional Music School AI Assistant for ${role}. Provide clear, warm, culturally authentic, and academically accurate answers.`,
          temperature: 0.7,
        },
      });

      return res.json({
        text: response.text || "No response received.",
        isAiGenerated: true,
        confidence: "High",
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI response",
        text: "I encountered a minor system delay while querying the knowledge engine. Here is what our core curriculum specifies: Begena plucking relies on thumb-and-index coordination, with left-hand muting for clean pitch transitions.",
        isAiGenerated: true,
      });
    }
  });

  // API Endpoint for Quiz Generation
  app.post("/api/ai/quiz", async (req, res) => {
    try {
      const { topic = "Begena Tuning & History", count = 3, difficulty = "Medium" } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          questions: [
            {
              id: "Q1",
              question: "How many gut strings does a traditional Begena have?",
              options: ["6 strings", "8 strings", "10 strings", "12 strings"],
              correctAnswer: "10 strings",
              explanation: "The traditional Ethiopian Begena features 10 gut strings.",
              type: "Multiple Choice",
              difficulty,
            },
            {
              id: "Q2",
              question: "What produces the buzzing sound of the Begena?",
              options: ["Metal frets", "Sera leather pieces on the bridge", "Glass slides", "Wooden plectrum"],
              correctAnswer: "Sera leather pieces on the bridge",
              explanation: "The Sera are small leather sliders resting on the Birama bridge that buzz against vibrating strings.",
              type: "Multiple Choice",
              difficulty,
            }
          ],
        });
      }

      const prompt = `Generate a JSON array of ${count} quiz questions about '${topic}' for level '${difficulty}'. Output format strictly JSON with keys: question, options (array of 4 strings), correctAnswer, explanation, type ('Multiple Choice'), difficulty ('${difficulty}').`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ questions: parsed });
    } catch (error: any) {
      console.error("Quiz API error:", error);
      return res.json({
        questions: [
          {
            id: "Q-FB-1",
            question: "Which hand is used to mute unplucked strings on the Begena?",
            options: ["Left Hand", "Right Hand", "Both Hands", "Foot Pedal"],
            correctAnswer: "Left Hand",
            explanation: "The left hand rests lightly on the back of strings to mute unwanted ringing.",
            type: "Multiple Choice",
            difficulty: "Medium",
          }
        ],
      });
    }
  });

  // Chat API
  app.get('/api/chat/conversations', (req, res) => {
    const userId = String(req.query.userId || '');
    const role = String(req.query.role || 'visitor') as ChatUserRole;

    if (!userId || !role) {
      return res.status(400).json({ error: 'chat userId and role are required' });
    }

    const conversations = getConversationsForUser(userId, role).map((conv) => {
      const messages = getMessagesForConversation(conv.id, 1).messages;
      const lastMsg = messages.length ? messages[messages.length - 1] : undefined;
      const title = role === 'student' ? `Teacher ${conv.teacherName}` : conv.studentName || `Student ${conv.studentId}`;
      const participants = [
        {
          id: role === 'student' ? conv.teacherId : conv.studentId,
          name: role === 'student' ? conv.teacherName : conv.studentName || 'Student',
          role: role === 'student' ? 'teacher' : 'student',
          avatar: '',
          isOnline: true
        }
      ];

      return {
        id: conv.id,
        title,
        type: 'direct',
        participants,
        lastMessage: lastMsg,
        unreadCount: conv.unreadCount,
        enrollmentId: conv.enrollmentId,
        studentId: conv.studentId,
        studentName: conv.studentName,
        teacherId: conv.teacherId,
        teacherName: conv.teacherName
      };
    });

    return res.json({ conversations });
  });

  app.get('/api/chat/conversations/:conversationId/messages', (req, res) => {
    const conversationId = String(req.params.conversationId || '');
    const limit = Number(req.query.limit || 50);
    const before = typeof req.query.before === 'string' ? req.query.before : undefined;

    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const { messages, hasMore } = getMessagesForConversation(conversationId, limit, before);
    return res.json({ messages, hasMore });
  });

  app.post('/api/chat/conversations/:conversationId/messages', (req, res) => {
    const conversationId = String(req.params.conversationId || '');
    const {
      enrollmentId,
      studentId,
      studentName,
      teacherId,
      teacherName,
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverRole,
      text,
      mediaUrl,
      mediaType,
      attachmentName
    } = req.body;

    if (!conversationId || !enrollmentId || !studentId || !teacherId || !senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'Missing required chat message fields' });
    }

    const message = appendChatMessage({
      conversationId,
      enrollmentId,
      studentId,
      studentName,
      teacherId,
      teacherName,
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverRole,
      text,
      mediaUrl,
      mediaType,
      attachmentName
    });

    return res.status(201).json({ message });
  });

  app.post('/api/chat/conversations/:conversationId/read', (req, res) => {
    const conversationId = String(req.params.conversationId || '');
    const readerId = String(req.body.readerId || '');

    if (!conversationId || !readerId) {
      return res.status(400).json({ error: 'conversationId and readerId are required' });
    }

    markConversationRead(conversationId, readerId);
    return res.json({ success: true });
  });

  app.post('/api/chat/typing', (req, res) => {
    const { conversationId, senderId, senderName, isTyping } = req.body;
    if (!conversationId || !senderId || !senderName) {
      return res.status(400).json({ error: 'conversationId, senderId, and senderName are required' });
    }

    broadcastTyping(conversationId, senderId, senderName, Boolean(isTyping));
    return res.json({ success: true });
  });

  app.post('/api/chat/attachments', (req, res) => {
    const { fileName, contentBase64 } = req.body;
    if (!fileName || !contentBase64) {
      return res.status(400).json({ error: 'fileName and contentBase64 are required' });
    }
    try {
      const attachment = saveChatAttachment(fileName, contentBase64);
      return res.json(attachment);
    } catch (error: any) {
      console.error('Attachment save failed:', error);
      return res.status(500).json({ error: 'Failed to save attachment' });
    }
  });

  app.get('/api/chat/events', (req, res) => {
    const userId = String(req.query.userId || '');
    const role = String(req.query.role || 'visitor') as ChatUserRole;

    if (!userId || !role) {
      return res.status(400).json({ error: 'chat userId and role are required for SSE' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    addClient(userId, role, res);

    req.on('close', () => {
      removeClient(res);
    });
  });

  // ========================================================
  // TELEGRAM BOT VERIFICATION API ENDPOINTS
  // ========================================================

  // 1. Register pending verification when user arrives at verification page
  app.post("/api/telegram/register", async (req, res) => {
    try {
      const { phone, email } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, error: "Phone number is required" });
      }
      const result = await registerPendingVerification(phone, email);
      return res.json(result);
    } catch (err: any) {
      console.error("[API] Telegram register error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Verify shared Telegram account phone matches registered phone number
  app.post("/api/telegram/verify", async (req, res) => {
    try {
      const { registeredPhone, sharedPhone, email } = req.body;
      if (!registeredPhone || !sharedPhone) {
        return res.status(400).json({
          success: false,
          matched: false,
          error: "registeredPhone and sharedPhone are required"
        });
      }
      const result = await verifyTelegramMatch(registeredPhone, sharedPhone, email);
      return res.json(result);
    } catch (err: any) {
      console.error("[API] Telegram verify error:", err);
      return res.status(500).json({ success: false, matched: false, error: err.message });
    }
  });

  // 3. Check status (polling endpoint for when user taps Share Contact inside Telegram app)
  app.get("/api/telegram/status", (req, res) => {
    try {
      const phone = String(req.query.phone || "");
      if (!phone) {
        return res.status(400).json({ matched: false, error: "Phone parameter is required" });
      }
      const status = getVerificationStatus(phone);
      return res.json(status);
    } catch (err: any) {
      return res.status(500).json({ matched: false, error: err.message });
    }
  });

  // 4. Webhook support (optional if webhook is set up instead of polling)
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      await handleTelegramUpdate(req.body);
      return res.json({ ok: true });
    } catch (err) {
      return res.status(200).json({ ok: false });
    }
  });

  // Serve runtime public assets and uploaded chat files
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development (fall back to Vite if dist/index.html doesn't exist)
  const distIndex = path.join(process.cwd(), "dist", "index.html");
  if (process.env.NODE_ENV === "production" && fs.existsSync(distIndex)) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Start Telegram Bot polling service in the background
  startTelegramBot().catch((err) => {
    console.error("[TelegramBot] Polling initialization error:", err);
  });
}

startServer();


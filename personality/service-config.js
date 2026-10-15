// Public endpoint only: never place API keys or credentials in this file.
// Switch to an approved proxy implementing POST { query, systemPrompt } and
// returning { candidates: [{ content: { parts: [{ text }] } }] }.
// Set to an empty string to pause remote chat; diagnosis/recommended answers remain available.
window.LETEON_PERSONALITY_CHAT_URL =
  'https://algebra2-gemini-proxy-v2-243382036810.asia-northeast3.run.app/identify-chat';

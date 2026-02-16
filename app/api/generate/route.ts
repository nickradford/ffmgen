import { streamText, convertToModelMessages } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4.1-mini",
    system: `You are an expert ffmpeg command generator. Given a natural language description of a video/audio processing task, generate the exact ffmpeg command(s) needed.

Rules:
- Always use "input.mp4" as the default input filename unless a specific format is mentioned
- Always use "output" as the base output filename with the appropriate extension
- Provide ONLY the ffmpeg command(s), one per line
- Do NOT include any explanation, markdown formatting, or code blocks
- Do NOT wrap in backticks or any other formatting
- If multiple steps are needed, put each command on its own line
- Use best practices and optimal encoding settings
- For compression, use CRF values and appropriate presets
- For format conversion, use appropriate codecs
- Include common useful flags like -y (overwrite) when appropriate`,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
    temperature: 0.2,
  })

  return result.toUIMessageStreamResponse()
}

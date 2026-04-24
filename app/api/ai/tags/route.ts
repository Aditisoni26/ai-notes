import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: `Generate 5 short relevant tags for this text (comma separated):\n\n${text}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Notes App",
        },
      }
    )

    return NextResponse.json({
      result: response.data.choices[0].message.content,
    })

  } catch (error: unknown) {

    if (axios.isAxiosError(error)) {
      console.error("AI tags error:", error.response?.data || error.message)
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message)
    } else {
      console.error("Unknown error:", error)
    }

    return NextResponse.json(
      { error: "Tag generation failed" },
      { status: 500 }
    )
  }
}
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
            content: `Summarize this text:\n${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    return NextResponse.json({
      result: response.data.choices[0].message.content
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "AI failed" }, { status: 500 })
  }
}
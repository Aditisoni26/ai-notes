import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  try {
    const existing = await db.user.findUnique({
      where: { username }
    })

    if (existing) {
      return Response.json({ error: "User exists" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        username,
        password: hashed
      }
    })

    return Response.json(user)
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Signup failed" }, { status: 500 })
  }
}
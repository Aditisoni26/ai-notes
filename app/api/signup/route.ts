import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // 🔴 VALIDATION
    if (!username || !email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🔴 CHECK USERNAME
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return Response.json({ error: "Username already exists" }, { status: 400 });
    }

    // 🔴 CHECK EMAIL
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email, // ✅ REAL EMAIL NOW
        password: hashed
      }
    });

    return Response.json(user);

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}
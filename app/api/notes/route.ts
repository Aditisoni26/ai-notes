import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const note = await db.note.create({
      data: {
        title: body.title,
        content: body.content,
        tags: Array.isArray(body.tags) ? body.tags : [],
        userId: session.user.id, // 🔥 REQUIRED
      },
    });

    return Response.json(note);
  } catch (err) {
    console.error("Create error:", err);
    return Response.json({ error: "Create failed" }, { status: 500 });
  }
}


export async function GET() {
  const session = await getServerSession(authOptions); // 🔥 FIXED

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notes = await db.note.findMany({
      where: {
        userId: session.user.id, // 🔥 USER FILTER
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(notes);
  } catch (err) {
    console.error("Fetch error:", err);
    return Response.json({ error: "Fetch failed" }, { status: 500 });
  }
}

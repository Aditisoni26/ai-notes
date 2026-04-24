import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  params: { id: string };
}

// ✅ UPDATE NOTE (SECURE)
export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  try {
    const note = await db.note.update({
      where: {
        id, // must be unique
      },
      data: {
        title: body.title,
        content: body.content,
        tags: Array.isArray(body.tags) ? body.tags : [],
      },
    });

    // 🔥 EXTRA SECURITY CHECK
    if (note.userId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(note);
  } catch (err) {
    console.error("Update error:", err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE NOTE (SECURE)
export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const note = await db.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== session.user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await db.note.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
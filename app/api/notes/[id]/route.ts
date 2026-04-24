import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface Params {
  params: Promise<{ id: string }>
}

// ✅ UPDATE NOTE
export async function PUT(req: Request, context: Params) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const body = await req.json()

  try {
    // 🔥 STEP 1: Check ownership
    const existing = await db.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    // 🔥 STEP 2: Update
    const note = await db.note.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        tags: Array.isArray(body.tags) ? body.tags : []
      }
    })

    return Response.json(note)

  } catch (err) {
    console.error("Update error:", err)
    return Response.json({ error: "Update failed" }, { status: 500 })
  }
}

// ✅ DELETE NOTE
export async function DELETE(_: Request, context: Params) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const existing = await db.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    await db.note.delete({
      where: { id }
    })

    return Response.json({ success: true })

  } catch (err) {
    console.error("Delete error:", err)
    return Response.json({ error: "Delete failed" }, { status: 500 })
  }
}
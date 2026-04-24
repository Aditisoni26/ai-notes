"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// UI
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ProfileMenu from "@/components/ProfileMenu";
import ThemeToggle from "@/components/ThemeToggle";

type Note = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
};

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  // ✅ FIXED: separate loading state
  const [loadingType, setLoadingType] = useState<
    "summary" | "improve" | "tags" | null
  >(null);

  const fetchNotes = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await axios.get("/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    let isMounted = true;

    if (status === "authenticated") {
      axios.get("/api/notes").then((res) => {
        if (isMounted) setNotes(res.data);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  // CREATE / UPDATE
  const createNote = async () => {
    if (!title || !content) return;

    const payload = { title, content, tags };

    try {
      if (editingId) {
        await axios.put(`/api/notes/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("/api/notes", payload);
      }

      setTitle("");
      setContent("");
      setSummary("");
      setTags([]);

      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // 🤖 AI FEATURES

  const summarizeNote = async () => {
    if (!content) return;

    setLoadingType("summary");

    try {
      const res = await axios.post("/api/ai/summary", {
        text: content,
      });
      setSummary(res.data.result);
    } catch (err) {
      console.error("Summary failed:", err);
    } finally {
      setLoadingType(null);
    }
  };

  const improveNote = async () => {
    if (!content) return;

    setLoadingType("improve");

    try {
      const res = await axios.post("/api/ai/improve", {
        text: content,
      });
      setContent(res.data.result);
    } catch (err) {
      console.error("Improve failed:", err);
    } finally {
      setLoadingType(null);
    }
  };

  const generateTags = async () => {
    if (!content) return;

    setLoadingType("tags");

    try {
      const res = await axios.post("/api/ai/tags", {
        text: content,
      });

      const parsed = res.data.result
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      setTags(parsed);
    } catch (err) {
      console.error("Tag failed:", err);
    } finally {
      setLoadingType(null);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-pulse text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">AI Notes</h1>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </header>

        {/* EDITOR */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Note" : "New Note"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {loadingType === "tags" && (
              <p className="text-pink-500 animate-pulse">
                Generating tags...
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {tags.map((t, i) => (
                <Badge key={i}>#{t}</Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 flex-wrap">

            {/* SAVE */}
            <Button onClick={createNote}>
              {editingId ? "Update" : "Save"}
            </Button>

            {/* SUMMARIZE */}
            <Button
              disabled={loadingType !== null}
              className="bg-purple-600 text-white flex items-center gap-2"
              onClick={summarizeNote}
            >
              {loadingType === "summary" && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loadingType === "summary"
                ? "Summarizing..."
                : "Summarize"}
            </Button>

            {/* IMPROVE */}
            <Button
              disabled={loadingType !== null}
              className="bg-indigo-600 text-white flex items-center gap-2"
              onClick={improveNote}
            >
              {loadingType === "improve" && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loadingType === "improve"
                ? "Improving..."
                : "Improve"}
            </Button>

            {/* TAGS */}
            <Button
              disabled={loadingType !== null}
              className="bg-pink-600 text-white flex items-center gap-2"
              onClick={generateTags}
            >
              {loadingType === "tags" && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loadingType === "tags"
                ? "Generating..."
                : "Auto-Tag"}
            </Button>
          </CardFooter>
        </Card>

        {/* AI PANEL */}
        <Card className="mb-6">
          <CardContent>
            {loadingType === "summary" ? (
              <p className="text-blue-500 animate-pulse">
                Generating summary...
              </p>
            ) : summary ? (
              <p className="italic">{summary}</p>
            ) : (
              <p className="text-gray-400">
                AI results will appear here
              </p>
            )}
          </CardContent>
        </Card>

        {/* SEARCH */}
        <Input
          placeholder="Search..."
          className="mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* NOTES */}
        <div className="grid md:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-400">
                  {note.content}
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {note.tags?.map((t, i) => (
                    <Badge key={i}>#{t}</Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="link"
                  onClick={() => {
                    setTitle(note.title);
                    setContent(note.content);
                    setTags(note.tags || []);
                    setEditingId(note.id);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="link"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// shadcn/ui
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

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
      axios
        .get("/api/notes")
        .then((res) => {
          if (isMounted) setNotes(res.data);
        })
        .catch(console.error);
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

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

  const summarizeNote = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/summary", {
        text: content,
      });
      setSummary(res.data.result);
    } catch (err) {
      console.error("Summary failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const improveNote = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/improve", {
        text: content,
      });
      setContent(res.data.result);
    } catch (err) {
      console.error("Improvement failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateTags = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/tags", {
        text: content,
      });

      const parsedTags = res.data.result
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      setTags(parsedTags);
    } catch (err) {
      console.error("Tag generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              🧠 <span className="text-blue-500">AI</span> Notes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Your intelligent second brain.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ✅ USER PROFILE */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ProfileMenu />
            </div>
          </div>
        </header>
        {/* EDITOR */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Note" : "New Entry"}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2 flex-wrap">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={createNote}
              >
                {editingId ? "Update" : "Save"}
              </Button>

              <Button
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={summarizeNote}
              >
                {loading ? "Summarizing..." : "Summarize"}
              </Button>

              <Button
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={improveNote}
              >
                {loading ? "Improving..." : "Improve"}
              </Button>

              <Button
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={generateTags}
              >
                {loading ? "Generating..." : "Auto-Tag"}
              </Button>
            </CardFooter>
          </Card>

          {/* AI PANEL */}
          <Card className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-xl">
            <CardHeader>
              <CardTitle>✨ AI Insights</CardTitle>
            </CardHeader>

            <CardContent>
              {summary ? (
                <p className="italic text-gray-600 dark:text-gray-300">
                  {summary}
                </p>
              ) : (
                <p className="text-gray-400">AI results will appear here</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SEARCH */}
        <Input
          className="mb-6"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* NOTES */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-4">
                  {note.content}
                </p>

                {/* TAGS */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {note.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  className="text-blue-500"
                  onClick={() => {
                    setTitle(note.title);
                    setContent(note.content);
                    setEditingId(note.id);
                    setTags(note.tags || []);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  className="text-red-500"
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

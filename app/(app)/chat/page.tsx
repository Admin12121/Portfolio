"use client";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const STORAGE_KEY = "chat.displayName";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

export default Page;

function Lobby() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const [displayName, setDisplayName] = useState("");
  const [rememberName, setRememberName] = useState(true);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDisplayName(saved);
    } catch {}
  }, []);

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      setAttemptedSubmit(true);
      const name = displayName.trim();
      if (!name) return;

      const res = await client.room.create.post();
      if (res.status === 200) {
        if (rememberName) {
          try {
            localStorage.setItem(STORAGE_KEY, name);
          } catch {}
        }
        router.push(`/${res.data?.roomId}`);
      }
    },
  });

  const showValidationError = attemptedSubmit && !displayName.trim();

  return (
    <main className="flex h-[calc(100dvh-160px)] border-x md:max-w-3xl mx-auto w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
            <p className="text-zinc-500 text-xs mt-1">All messages were permanently deleted.</p>
          </div>
        )}
        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
            <p className="text-zinc-500 text-xs mt-1">This room may have expired or never existed.</p>
          </div>
        )}
        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM FULL</p>
            <p className="text-zinc-500 text-xs mt-1">This room is at maximum capacity.</p>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">{">_ "}private_chat</h1>
          <p className="text-zinc-500 text-sm">A private, self-destructing chat room.</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500">Display Name</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter a name to display in chat"
                  className={`flex-1 bg-zinc-950 border p-3 text-sm ${
                    showValidationError ? "border-red-600" : "border-zinc-800"
                  } text-zinc-200 placeholder:text-zinc-600`}
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <input
                  id="rememberName"
                  type="checkbox"
                  checked={rememberName}
                  onChange={(e) => setRememberName(e.target.checked)}
                  className="h-3 w-3 accent-green-600"
                />
                <label htmlFor="rememberName">Remember this name on this device</label>
              </div>
              {showValidationError && (
                <p className="text-[11px] text-red-500 mt-1">Display name is required to create a room.</p>
              )}
            </div>

            <button
              onClick={() => createRoom()}
              disabled={isPending}
              className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CREATE SECURE ROOM
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
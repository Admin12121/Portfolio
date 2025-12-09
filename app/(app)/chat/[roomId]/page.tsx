"use client"

import { useUsername } from "@/hooks/use-username"
import { client } from "@/lib/client"
import { useRealtime } from "@/lib/realtime-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "chat.displayName"
const HEARTBEAT_INTERVAL_MS = 15_000 // 15s

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

type MemberView = {
  displayName?: string
  username?: string
  avatar?: string
  token?: string // only present for admin, used for kick
  active?: boolean
}

const Page = () => {
  const params = useParams()
  const roomId = params.roomId as string

  const router = useRouter()

  const { username } = useUsername()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const [displayNameInput, setDisplayNameInput] = useState("")
  const [mustSetName, setMustSetName] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [members, setMembers] = useState<MemberView[]>([])
  const [copyStatus, setCopyStatus] = useState("COPY")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Name enforcement + profile sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const name = saved?.trim()
      if (!name) {
        setMustSetName(true)
      } else {
        setDisplayNameInput(name)
        client.room.profile
          .post({ displayName: name, username }, { query: { roomId } })
          .catch(() => {})
      }
    } catch {}
  }, [roomId, username])

  // Admin status
  useEffect(() => {
    (async () => {
      const res = await client.room["is-admin"].get({ query: { roomId } })
      setIsAdmin(!!res.data?.isAdmin)
    })().catch(() => {})
  }, [roomId])

  // Members list
  const fetchMembers = async () => {
    const res = await client.room.members.get({ query: { roomId } })
    setMembers(res.data?.members || [])
  }
  useEffect(() => {
    fetchMembers().catch(() => {})
  }, [roomId])

  // Heartbeat: ping presence
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    const ping = async () => {
      try {
        await client.room.ping.post(null, { query: { roomId } })
        // After a ping, refresh members to update active flags
        fetchMembers().catch(() => {})
      } catch {}
    }

    // Start heartbeat after name is set
    if (!mustSetName) {
      ping()
      interval = setInterval(ping, HEARTBEAT_INTERVAL_MS)
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        ping()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    // Best-effort leave on unload
    const handleBeforeUnload = () => {
      // Fire and forget; the server may not always receive it
      client.room.leave.post(null, { query: { roomId } }).catch(() => {})
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      if (interval) clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [roomId, mustSetName])

  // TTL
  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } })
      return res.data
    },
  })

  useEffect(() => {
    if (ttlData?.ttl !== undefined) setTimeRemaining(ttlData.ttl)
  }, [ttlData])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return
    if (timeRemaining === 0) {
      router.push("/?destroyed=true")
      return
    }
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeRemaining, router])

  // Messages
  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } })
      return res.data
    },
  })

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post({ sender: username, text }, { query: { roomId } })
      setInput("")
    },
  })

  // Realtime
  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy", "chat.join", "chat.leave"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch()
      }
      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
      if (event === "chat.join" || event === "chat.leave") {
        fetchMembers().catch(() => {})
      }
    },
  })

  // Admin destroy
  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } })
    },
  })

  // User leave
  const { mutate: leaveRoom, isPending: leaving } = useMutation({
    mutationFn: async () => {
      await client.room.leave.post(null, { query: { roomId } })
      router.push("/?left=true")
    },
  })

  // Admin kick user
  const { mutate: kickUser, isPending: kicking } = useMutation({
    mutationFn: async (targetToken: string) => {
      await client.room.kick.post({ targetToken }, { query: { roomId } })
      fetchMembers().catch(() => {})
    },
  })

  const saveDisplayName = async () => {
    const name = displayNameInput.trim()
    if (!name) return
    await client.room.profile.post({ displayName: name, username }, { query: { roomId } })
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {}
    setMustSetName(false)
    fetchMembers().catch(() => {})
  }

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopyStatus("COPIED!")
    setTimeout(() => setCopyStatus("COPY"), 2000)
  }

  if (mustSetName) {
    return (
      <main className="flex h-[calc(100dvh-160px)] border-x md:max-w-3xl mx-auto w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-green-500">{">_ "}private_chat</h1>
            <p className="text-zinc-500 text-sm">Set a display name to join this room.</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center text-zinc-500">Display Name</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Enter a name to display in chat"
                    className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-200 placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <button
                onClick={saveDisplayName}
                disabled={!displayNameInput.trim()}
                className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                JOIN ROOM
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col h-[90dvh] max-h-screen overflow-hidden border-x md:max-w-3xl mx-auto w-full">
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500 truncate">{roomId.slice(0,10) + "..."}</span>
              <button
                onClick={copyLink}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"
              }`}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          {/* Avatars with hover card: show names, active state, and kick if admin */}
          <div className="flex -space-x-2">
            {members.slice(0,5).map((m, i) => {
              const initials =
                (m.displayName || m.username || "?")
                  .split(" ")
                  .map(s => s[0]?.toUpperCase())
                  .slice(0,2)
                  .join("") || "?"
              return (
                <div key={i} className="relative group">
                  <div
                    data-slot="avatar"
                    className="h-6 w-6 rounded-full ring-2 ring-zinc-900 bg-zinc-700 flex items-center justify-center text-[10px] text-white"
                    title={m.displayName || m.username || "Unknown"}
                  >
                    {initials}
                  </div>
                  {/* Active indicator dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full ${
                      m.active ? "bg-emerald-500" : "bg-red-500"
                    } ring-1 ring-black`}
                  />
                  {/* Hover card */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 hidden group-hover:block bg-zinc-800 text-white text-[10px] rounded px-2 py-1 shadow">
                    <div className="flex items-center gap-2">
                      <span>{m.displayName || m.username || "Unknown"}</span>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          m.active ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${
                            m.active ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {m.active ? "Active" : "Offline"}
                      </span>
                      {isAdmin && m.token && (
                        <button
                          onClick={() => kickUser(m.token!)}
                          disabled={kicking}
                          className="text-red-300 hover:text-red-100"
                          title="Kick user"
                        >
                          Kick
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {members.length > 5 && (
              <div data-slot="avatar" className="h-6 w-6 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] text-white">
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Admin-only destroy; otherwise Leave */}
        {isAdmin ? (
          <button
            onClick={() => destroyRoom()}
            className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
          >
            <span className="group-hover:animate-pulse">💣</span>
            DESTROY NOW
          </button>
        ) : (
          <button
            onClick={() => leaveRoom()}
            disabled={leaving}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
          >
            Leave room
          </button>
        )}
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-sm font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg:any) => (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={`text-xs font-bold ${
                    msg.sender === username ? "text-green-500" : "text-blue-500"
                  }`}
                >
                  {msg.displayName || (msg.sender === username ? "YOU" : msg.sender)}
                </span>

                <span className="text-[10px] text-zinc-600">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input })
                  inputRef.current?.focus()
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>

          <button
            onClick={() => {
              sendMessage({ text: input })
              inputRef.current?.focus()
            }}
            disabled={!input.trim() || isPending}
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page

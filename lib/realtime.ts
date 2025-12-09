import { redis } from "@/lib/redis"
import { InferRealtimeEvents, Realtime } from "@upstash/realtime"
import z from "zod"

const message = z.object({
  id: z.string(),
  sender: z.string(),
  displayName: z.string(),
  text: z.string(),
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
})

const presence = z.object({
  displayName: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().url().optional(),
})

const schema = {
  chat: {
    message,
    join: presence,
    leave: z.object({}).optional(), // no payload for now
    destroy: z.object({
      isDestroyed: z.literal(true),
    }),
  },
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
export type Message = z.infer<typeof message>

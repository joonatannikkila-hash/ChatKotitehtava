import type { ChatItem } from "../types/chat"

const API_URL = "http://localhost:5202/api/message"

export async function fetchChats(): Promise<ChatItem[]> {
  const res = await fetch(`${API_URL}/history`)
  const data = await res.json()

  return data.map((c: any) => ({
    id: c.id,
    question: c.question ?? c.Question,
    answer: c.answer ?? c.Answer,
  }))
}

export async function createChat(message: string): Promise<ChatItem> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  const data = await res.json()

  return {
    id: Date.now(),           
    question: message,
    answer: data.response,    
  }
}

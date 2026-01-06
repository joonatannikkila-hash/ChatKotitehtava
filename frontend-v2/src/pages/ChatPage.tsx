import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import type { ChatItem } from "@/types/chat"
import { fetchChats, createChat } from "@/api/chatApi"

import { ChatHistoryList } from "@/components/ChatHistoryList"
import { ChatInput } from "@/components/ChatInput"
import { ChatMessageView } from "@/components/ChatMessageView"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ChatPage() {
  const [input, setInput] = useState("")
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: chats = [] } = useQuery<ChatItem[]>({
    queryKey: ["chats"],
    queryFn: fetchChats,
  })

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: newChat => {
      queryClient.setQueryData<ChatItem[]>(["chats"], old =>
        old ? [...old, newChat] : [newChat]
      )

      navigate(`/chat/${newChat.id}`)
    },
  })

  const activeChatId = id ? Number(id) : null
  const activeChat = chats.find(c => c.id === activeChatId)

  function handleSend() {
    if (!input.trim()) return
    createChatMutation.mutate(input)
    setInput("")
  }

  return (
    <div className="h-screen flex bg-muted">
      <ChatHistoryList
        chats={chats}
        onSelect={id => navigate(`/chat/${id}`)}
      />

      <div className="flex-1 flex flex-col p-6 gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Gemini Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            {activeChat ? (
              <ChatMessageView
                question={activeChat.question}
                answer={activeChat.answer}
              />
            ) : (
              <p className="text-muted-foreground">
                Valitse keskustelu vasemmalta tai aloita uusi.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import type { ChatItem } from "../types/chat"

type Props = {
  chats: ChatItem[]
  onSelect: (id: number) => void
}

export function ChatHistoryList({ chats, onSelect }: Props) {
  if (chats.length === 0) {
    return <div className="w-64 pr-2">Ei keskusteluja</div>
  }

  return (
    <div className="w-64 border-r pr-2">
      <h3 className="font-bold mb-2">Historia</h3>
      <ul className="space-y-1 list-none">
        {chats.map(chat => (
        <li
          key={chat.id ?? `${chat.question}-${Math.random()}`}
          className="cursor-pointer underline"
          onClick={() => chat.id && onSelect(chat.id)}
        >
          {chat.question || "(tyhjä)"}
        </li>
        ))}
      </ul>
    </div>
  )
}

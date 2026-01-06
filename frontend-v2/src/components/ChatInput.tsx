import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  value: string
  onChange: (v: string) => void
  onSend: () => void
}

export function ChatInput({ value, onChange, onSend }: Props) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Kirjoita viesti…"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSend()}
      />
      <Button onClick={onSend}>Lähetä</Button>
    </div>
  )
}

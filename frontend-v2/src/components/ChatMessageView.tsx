import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Props = {
  question: string
  answer: string
}

export function ChatMessageView({ question, answer }: Props) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Keskustelu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Kysymys</p>
          <p>{question}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Vastaus</p>
          <p>{answer}</p>
        </div>
      </CardContent>
    </Card>
  )
}

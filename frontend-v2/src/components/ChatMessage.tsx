type Props = {
  question: string
  answer: string
}

export function ChatMessage({ question, answer }: Props) {
  return (
    <div>
      <p><strong>Kysymys:</strong> {question}</p>
      <p><strong>Vastaus:</strong> {answer}</p>
    </div>
  )
}

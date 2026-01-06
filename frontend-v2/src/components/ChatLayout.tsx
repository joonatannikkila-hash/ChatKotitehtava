type Props = {
  sidebar: React.ReactNode
  header: React.ReactNode
  content: React.ReactNode
  footer: React.ReactNode
}

export function ChatLayout({ sidebar, header, content, footer }: Props) {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30">
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 font-semibold">
          {header}
        </header>

        <section className="flex-1 p-4 overflow-y-auto">
          {content}
        </section>

        <footer className="border-t p-4">
          {footer}
        </footer>
      </main>
    </div>
  )
}

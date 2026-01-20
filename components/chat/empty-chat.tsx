import { MessageSquare } from "lucide-react"

export function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">Select a Conversation</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Choose a conversation from the list to start messaging, or find a tutor to begin a new chat.
      </p>
    </div>
  )
}

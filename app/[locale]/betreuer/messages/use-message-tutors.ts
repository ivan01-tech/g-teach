import { useAuth } from "@/hooks/use-auth"
import { chatService } from "@/lib/services/chat-service"
import { Conversation, Message } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export const useMessageTutors = () => {


    const { user } = useAuth()
    const searchParams = useSearchParams()
    const tutorId = searchParams.get("student") || searchParams.get("tutor")

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [mobileShowChat, setMobileShowChat] = useState(false)

    useEffect(() => {
        if (!user) return

        // Subscribe to conversations
        const unsubscribe = chatService.subscribeToConversations(user.uid, (convs) => {
            setConversations(convs)
            setLoading(false)

            // Auto-select first conversation or the one matching tutorId
            if (convs.length > 0 && !selectedConversation) {
                if (tutorId) {
                    const targetConv = convs.find((c) => c.participants.includes(tutorId))
                    if (targetConv) {
                        setSelectedConversation(targetConv)
                        setMobileShowChat(true)
                    }
                }
            }
        })

        return () => unsubscribe()
    }, [user, tutorId, selectedConversation])

    useEffect(() => {
        if (!selectedConversation) {
            setMessages([])
            return
        }

        // Subscribe to messages
        const unsubscribe = chatService.subscribeToMessages(selectedConversation.id, (msgs) => {
            setMessages(msgs)
        })

        // Mark as read
        if (user) {
            chatService.markAsRead(selectedConversation.id, user.uid)
        }

        return () => unsubscribe()
    }, [selectedConversation, user])

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation)
        setMobileShowChat(true)
    }

    const handleBackToList = () => {
        setMobileShowChat(false)
    }

    const handleSendMessage = async (text: string) => {
        if (!selectedConversation || !user) return

        await chatService.sendMessage(
            selectedConversation.id,
            user.uid,
            user.displayName,
            text,
            user.photoURL || ""
        )
    }

    const getOtherParticipant = (conversation: Conversation): { id: string, name: string, photo: string } => {
        const otherId = conversation.participants.find((p) => p !== user?.uid) || ""
        return {
            id: otherId,
            name: conversation.participantNames[otherId] || "Unknown",
            photo: conversation.participantPhotos[otherId] || "",
        }
    }


    return {
        conversations,
        selectedConversation,
        messages,
        loading,
        mobileShowChat,
        handleSelectConversation,
        handleBackToList,
        handleSendMessage,
        getOtherParticipant,
    }
}
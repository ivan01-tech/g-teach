import { useAuth } from "@/hooks/use-auth"
import { chatService } from "@/lib/services/chat-service"
import { Conversation, Message } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/hooks/redux-store-hooks"

export const useMessageStudent = () => {
    const { user, userProfile } = useAuth()
    const searchParams = useSearchParams()
    const tutorId = searchParams.get("tutor")

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
                    const tutorConv = convs.find((c) => c.participants.includes(tutorId))
                    if (tutorConv) {
                        setSelectedConversation(tutorConv)
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
        console.log("🔵 Student trying to send message:", {
            text,
            hasConversation: !!selectedConversation,
            conversationId: selectedConversation?.id,
            hasUser: !!user,
            userId: user?.uid,
            hasUserProfile: !!userProfile,
            userProfileName: userProfile?.displayName,
        })

        if (!selectedConversation || !user) {
            console.error("❌ Cannot send message - missing:", {
                selectedConversation: !!selectedConversation,
                user: !!user,
                userProfile: !!userProfile,
            })
            return
        }

        // Use userProfile when available, otherwise fall back to Firebase `user` fields or sensible defaults
        const senderName = userProfile?.displayName || user.displayName || "Anonymous"
        const senderPhoto = userProfile?.photoURL || user.photoURL || ""

        try {
            await chatService.sendMessage(
                selectedConversation.id,
                user.uid,
                senderName,
                text,
                senderPhoto
            )
            console.log("✅ Message sent successfully")
        } catch (error) {
            console.error("❌ Error sending message:", error)
        }
    }

    const getOtherParticipant = (conversation: Conversation): { id: string, name: string, photo: string } => {
        const otherId = conversation.participants.find((p) => p !== user?.uid) || ""
        return {
            id: otherId,
            name: conversation.participantNames[otherId] || "Unknown",
            photo: conversation.participantPhotos[otherId] || "",
        }
    }

    const { allMatchings: matchings } = useAppSelector((state) => state.matching)

    // Find matching for selected conversation
    const selectedMatching = selectedConversation ? matchings.find(m =>
        (m.learnerId === user?.uid && m.tutorId === getOtherParticipant(selectedConversation).id) ||
        (m.tutorId === user?.uid && m.learnerId === getOtherParticipant(selectedConversation).id)
    ) : null

    const isValidationPending = selectedMatching?.status === "requested"

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
        isValidationPending,
    }
}

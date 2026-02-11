import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs,
  limit,
  Timestamp,
  increment,
} from "firebase/firestore"
import { db } from "../firebase"
import type { Conversation, Message } from "../types"

export interface ConversationWithDetails extends Conversation {
  otherParticipantName?: string
  otherParticipantPhoto?: string
}

export async function getConversations(userId: string): Promise<ConversationWithDetails[]> {
  const conversationsRef = collection(db, "conversations")
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  )

  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const otherParticipantId = data.participants.find((p: string) => p !== userId)
    
    return {
      id: doc.id,
      participants: data.participants,
      participantNames: data.participantNames,
      participantPhotos: data.participantPhotos,
      lastMessage: data.lastMessage,
      lastMessageAt: data.lastMessageAt?.toDate(),
      unreadCount: data.unreadCount,
      otherParticipantName: otherParticipantId ? data.participantNames[otherParticipantId] : undefined,
      otherParticipantPhoto: otherParticipantId ? data.participantPhotos[otherParticipantId] : undefined,
    }
  })
}

export const chatService = {
  // Get or create a conversation between two users
  async getOrCreateConversation(
    userId1: string,
    userId2: string,
    user1Name: string,
    user2Name: string,
    user1Photo?: string,
    user2Photo?: string
  ): Promise<string> {
    const conversationsRef = collection(db, "conversations")

    // Check if conversation already exists
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId1)
    )

    const snapshot = await getDocs(q)
    const existingConversation = snapshot.docs.find((doc) => {
      const data = doc.data()
      return data.participants.includes(userId2)
    })

    if (existingConversation) {
      return existingConversation.id
    }

    // Create new conversation
    const newConversation = await addDoc(conversationsRef, {
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: user1Name,
        [userId2]: user2Name,
      },
      participantPhotos: {
        [userId1]: user1Photo || "",
        [userId2]: user2Photo || "",
      },
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0,
      },
      createdAt: serverTimestamp(),
    })

    return newConversation.id
  },

  // Subscribe to user's conversations
  subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const conversationsRef = collection(db, "conversations")
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId),
      orderBy("lastMessageAt", "desc")
    )

    return onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          participants: data.participants,
          participantNames: data.participantNames,
          participantPhotos: data.participantPhotos,
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt?.toDate(),
          unreadCount: data.unreadCount,
        }
      })
      callback(conversations)
    })
  },

  // Subscribe to messages in a conversation
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const messagesRef = collection(db, "conversations", conversationId, "messages")
    const q = query(messagesRef, orderBy("createdAt", "asc"))

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          senderPhoto: data.senderPhoto,
          text: data.text,
          createdAt: data.createdAt?.toDate() || new Date(),
          read: data.read,
        }
      })
      callback(messages)
    })
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string,
    senderPhoto?: string
  ): Promise<void> {
    const messagesRef = collection(db, "conversations", conversationId, "messages")
    const conversationRef = doc(db, "conversations", conversationId)

    // Add the message
    await addDoc(messagesRef, {
      senderId,
      senderName,
      senderPhoto: senderPhoto || "",
      text,
      createdAt: serverTimestamp(),
      read: false,
    })

    // Get conversation to find the other participant
    const conversationDoc = await getDoc(conversationRef)
    const conversationData = conversationDoc.data()
    const otherParticipant = conversationData?.participants.find(
      (p: string) => p !== senderId
    )

    // Update conversation with last message
    await updateDoc(conversationRef, {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      [`unreadCount.${otherParticipant}`]: increment(1),
    })
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversationRef = doc(db, "conversations", conversationId)

    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0,
    })
  },

  // Get conversation details
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const conversationRef = doc(db, "conversations", conversationId)
    const snapshot = await getDoc(conversationRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data()
    return {
      id: snapshot.id,
      participants: data.participants,
      participantNames: data.participantNames,
      participantPhotos: data.participantPhotos,
      lastMessage: data.lastMessage,
      lastMessageAt: data.lastMessageAt?.toDate(),
      unreadCount: data.unreadCount,
    }
  },
}

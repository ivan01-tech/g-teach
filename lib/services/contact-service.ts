import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import { firebaseCollections } from "../collections"
import { ContactInquiry } from "../types"

export const contactService = {
    /**
     * Submits a contact inquiry to Firestore
     */
    async submitContactInquiry(
        data: Omit<ContactInquiry, "id" | "createdAt" | "status">
    ): Promise<string> {
        const contactRef = collection(db, firebaseCollections.contactInquiries)

        const docRef = await addDoc(contactRef, {
            ...data,
            status: "pending",
            createdAt: serverTimestamp(),
        })

        return docRef.id
    },
}

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    getDoc,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Tutor, VerificationStatus } from "@/lib/types";
import { firebaseCollections } from "../collections";

export const userService = {
    /**
     * Fetch all users from the 'users' collection
     */
    async getAllUsers(): Promise<User[]> {
        const usersRef = collection(db, firebaseCollections.users);
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id,
        } as User));
    },

    /**
     * Listen to all users from the 'users' collection
     */
    listenUsers(callback: (users: User[]) => void) {
        const usersRef = collection(db, firebaseCollections.users);
        const q = query(usersRef, orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id,
            } as User));
            callback(users);
        });
    },

    /**
     * Update a user's basic profile
     */
    async updateUser(uid: string, data: Partial<User>): Promise<void> {
        const userRef = doc(db, firebaseCollections.users, uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    /**
     * Delete a user and their associated role-specific documents
     */
    async deleteUser(uid: string, role: string): Promise<void> {
        // Delete from primary users collection
        await deleteDoc(doc(db, firebaseCollections.users, uid));

        // Delete from role-specific collection
        if (role === "tutor") {
            await deleteDoc(doc(db, firebaseCollections.tutors, uid));
        } else if (role === "student") {
            await deleteDoc(doc(db, firebaseCollections.students, uid));
        }
    },

    /**
     * Validate a tutor's application
     */
    async validateTutor(
        uid: string,
        status: VerificationStatus,
        message?: string
    ): Promise<void> {
        const tutorRef = doc(db, firebaseCollections.tutors, uid);
        const userRef = doc(db, firebaseCollections.users, uid);

        const updateData = {
            verificationStatus: status,
            verificationMessage: message || "",
            updatedAt: serverTimestamp(),
        };

        // Update both the tutor-specific doc and the main user doc for consistency
        await updateDoc(tutorRef, updateData);
        await updateDoc(userRef, updateData);
    },

    /**
     * Get full tutor details (for validation view)
     */
    async getTutorDetails(uid: string): Promise<Tutor | null> {
        const tutorRef = doc(db, firebaseCollections.tutors, uid);
        const tutorSnap = await getDoc(tutorRef);

        if (tutorSnap.exists()) {
            return {
                ...tutorSnap.data(),
                uid: tutorSnap.id,
            } as Tutor;
        }
        return null;
    }
};

import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { firebaseCollections } from "../collections";
import { City } from "../types";

export async function getCities(): Promise<City[]> {
    const citiesRef = collection(db, firebaseCollections.cities);
    const q = query(citiesRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as City[];
}

export async function addCity(name: string): Promise<string> {
    const citiesRef = collection(db, firebaseCollections.cities);
    const docRef = await addDoc(citiesRef, {
        name,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

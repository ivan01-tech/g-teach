
import axios from "axios";

export const AXIOS_INSTANCE = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
import { startAppListening } from "./listener";
import { signUp } from "@/app/[locale]/auth/thunks";
import { sendAccountEmail, sendValidationEmail, sendRefusalEmail } from "../services/emails/sendEmails";
import { UserRole } from "../roles";
import { acceptMatching } from "../services/matching-service";
import { acceptMatchingAction, refuseMatchingAction } from "../store/matching-slice";
import { getTutorProfile, getUserById } from "../services/tutor-service";
import { chatService } from "../services/chat-service";



let isRegistered = false;
export const setupEmailSideEffects = () => {
    if (isRegistered) return;
    isRegistered = true;

    console.log("📨 Email side effects registered");
    /**
     * Registers side effects related to email notifications.
     */
    // startAppListening({
    //     actionCreator: signUp.fulfilled,
    //     effect: async (action, listenerApi) => {
    //         const user = action.payload;
    //         if (!user) return;

    //         // Extract password from original arguments (meta.arg)
    //         const { password } = action.meta.arg;

    //         console.log(`[Email Side Effect] Sending welcome email to: ${user.email}`);

    //         try {
    //             await sendAccountEmail({
    //                 to: user.email,
    //                 displayName: user.displayName,
    //                 email: user.email,
    //                 password: password,
    //                 role: user.role as UserRole,
    //             });
    //             console.log(`[Email Side Effect] Welcome email sent successfully to ${user.email}`);
    //         } catch (error) {
    //             console.error("[Email Side Effect] Failed to send welcome email:", error);
    //         }
    //     },
    // },);
    // ================




    // 🔹 SIGN UP EMAIL
    startAppListening({
        actionCreator: signUp.fulfilled,
        effect: async (action, listenerApi) => {
            listenerApi.cancelActiveListeners();

            const user = action.payload;
            if (!user) return;

            const { password } = action.meta.arg;

            try {
                await sendAccountEmail({
                    to: user.email,
                    displayName: user.displayName,
                    email: user.email,
                    password,
                    role: user.role as UserRole,
                });

                console.log(`✅ Welcome email sent to ${user.email}`);
            } catch (error) {
                console.error("❌ Welcome email failed:", error);
            }
        },
    }),

        // 🔹 PROFILE VALIDATION EMAIL
        startAppListening({
            actionCreator: acceptMatchingAction.fulfilled,
            effect: async (action, listenerApi) => {
                listenerApi.cancelActiveListeners();
                const matchingId = action.payload;
                const state = listenerApi.getState();
                const user = state.auth.user;
                const matching = state.matching.allMatchings.find((m) => m.id === matchingId);

                if (!matching || !user) throw new Error("No matching or user found");

                // const tutor = await getTutorProfile(matching.tutorId);
                const learner = await getUserById(matching.learnerId);
                if (!learner) throw new Error("No learner found");

                try {
                    await sendValidationEmail({
                        to: learner.email,
                        tutorName: user.displayName,
                        displayName: learner.displayName,
                        email: learner.email,
                        role: learner.role as UserRole,
                        tutorId: matching.tutorId,
                    });


                    // creer la discusionn entre les deux utilisateurs
                    await chatService.getOrCreateConversation(
                        {
                            userId1: matching.tutorId,
                            userId2: matching.learnerId,
                            user1Name: user.displayName,
                            user2Name: learner.displayName,
                            user1Photo: user.photoURL || "",
                            user2Photo: learner.photoURL || ""
                        }
                    );
                    console.log(`✅ Validation email sent to ${learner.email}`);
                } catch (error) {
                    console.error("❌ Validation email failed:", error);
                }
            },
        });

    // 🔹 REFUSAL EMAIL
    startAppListening({
        actionCreator: refuseMatchingAction.fulfilled,
        effect: async (action, listenerApi) => {
            listenerApi.cancelActiveListeners();

            const { matchingId, reason } = action.payload;
            const state = listenerApi.getState();
            const user = state.auth.user;
            const matching = state.matching.allMatchings.find((m) => m.id === matchingId);

            if (!matching || !user) {
                console.error("❌ No matching or user found for refusal email");
                return;
            }

            const learner = await getUserById(matching.learnerId);
            if (!learner) {
                console.error("❌ No learner found for refusal email");
                return;
            }

            try {
                await sendRefusalEmail({
                    to: learner.email,
                    tutorName: user.displayName,
                    displayName: learner.displayName,
                    reason,
                });

                console.log(`✅ Refusal email sent to ${learner.email}`);
            } catch (error) {
                console.error("❌ Refusal email failed:", error);
            }
        },
    });
};

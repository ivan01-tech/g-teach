import { startAppListening } from "./listener";
import { signUp } from "@/app/[locale]/auth/thunks";
import { sendAccountEmail } from "../services/emails/sendEmails";

/**
 * Registers side effects related to email notifications.
 */
export const setupEmailSideEffects = () => {
    startAppListening({
        actionCreator: signUp.fulfilled,
        effect: async (action, listenerApi) => {
            const user = action.payload;
            if (!user) return;

            // Extract password from original arguments (meta.arg)
            const { password } = action.meta.arg;

            console.log(`[Email Side Effect] Sending welcome email to: ${user.email}`);

            try {
                await sendAccountEmail({
                    to: user.email,
                    displayName: user.displayName,
                    email: user.email,
                    password: password,
                    role: user.role,
                });
                console.log(`[Email Side Effect] Welcome email sent successfully to ${user.email}`);
            } catch (error) {
                console.error("[Email Side Effect] Failed to send welcome email:", error);
            }
        },
    },);
};

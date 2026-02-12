import { AXIOS_INSTANCE } from "@/lib/axios";
import { getRoleLabel } from "@/lib/roles";
export type SendEmailData = {
  emails: string[],
  subject: string,
  senderName: string,
  textPart: string,
  htmlPart: string,
}
// send email
export const sendEmail = async (data: SendEmailData) => {
  try {
    const response = await AXIOS_INSTANCE.post("/sendEmails", data);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};



// Envoie un email via ton endpoint Cloud Function
export async function sendAccountEmail({
  to,
  displayName,
  email,
  password,
  role,
}: {
  to: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
  const roleLabel = getRoleLabel(role);

  const htmlPart = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
      <h2 style="color: #000;">Bienvenue sur G-TEACH</h2>
      <p>Bonjour ${displayName},</p>
      <p>Votre compte a été créé avec succès.</p>
      
      <p><strong>Vos accès :</strong><br>
      Email : <strong>${email}</strong><br>
      Mot de passe : <strong>${password}</strong><br>
      Rôle : <strong>${roleLabel}</strong></p>

      <p>Vous pouvez vous connecter ici : <br>
      <a href="${loginUrl}">${loginUrl}</a></p>

      <p style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
        G-TEACH Administration<br>
        © ${new Date().getFullYear()}
      </p>
    </div>
  `;

  const response = await sendEmail({
    emails: [to],
    subject: "Bienvenue sur G-TEACH – Vos accès",
    senderName: "G-TEACH Administration",
    textPart: `Bonjour ${displayName},\nVotre compte G-TEACH est prêt. Email: ${email} | Mot de passe: ${password}`,
    htmlPart,
  })
  console.log("Email side effect status:", response);
  return response;
}

export const sendValidationEmail = async ({ to, tutorName, displayName, email, role, tutorId }: { to: string, tutorName: string, displayName: string, email: string, role: string, tutorId: string }) => {
  const chatUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/messages?tutor=${tutorId}`;
  const roleLabel = getRoleLabel(role);

  const htmlPart = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
      <h2 style="color: #000;">Votre demande de connexion a été validée</h2>
      <p>Bonjour ${displayName},</p>
      <p>Votre demande de connexion a été validée.</p>
      <p>Le tuteur ${tutorName} a validé votre demande de connexion. Vous desormais discuter avec lui ici :  <br>
      <a href="${chatUrl}">${chatUrl}</a></p>
      
      <p style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
        G-TEACH Administration<br>
        © ${new Date().getFullYear()}
      </p>
    </div>
  `;

  const response = await sendEmail({
    emails: [to],
    subject: "Votre demande de connexion a été validée",
    senderName: "G-TEACH Administration",
    textPart: `Bonjour ${displayName},\nVotre demande de connexion a été validée.`,
    htmlPart,
  })
  console.log("Email side effect status:", response);
  return response;
}

export const sendRefusalEmail = async ({
  to,
  tutorName,
  displayName,
  reason,
}: {
  to: string;
  tutorName: string;
  displayName: string;
  reason: string;
}) => {
  const htmlPart = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
      <h2 style="color: #d32f2f;">Demande de connexion refusée</h2>
      <p>Bonjour ${displayName},</p>
      <p>Malheureusement, le tuteur <strong>${tutorName}</strong> a refusé votre demande de connexion.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
        <p style="margin: 0;"><strong>Motif :</strong></p>
        <p style="margin: 10px 0 0 0;">${reason}</p>
      </div>

      <p>N'hésitez pas à contacter d'autres tuteurs disponibles sur la plateforme.</p>
      
      <p style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
        G-TEACH Administration<br>
        © ${new Date().getFullYear()}
      </p>
    </div>
  `;

  const response = await sendEmail({
    emails: [to],
    subject: "Demande de connexion refusée",
    senderName: "G-TEACH Administration",
    textPart: `Bonjour ${displayName},\nLe tuteur ${tutorName} a refusé votre demande de connexion.\nMotif : ${reason}`,
    htmlPart,
  });
  console.log("Refusal email sent:", response);
  return response;
};

/**
 * Cloud Functions pour le système de matching automatisé
 * À déployer dans Firebase Functions
 * 
 * Deploy: firebase deploy --only functions
 * 
 * NOTE: Ce fichier doit être placé dans le dossier functions/src/
 * et les dépendances suivantes doivent être installées dans functions/:
 *   - firebase-functions
 *   - firebase-admin
 */

// @ts-ignore - Ces modules sont installés dans functions/ pas dans le projet Next.js
import * as functions from 'firebase-functions'
// @ts-ignore
import * as admin from 'firebase-admin'

// Initialise Admin SDK
admin.initializeApp()
const db = admin.firestore()

/**
 * Envoie des rappels automatiques pour les matchings expirés
 * Déclenché chaque jour à 9h00
 */
export const sendMatchingReminders = functions
    .region('europe-west1')
    .pubsub
    .schedule('every day 09:00')
    .timeZone('Europe/Paris')
    .onRun(async (context: any) => {
        try {
            const matchingsRef = db.collection('matchings')

            // Configuration
            const MATCHING_TIMEOUT_DAYS = 7
            const REMINDER_INTERVAL_DAYS = 3
            const MAX_REMINDERS = 2

            const xDaysAgo = new Date()
            xDaysAgo.setDate(xDaysAgo.getDate() - MATCHING_TIMEOUT_DAYS)

            const threeDaysAgo = new Date()
            threeDaysAgo.setDate(threeDaysAgo.getDate() - REMINDER_INTERVAL_DAYS)

            // Récupère tous les matchings en attente
            const snapshot = await matchingsRef
                .where('status', 'in', ['open', 'continued'])
                .get()

            let remindersSent = 0

            for (const docSnap of snapshot.docs) {
                const matching = docSnap.data()
                const contactDate = matching.contactDate?.toDate?.() || new Date(matching.contactDate)
                const reminderSentAt = matching.reminderSentAt?.toDate?.() || null

                // Vérifie si un rappel doit être envoyé
                const isExpired = contactDate <= xDaysAgo
                const shouldSendReminder =
                    !reminderSentAt ||
                    (reminderSentAt <= threeDaysAgo && (matching.reminderCount || 0) < MAX_REMINDERS)

                if (isExpired && shouldSendReminder) {
                    // Met à jour le document avec les infos du rappel
                    await docSnap.ref.update({
                        reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
                        reminderCount: admin.firestore.FieldValue.increment(1),
                    })

                    // Envoie les notifications
                    await sendReminders(matching)
                    remindersSent++
                }
            }

            console.log(`Reminders sent: ${remindersSent}`)
            return { success: true, remindersSent }
        } catch (error) {
            console.error('Error sending reminders:', error)
            throw new functions.https.HttpsError(
                'internal',
                'Error sending reminders: ' + error
            )
        }
    })

/**
 * Envoie les notifications à l'apprenant et au tuteur
 */
async function sendReminders(matching: any) {
    const { learnerId, tutorId, learnerName, tutorName } = matching

    // Récupère les documents utilisateurs pour avoir les emails
    const learnerDoc = await db.collection('users').doc(learnerId).get()
    const tutorDoc = await db.collection('users').doc(tutorId).get()

    const learnerEmail = learnerDoc.data()?.email
    const tutorEmail = tutorDoc.data()?.email

    // TODO: Implémenter l'envoi d'emails
    // Utiliser Firebase Extensions (SendGrid, Mailgun) ou un service tiers

    console.log(`Reminder for learner ${learnerId} (${learnerEmail})`)
    console.log(`Reminder for tutor ${tutorId} (${tutorEmail})`)

    // Exemple avec Mailgun (si activé en extension Firebase):
    // await sendEmail({
    //     to: learnerEmail,
    //     subject: `Suivi de votre mise en relation avec ${tutorName}`,
    //     html: `<p>Bonjour ${learnerName},</p>...`
    // })
}

/**
 * Clôture automatiquement les matchings après 21 jours sans réponse
 * Déclenché tous les 3 jours
 */
export const autoCloseExpiredMatchings = functions
    .region('europe-west1')
    .pubsub
    .schedule('every 3 days 10:00')
    .timeZone('Europe/Paris')
    .onRun(async (context: any) => {
        try {
            const matchingsRef = db.collection('matchings')
            const FINAL_TIMEOUT_DAYS = 21

            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - FINAL_TIMEOUT_DAYS)

            // Récupère les matchings "open" depuis plus de 21 jours
            const snapshot = await matchingsRef
                .where('status', '==', 'open')
                .where('contactDate', '<=', admin.firestore.Timestamp.fromDate(cutoffDate))
                .get()

            let closedCount = 0

            for (const docSnap of snapshot.docs) {
                await docSnap.ref.update({
                    status: 'refused',
                    closedAt: admin.firestore.FieldValue.serverTimestamp(),
                    tutorFeedback: 'Auto-closed - no response after 21 days',
                })
                closedCount++
            }

            console.log(`Auto-closed ${closedCount} expired matchings`)
            return { success: true, closedCount }
        } catch (error) {
            console.error('Error auto-closing matchings:', error)
            throw new functions.https.HttpsError(
                'internal',
                'Error auto-closing matchings: ' + error
            )
        }
    })

/**
 * Génère un rapport de matching quotidien pour l'admin
 * Déclenché tous les jours à 18h00
 */
export const generateDailyMatchingReport = functions
    .region('europe-west1')
    .pubsub
    .schedule('every day 18:00')
    .timeZone('Europe/Paris')
    .onRun(async (context: any) => {
        try {
            const matchingsRef = db.collection('matchings')

            // Récupère les matchings créés aujourd'hui
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const snapshot = await matchingsRef
                .where('contactDate', '>=', admin.firestore.Timestamp.fromDate(today))
                .get()

            const stats = {
                totalNew: snapshot.size,
                confirmed: 0,
                refused: 0,
                open: 0,
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data()
                if (data.status === 'confirmed') {
                    stats.confirmed++
                } else if (data.status === 'refused') {
                    stats.refused++
                } else {
                    stats.open++
                }
            })

            // Enregistre le rapport
            await db.collection('adminReports').add({
                type: 'dailyMatching',
                date: admin.firestore.Timestamp.now(),
                stats,
            })

            console.log('Daily report generated:', stats)
            return { success: true, stats }
        } catch (error) {
            console.error('Error generating report:', error)
            throw new functions.https.HttpsError(
                'internal',
                'Error generating report: ' + error
            )
        }
    })

/**
 * Enregistre les statistiques de réputation après une confirmation de matching
 * Déclenché par HTTP request ou Firestore trigger
 */
export const updateTutorReputationStats = functions
    .region('europe-west1')
    .firestore
    .document('matchings/{matchingId}')
    .onUpdate(async (change: any, context: any) => {
        try {
            const beforeData = change.before.data()
            const afterData = change.after.data()

            // Trigger seulement si le statut passe à "confirmed"
            if (afterData.status !== 'confirmed' || beforeData.status === 'confirmed') {
                return
            }

            const tutorId = afterData.tutorId

            // Récupère les transactions du tuteur pour mettre à jour ses stats
            const transactionsRes = await db
                .collection('monetizationTransactions')
                .where('tutorId', '==', tutorId)
                .where('status', '==', 'completed')
                .get()

            const totalEarnings = transactionsRes.docs.reduce(
                (sum: any, doc: any) => sum + (doc.data().amount || 0),
                0
            )

            const completedLessons = transactionsRes.size

            // Met à jour le tuteur
            const tutorRef = db.collection('tutors').doc(tutorId)
            await tutorRef.update({
                totalStudents: admin.firestore.FieldValue.increment(1),
                totalLessons: admin.firestore.FieldValue.increment(1),
                reputationStats: {
                    totalEarnings,
                    totalLessonsCompleted: completedLessons,
                    lastUpdated: admin.firestore.Timestamp.now(),
                },
            })

            console.log(`Updated tutor stats for ${tutorId}`)
            return { success: true }
        } catch (error) {
            console.error('Error updating reputation stats:', error)
            throw error
        }
    })

/**
 * Fonction HTTP pour déclencher manuellement les rappels
 * Utilisation: POST /triggerReminders?key=SECRET_KEY
 */
export const triggerReminders = functions
    .region('europe-west1')
    .https
    .onRequest(async (req: any, res: any) => {
        try {
            // Sécurité: vérifier la clé secrète
            const secretKey = functions.config().custom?.trigger_key
            if (req.query.key !== secretKey) {
                return res.status(403).json({ error: 'Unauthorized' })
            }

            // Appelle la logique des rappels
            const matchingsRef = db.collection('matchings')
            const MATCHING_TIMEOUT_DAYS = 7
            const REMINDER_INTERVAL_DAYS = 3
            const MAX_REMINDERS = 2

            const xDaysAgo = new Date()
            xDaysAgo.setDate(xDaysAgo.getDate() - MATCHING_TIMEOUT_DAYS)

            const snapshot = await matchingsRef
                .where('status', 'in', ['open', 'continued'])
                .get()

            let remindersSent = 0

            for (const docSnap of snapshot.docs) {
                const matching = docSnap.data()
                const contactDate = matching.contactDate?.toDate?.() || new Date(matching.contactDate)

                if (contactDate <= xDaysAgo && (matching.reminderCount || 0) < MAX_REMINDERS) {
                    await docSnap.ref.update({
                        reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
                        reminderCount: admin.firestore.FieldValue.increment(1),
                    })
                    remindersSent++
                }
            }

            return res.json({ success: true, remindersSent })
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
        }
    })

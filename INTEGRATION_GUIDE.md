# Guide d'intégration rapide - Système de Matching

## 🚀 Démarrage rapide

### 1. **Vérifier que tout est en place**

```bash
# Les fichiers suivants ont été créés/modifiés:
- lib/types.ts (Matching interface enrichie) ✓
- lib/store/matching-slice.ts (Actions Redux) ✓
- lib/services/matching-service.ts (Logique métier) ✓
- lib/services/monetization-service.ts (NEW - Monétisation) ✓
- lib/services/platform-stats-service.ts (NEW - Stats) ✓
- hooks/use-matching-followup.ts (Hook amélioré) ✓
- components/dashboard/matching-followup-dialog.tsx (Dialog) ✓
- components/tutors/tutor-stats-card.tsx (NEW - Stats card) ✓
- functions/matching.functions.ts (NEW - Cloud Functions) ✓
```

### 2. **Intégrer le dialog de suivi dans le layout**

```tsx
// app/[locale]/dashboard/layout.tsx
import { MatchingFollowupDialog } from "@/components/dashboard/matching-followup-dialog"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main>{children}</main>
        
        {/* ✅ Dialog de suivi automatique */}
        <MatchingFollowupDialog />
      </div>
    </div>
  )
}
```

### 3. **Afficher les stats du tuteur**

```tsx
// app/[locale]/betreuer/page.tsx  
import { TutorStatsCard } from "@/components/tutors/tutor-stats-card"

export default function BetreuerDashboard() {
  return (
    <div className="space-y-6">
      <h1>Dashboard Tuteur</h1>
      
      {/* ✅ Affiche les stats de matching et réputation */}
      <TutorStatsCard />
    </div>
  )
}
```

### 4. **Enregistrer un contact (page tuteur)**

```tsx
// app/[locale]/tutors/[id]/page.tsx
import { recordContact } from "@/lib/store/matching-slice"
import { useDispatch } from "react-redux"

export default function TutorProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { tutor } = useTutor(id)
  
  const handleContactTutor = async () => {
    if (learner && tutor) {
      // ✅ Enregistre la mise en relation
      await dispatch(recordContact({
        learnerId: learner.uid,
        tutorId: tutor.uid,
        learnerName: learner.displayName,
        tutorName: tutor.displayName
      }))
    }
    router.push(`/dashboard/messages?tutor=${id}`)
  }

  return (
    <>
      <Button onClick={handleContactTutor}>
        Contacter ce professeur
      </Button>
    </>
  )
}
```

---

## 📊 Utiliser le hook de suivi

```tsx
"use client"

import { useMatchingFollowup } from "@/hooks/use-matching-followup"

export function MyComponent() {
  const {
    pendingMatchings,           // Matchings en attente
    loading,                    // Loading state
    error,                      // Error messages
    stats,                      // Stats du tuteur
    closeMatching,              // Clôturer une mise en relation
    refreshPending,             // Rafraîchir la liste
    loadStats,                  // Charger stats pour tutorId
    triggerRemindersManually    // Déclencher rappels
  } = useMatchingFollowup()

  return (
    <div>
      {pendingMatchings.map(matching => (
        <div key={matching.id}>
          <p>{matching.learnerName} ← → {matching.tutorName}</p>
          <button onClick={() => closeMatching(
            matching.id,
            "confirmed",
            "L'apprenant est devenu mon élève"
          )}>
            Confirmer
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 💰 Gérer la monétisation

```tsx
import {
  recordTransaction,
  updateTransactionStatus,
  generateTutorFinancialSummary,
  calculateTrustScore
} from "@/lib/services/monetization-service"

// Enregistrer une transaction
await recordTransaction({
  tutorId: "tutor_123",
  learnerId: "learner_456",
  matchingId: "match_789",
  amount: 35,
  currency: "EUR",
  status: "completed",
  type: "lesson",
  description: "Session de 1h"
})

// Récupérer le récap financier
const summary = await generateTutorFinancialSummary("tutor_123")
console.log(summary)
// { totalEarnings: 350, pendingPayments: 35, completedTransactions: 10 }

// Calculer le score de confiance
const score = calculateTrustScore({
  totalEarnings: 350,
  totalLessonsCompleted: 10,
  averageRating: 4.8,
  totalStudents: 8
})
console.log(score) // 85
```

---

## 📈 Obtenir des statistiques

```tsx
import {
  getPlatformMatchingStats,
  getTutorStatsReport,
  getTopTutors,
  generateMatchingReport
} from "@/lib/services/platform-stats-service"

// Stats globales
const platformStats = await getPlatformMatchingStats()
console.log(platformStats)
// {
//   totalMatchings: 125,
//   successfulMatches: 87,
//   refusedMatches: 25,
//   pendingMatches: 13,
//   averageTimeToConfirm: 4,
//   successRate: 70
// }

// Stats d'un tuteur
const tutorReport = await getTutorStatsReport("tutor_123")
console.log(tutorReport.successRate) // 85%

// Meilleurs tuteurs
const topTutors = await getTopTutors(10)

// Rapport par période
const monthReport = await generateMatchingReport("month")
```

---

## ⏲️ Déployer les Cloud Functions

```bash
# 1. Installez Firebase CLI si ce n'est pas fait
npm install -g firebase-tools

# 2. Initialisez depuis la racine du projet
firebase init functions

# 3. Copiez le fichier de fonctions
cp functions/matching.functions.ts functions/src/

# 4. Installez les dépendances
cd functions
npm install

# 5. Déployez
firebase deploy --only functions

# 6. Pour tester manuellement:
curl "https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/triggerReminders?key=SECRET_KEY"
```

### Configuration des variables d'environnement

```bash
# Créer un fichier .env.local pour les secrets
# (À stocker dans Firebase Config)

firebase functions:config:set custom.trigger_key="YOUR_SECRET_KEY"
firebase functions:config:set email.provider="sendgrid"
firebase functions:config:set email.api_key="SG.xxxxx"
```

---

## 🧪 Tester localement

```bash
# Lancer l'émulateur Firestore
firebase emulators:start

# Dans votre app:
import { initializeApp } from "firebase/app"
import { connectEmulator, getFirestore } from "firebase/firestore"

const app = initializeApp(config)
const db = getFirestore(app)

if (process.env.NODE_ENV === "development") {
  connectEmulator(db, "localhost", 8080)
}
```

---

## 🔍 Debugger dans Firestore

```typescript
// Vérifier un matching en detail
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const matchingRef = doc(db, "matchings", "match_789")
const snapshot = await getDoc(matchingRef)
console.log(snapshot.data())
```

---

## 📱 Notifications (À implémenter)

Pour envoyer des notifications email lors des rappels, intégrer un service:

### Option 1: Firebase Extensions (SendGrid)
```bash
firebase ext:install sendgrid/email
# Configure via console Firebase
```

### Option 2: Custom HTTP Service
```typescript
// functions/src/notifications.ts
import axios from "axios"

async function sendEmail(to: string, subject: string, html: string) {
  await axios.post("https://api.sendgrid.com/v3/mail/send", {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: "noreply@g-teach.com" },
    subject,
    content: [{ type: "text/html", value: html }]
  }, {
    headers: {
      "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`
    }
  })
}
```

---

## ✨ Prochaines étapes optionnelles

- [ ] Ajouter un admin panel pour visualiser les stats
- [ ] Implémenter un système de payout (Stripe Connect)
- [ ] Notifications push mobile
- [ ] Système de feedback/review amélioré
- [ ] Analytics avancées (Google Analytics)
- [ ] Système de bonus/récompenses
- [ ] Intégration calendrier (Google Calendar, Outlook)
- [ ] Vidéoconférence intégrée (Jitsi, Zoom)

---

## 📚 Documentation complète

Voir [MATCHING_SYSTEM.md](./MATCHING_SYSTEM.md) pour la documentation détaillée.

---

## 🆘 Support

En cas de problème :

1. Vérifiez les logs Firestore : Firebase Console > Firestore > Logs
2. Vérifiez les fonctions : Firebase Console > Functions > Logs
3. Vérifiez Redux DevTools (si activé)
4. Regardez les erreurs dans la console navigateur

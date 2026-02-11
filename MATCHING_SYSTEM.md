# Système de Matching et Monétisation - G-Teach

## 📋 Vue d'ensemble

Le système de matching gère la mise en relation entre apprenants (étudiants) et tuteurs (Betreuer). Il inclut :
- **Mise en relation** : Un apprenant trouve un tuteur et clique "Contacter"
- **Suivi actif** : Après 7 jours, une action obligatoire est demandée aux deux parties
- **Traçabilité** : Toutes les interactions sont enregistrées avec timestamps et feedback
- **Monétisation** : Tracé des revenus et confirmations de collaboration
- **Statistiques** : Score de confiance, taux de succès, et réputation

---

## 🔄 Processus de Matching

### 1. **Initiation de la mise en relation**
L'apprenant :
```
Recherche → Clique sur un Betreuer → Clique "Contacter"
```

**Code** :
```typescript
dispatch(recordContact({
    learnerId: user.uid,
    tutorId: tutor.uid,
    learnerName: user.displayName,
    tutorName: tutor.displayName
}))
```

**Firestore** (collection: `matchings`):
```json
{
  "id": "matching_123",
  "learnerId": "...",
  "tutorId": "...",
  "learnerName": "Marie Dupont",
  "tutorName": "Jean Schmidt",
  "contactDate": "2026-02-11T10:00:00Z",
  "status": "open",
  "learnerConfirmed": false,
  "tutorConfirmed": false,
  "reminderCount": 0,
  "isMonetized": false
}
```

---

### 2. **Suivi après X jours (7 jours)**

Une **dialog obligatoire** s'affiche demandant le statut de la collaboration.

#### Options pour l'apprenant :
- ✅ **"J'ai trouvé un formateur"** → `status: "confirmed"`
- ❌ **"Pas intéressé"** → `status: "refused"`
- 🔄 **"Je continue à chercher"** → `status: "continued"` (réouverture du matching)

#### Options pour le tuteur :
- ✅ **"L'apprenant est devenu mon élève"** → `status: "confirmed"`
- ❌ **"Pas de collaboration"** → `status: "refused"`

**Code** :
```typescript
await dispatch(closeMatchingAction({
    matchingId: matching.id,
    status: "confirmed", // ou "refused", "continued"
    feedback: "J'ai trouvé un formateur",
    role: "student"
}))
```

---

### 3. **Confirmations mutuelles**

Quand une mise en relation passe à `confirmed`, les deux parties doivent avoir confirmé :

```typescript
// Après mise à jour du côté apprenant
{
  ...matching,
  status: "confirmed",
  learnerConfirmed: true,
  learnerConfirmedAt: "2026-02-18T10:00:00Z",
  learnerFeedback: "J'ai trouvé un formateur"
}

// Les stats du tuteur sont automatiquement mises à jour :
{
  "totalStudents": increment(1),
  "totalLessons": increment(1)
}
```

---

## 📊 Types de Données

### `Matching` (lib/types.ts)
```typescript
export interface Matching {
  id: string
  learnerId: string
  tutorId: string
  learnerName?: string
  tutorName?: string
  contactDate: Timestamp
  status: "open" | "confirmed" | "refused" | "continued"
  
  // Confirmations mutuelles
  learnerConfirmed?: boolean
  learnerConfirmedAt?: Timestamp
  tutorConfirmed?: boolean
  tutorConfirmedAt?: Timestamp
  
  // Feedback
  learnerFeedback?: string
  tutorFeedback?: string
  
  // Rappels automatiques
  reminderSentAt?: Timestamp
  reminderCount?: number
  
  closedAt?: Timestamp
  isMonetized?: boolean
  transactionId?: string
}
```

### `MonetizationTransaction` (lib/services/monetization-service.ts)
```typescript
export interface MonetizationTransaction {
  id?: string
  tutorId: string
  learnerId: string
  matchingId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  type: "lesson" | "platform_fee" | "bonus"
  description?: string
  createdAt?: Timestamp
  completedAt?: Timestamp
}
```

---

## 🔐 Services

### 1. **matching-service.ts**

**Fonctions principales** :

#### `initiateMatching(learnerId, tutorId, learnerName, tutorName)`
Crée une nouvelle mise en relation. Évite les doublons en 30 jours.

#### `getPendingMatchingsForUser(userId, role)`
Récupère les matchings en attente depuis 7+ jours pour un utilisateur.

#### `updateMatchingStatus(matchingId, status, feedback, role)`
Met à jour le statut d'un matching et enregistre les confirmations mutuelles.

**Important** : Si une collaboration est confirmée des deux côtés, elle met automatiquement à jour les stats du tuteur :
```typescript
await recordCollaborationStats(learnerId, tutorId)
// Incrémente totalStudents et totalLessons du tuteur
```

#### `sendReminderForExpiredMatchings()`
Fonction à appeler via un Cloud Function ou un job cron pour envoyer des rappels après 7 jours.

#### `getTutorMatchingStats(tutorId)`
Retourne les stats de matching : total, confirmé, refusé, en attente.

---

### 2. **monetization-service.ts**

**Fonctions principales** :

#### `recordTransaction(transaction)`
Enregistre une nouvelle transaction de monétisation.

#### `updateTransactionStatus(transactionId, status)`
Met à jour le statut d'une transaction (pending → completed).

#### `updateReputationStats(tutorId)`
Calcule et met à jour les stats de réputation d'un tuteur :
- `totalEarnings`: Somme des revenus
- `totalLessonsCompleted`: Nombre de leçons
- `verificationLevel`: Bronze/Silver/Gold/Platinum

#### `calculateTrustScore(stats)`
Calcule un score de confiance (0-100) basé sur :
- Nombre de leçons complétées (30%)
- Note moyenne (40%)
- Nombre d'étudiants (20%)
- Revenus totaux (10%)

#### `getTutorTransactions(tutorId, status?)`
Récupère les transactions d'un tuteur avec filtrage optionnel.

#### `generateTutorFinancialSummary(tutorId)`
Génère un récap financier complet.

---

### 3. **platform-stats-service.ts**

**Fonctions principales** :

#### `getPlatformMatchingStats()`
Stats globales de la plateforme :
- Total de matchings
- Taux de succès
- Temps moyen pour confirmer
- Matchings refusés vs acceptés

#### `getTutorStatsReport(tutorId)`
Rapport détaillé pour un tuteur spécifique.

#### `getTopTutors(limit)`
Récupère les meilleurs tuteurs triés par taux de succès.

#### `generateMatchingReport(period)`
Rapport par période (semaine, mois, année).

---

## 🏪 Redux Store Configuration

### **matching-slice.ts**

**State** :
```typescript
{
  pendingMatchings: Matching[],    // Matchings en attente
  allMatchings: Matching[],        // Tous les matchings
  loading: boolean,
  error: string | null,
  stats: {                         // Stats du tuteur
    totalMatched: number,
    confirmed: number,
    refused: number,
    pending: number
  } | null
}
```

**Actions disponibles** :

- `fetchPendingMatchings({ userId, role })` : Récupère les matchings en attente
- `closeMatchingAction({ matchingId, status, feedback, role })` : Clôt un matching
- `recordContact({ learnerId, tutorId, learnerName, tutorName })` : Enregistre un contact
- `fetchTutorStats(tutorId)` : Charge les stats d'un tuteur
- `triggerReminders()` : Déclenche les rappels automatiques

---

## hooks

### **use-matching-followup.ts**

```typescript
const {
  pendingMatchings,      // Matchings en attente
  loading,               // State de chargement
  error,                 // Messages d'erreur
  stats,                 // Stats du tuteur
  closeMatching,         // Fonction pour clôturer
  refreshPending,        // Rafraîchir la liste
  loadStats,             // Charger les stats
  triggerRemindersManually  // Déclencher les rappels
} = useMatchingFollowup()
```

---

## 🎨 Composants UI

### **MatchingFollowupDialog**
Dialog obligatoire affichée après 7 jours avec les options de confirmation.

**Localisation** : `components/dashboard/matching-followup-dialog.tsx`

**Props** : Utilise le hook `useMatchingFollowup()` directement.

### **TutorStatsCard**
Affiche les statistiques du tuteur dans le dashboard.

**Localisation** : `components/tutors/tutor-stats-card.tsx`

**Affiche** :
- Total de mises en relation
- Matchings confirmés + % de succès
- Score de confiance avec badge (Bronze/Silver/Gold/Platinum)
- Revenus totaux

---

## 📱 Intégration dans les pages

### Dashboard Apprenant
```tsx
// app/[locale]/dashboard/layout.tsx
import { MatchingFollowupDialog } from '@/components/dashboard/matching-followup-dialog'

export default function DashboardLayout({children}) {
  return (
    <div>
      {children}
      <MatchingFollowupDialog />  {/* Affichée automatiquement */}
    </div>
  )
}
```

### Dashboard Tuteur (Betreuer)
```tsx
// app/[locale]/betreuer/page.tsx
import { TutorStatsCard } from '@/components/tutors/tutor-stats-card'

export default function BetreuerDashboard() {
  return (
    <div>
      <TutorStatsCard />  {/* Affiche ses stats */}
    </div>
  )
}
```

---

## 🚀 Workflows d'utilisation

### Workflow 1 : Apprenant contacte un tuteur
```
1. Apprenant clique "Contacter" sur profil tuteur
   → dispatch(recordContact({...}))
   
2. Firebase crée un document matching
   → Email/Notification envoyée au tuteur
   
3. Après 7 jours
   → MatchingFollowupDialog s'affiche
   → Apprenant choisit une option
   → Matching status mis à jour
```

### Workflow 2 : Tuteur confirme la collaboration
```
1. Tuteur reçoit notification du matching
   → Va sur dashboard
   
2. MatchingFollowupDialog affiche ses options
   
3. Tuteur clique "L'apprenant est devenu mon élève"
   → Collaboration confirmée
   → Stats mises à jour
   → Si apprenant aussi confirmé: transactions enregistrées
```

### Workflow 3 : Suivi des revenues
```
1. Apprenant + Tuteur confirmés
   → recordCollaborationStats() appelée
   → totalStudents/totalLessons incrémentés
   
2. Lesson booking créée/complétée
   → recordTransaction() enregistre le paiement
   
3. Tuteur consulte le dashboard
   → TutorStatsCard affiche earn + score de confiance
   → generateTutorFinancialSummary() pour le récap
```

---

## ⚙️ Configuration & Constants

### matching-service.ts
```typescript
const MATCHING_TIMEOUT_DAYS = 7          // Jours avant rappel
const REMINDER_INTERVAL_DAYS = 3         // Interval entre rappels
const MAX_REMINDERS = 2                  // Max rappels par matching
```

### Collections Firestore
```
users/
matchings/
conversations/
monetizationTransactions/
collaborationStats/
tutors/
students/
bookings/
reviews/
```

---

## 🔔 Rappels Automatiques (Cloud Functions)

À implémenter via Firebase Cloud Functions pour déclencher quotidiennement :

```javascript
// functions/sendMatchingReminders.js
exports.sendMatchingReminders = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    await sendReminderForExpiredMatchings()
    console.log('Reminders sent!')
  })
```

---

## ✅ Checklist d'implémentation

- [x] Types améliorés (confirmations mutuelles, monétisation)
- [x] Service matching complet (initiation, suivi, stats)
- [x] Service monétisation (transactions, reputation, trust score)
- [x] Service stats plateforme (rapports globaux)
- [x] Redux slice amélioré (tous les états)
- [x] Hook use-matching-followup enrichi
- [x] Component MatchingFollowupDialog
- [x] Component TutorStatsCard
- [ ] Cloud Functions pour les rappels
- [ ] Notifications email/push
- [ ] Admin panel pour les statistiques
- [ ] Payment integration (Stripe/PayPal)

---

## 🐛 Troubleshooting

### Les matchings en attente ne s'affichent pas ?
→ Vérifier que `contactDate` est bien un Timestamp Firebase
→ Vérifier que le rôle (student/tutor) est correct

### Stats ne se mettent pas à jour ?
→ Appeler `updateReputationStats(tutorId)` après chaque matching confirmé
→ Vérifier les permissions Firestore (write sur `tutors`)

### Rappels ne s'envoient pas ?
→ Cloud Function à déployer : `firebase deploy --only functions`
→ Vérifier les logs : Console Firebase > Functions

---

## 📚 Références

- [Firestore Collections](./lib/collections.ts)
- [Types](./lib/types.ts)
- [Services](./lib/services/)
- [Redux Store](./lib/store/)
- [Hooks](./hooks/)
- [Components](./components/)

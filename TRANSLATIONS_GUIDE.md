# Guide des Traductions

## Structure Actuelle

```
messages/
├── en.json              ← Traductions EXISTANTES (à garder)
├── fr.json              ← Traductions EXISTANTES (à garder)
├── en/
│   ├── dashboard.json   ← NOUVELLES traductions (dashboard)
│   └── messages.json    ← NOUVELLES traductions (erreurs & notifications)
└── fr/
    ├── dashboard.json   ← NOUVELLES traductions (dashboard)
    └── messages.json    ← NOUVELLES traductions (erreurs & notifications)
```

## Comment ajouter une NOUVELLE section de traductions

### Étape 1 : Créer les fichiers

Créez deux fichiers (EN + FR) :
- `messages/en/[nom-section].json`
- `messages/fr/[nom-section].json`

### Étape 2 : Ajouter la référence dans `i18n/request.ts`

Modifiez cette ligne :
```typescript
const moduleFiles = ['dashboard', 'messages'];  // ← Ajouter votre nouveau fichier ici
```

Exemple : Si vous créez `payments.json`
```typescript
const moduleFiles = ['dashboard', 'messages', 'payments'];
```

### Étape 3 : Redémarrer le serveur

```bash
npm run dev
```

## Exemples

### Créer une section pour les PAIEMENTS

**`messages/en/payments.json`** :
```json
{
  "billing": {
    "title": "Billing",
    "invoices": "Invoices",
    "paymentMethod": "Payment Method"
  }
}
```

**`messages/fr/payments.json`** :
```json
{
  "billing": {
    "title": "Facturation",
    "invoices": "Factures",
    "paymentMethod": "Mode de paiement"
  }
}
```

**Utilisation dans un composant** :
```typescript
"use client"
import { useTranslations } from "next-intl"

export function BillingPage() {
  const t = useTranslations("billing")
  
  return <h1>{t("title")}</h1>  // → "Billing" ou "Facturation"
}
```

## Maintenir la cohérence

✅ Créez TOUJOURS les deux fichiers en même temps (en + fr)  
✅ Gardez la MÊME structure JSON dans les deux fichiers  
✅ Mettez à jour la liste `moduleFiles` dans `i18n/request.ts`  
✅ Redémarrez le serveur après chaque nouveau fichier  

## Fichiers actuels prêts à utiliser

### `dashboard.json`
- `t("common.loading")`
- `t("common.error")`
- `t("student.dashboard.title")`
- `t("tutor.dashboard.title")`
- etc.

### `messages.json`
- `t("errors.validation.required")`
- `t("errors.auth.unauthorized")`
- `t("notifications.success")`
- etc.

## Exemple complet d'ajout d'une section

### Créer une section "Tutors" (recherche/filtres)

1. Créer les fichiers :
```bash
touch messages/en/tutors.json
touch messages/fr/tutors.json
```

2. Remplir les fichiers avec la même structure :

**`en/tutors.json`**:
```json
{
  "search": {
    "title": "Find Tutors",
    "filters": "Filters",
    "level": "Level",
    "availability": "Availability"
  }
}
```

**`fr/tutors.json`**:
```json
{
  "search": {
    "title": "Trouver des Tuteurs",
    "filters": "Filtres",
    "level": "Niveau",
    "availability": "Disponibilité"
  }
}
```

3. Mettre à jour `i18n/request.ts` :
```typescript
const moduleFiles = ['dashboard', 'messages', 'tutors'];  // ← Ajouter ici
```

4. Redémarrer :
```bash
npm run dev
```

5. Utiliser dans vos composants :
```typescript
const t = useTranslations("search")
t("title")  // "Find Tutors" ou "Trouver des Tuteurs"
```

---

## 📝 Notes

- Les fichiers `{locale}.json` (ancien système) sont préservés et continuent de fonctionner
- Les nouveaux fichiers dans `{locale}/` sont fusionnés automatiquement
- Si une clé existe dans les deux, la version NEW (`{locale}/`) prend priorité
- Les changements dans les JSON nécessitent un redémarrage du serveur (dev)

# Messages / Traductions

## 📁 Structure

### Fichiers principaux (LEGACY - à conserver)
- `en.json` - Traductions EN (page d'accueil, sections existantes)
- `fr.json` - Traductions FR (page d'accueil, sections existantes)

### Nouveaux fichiers modulaires
- `en/dashboard.json` - Dashboards (étudiant/tuteur)
- `en/messages.json` - Erreurs et notifications
- `fr/dashboard.json` - Dashboards (étudiant/tuteur)
- `fr/messages.json` - Erreurs et notifications

## 🚀 Pour ajouter une nouvelle section

1. **Créer 2 fichiers** :
   - `en/[section].json`
   - `fr/[section].json`

2. **Mettre à jour** `i18n/request.ts` :
   ```typescript
   const moduleFiles = ['dashboard', 'messages', 'YOUR-NEW-FILE'];
   ```

3. **Redémarrer** : `npm run dev`

## 📖 Voir TRANSLATIONS_GUIDE.md pour des exemples complets

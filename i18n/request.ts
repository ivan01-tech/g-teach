import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale: string | undefined }) => {
  const resolvedLocale = locale || 'en';

  // Load legacy main messages file
  const legacyMessages = (await import(`../messages/${resolvedLocale}.json`)).default;

  // Load new modular messages from subdirectories
  const newMessages: Record<string, any> = {};
  const moduleFiles = ['dashboard', 'messages', "about"]; // Add more as needed

  for (const file of moduleFiles) {
    try {
      const moduleContent = await import(`../messages/${resolvedLocale}/${file}.json`);
      const content = moduleContent.default || moduleContent;
      Object.assign(newMessages, content);
    } catch (error) {
      // File doesn't exist yet, that's fine
    }
  }

  // Merge: legacy + new modular messages
  const messages = { ...legacyMessages, ...newMessages };

  return {
    locale: resolvedLocale,
    messages
  };
});
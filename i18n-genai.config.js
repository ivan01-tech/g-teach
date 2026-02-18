export default {
	// Where translation JSON files live
	localeFolder: 'messages',

	// Default locale
	defaultLocale: 'en',

	// Skip translating the default locale when running translate-all
	skipDefaultLocale: false,

	// File where extracted keys are stored
	// storageTranslationsFile: 'messages',

	// Supported locales
	locales: [
		{ code: 'en', label: 'English' },
		{ code: 'fr', label: 'French' },
	],

	// File extensions to scan for keys
	matches: ['.ts', '.tsx', '.js', '.jsx'],

	// Folder to scan for source files
	sourceFolder: './components',

	// Max keys per AI request
	maxKeysPerRequest: 300,
}
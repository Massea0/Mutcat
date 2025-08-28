export const i18nConfig = {
  defaultLocale: 'fr',
  locales: ['fr', 'en'],
} as const

export type Locale = (typeof i18nConfig)['locales'][number]
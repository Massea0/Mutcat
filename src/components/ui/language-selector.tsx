'use client'

import { useI18n } from '@/lib/i18n/context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'fr', name: 'Français', flag: '🇸🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
] as const

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 h-8 px-2 gap-1",
            className
          )}
          aria-label="Changer de langue"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block text-xs uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'fr' | 'en')}
            className="gap-2"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && (
              <Check className="h-4 w-4 text-senegal-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
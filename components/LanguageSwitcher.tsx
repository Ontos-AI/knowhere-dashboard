'use client';

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const localeLabels = {
    en: 'English',
    zh: '中文'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {localeLabels[locale as keyof typeof localeLabels] || 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className={locale === 'en' ? 'bg-muted' : ''}>
          <Link href={pathname} locale="en" className="w-full cursor-pointer">
            English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={locale === 'zh' ? 'bg-muted' : ''}>
          <Link href={pathname} locale="zh" className="w-full cursor-pointer">
            中文
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

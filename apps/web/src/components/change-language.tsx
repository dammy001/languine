"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import languineConfig from "../../languine.config";

export function ChangeLanguage() {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const locales = [
    languineConfig.locale.source,
    ...languineConfig.locale.targets,
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="items-center gap-2 text-secondary outline-none uppercase text-xs font-medium hidden md:flex"
      >
        [{currentLocale}]
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="max-h-[300px] overflow-y-auto"
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            // @ts-ignore
            onClick={() => changeLocale(locale)}
            className="uppercase text-xs"
          >
            {/* @ts-ignore */}
            {t(`language.${locale}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

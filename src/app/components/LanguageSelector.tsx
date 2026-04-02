import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "PT", label: "Português" },
    { code: "EN", label: "English" },
    { code: "ES", label: "Español" },
    { code: "DE", label: "Deutsch" },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
        <Globe className="w-5 h-5" />
        <span className="font-medium">{language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0f1c2e] border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? "bg-cyan-500/10 text-cyan-400" : ""
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

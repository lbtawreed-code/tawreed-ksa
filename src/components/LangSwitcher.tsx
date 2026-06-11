$path = "src\components\LangSwitcher.tsx"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$content = @'
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flagUrl: string; alt: string }[] = [
  { 
    code: "ar", 
    label: "العربية", 
    flagUrl: "https://flagcdn.com/w40/sa.png", 
    alt: "Saudi Arabia Flag" 
  },
  { 
    code: "en", 
    label: "English", 
    flagUrl: "https://flagcdn.com/w40/gb.png", 
    alt: "United Kingdom Flag" 
  },
  { 
    code: "fr", 
    label: "Français", 
    flagUrl: "https://flagcdn.com/w40/fr.png", 
    alt: "France Flag" 
  },
];

export function LangSwitcher({
  current,
  onChange,
}: {
  current: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <div className="glass-panel rounded-full p-1 flex items-center gap-1 shadow-soft">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          aria-label={l.label}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
            current === l.code
              ? "gradient-primary text-primary-foreground shadow-glow"
              : "text-foreground/70 hover:text-foreground"
          }`}
        >
          <img 
            src={l.flagUrl} 
            alt={l.alt} 
            className="w-4 h-auto object-contain rounded-sm inline-block" 
            style={{ minWidth: "16px" }}
          />
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
'@

[System.IO.File]::WriteAllLines((Resolve-Path .).Path + "\" + $path, $content, $utf8NoBom)

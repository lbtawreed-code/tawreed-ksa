import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ar", label: "العربية", flag: "\uD83C\uDDF8\uD83C\uDDE6" }, // 🇸🇦
  { code: "en", label: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },  // 🇬🇧
  { code: "fr", label: "Français", flag: "\uD83C\uDDEB\uD83C\uDDF7" }   // 🇫🇷
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
          <span className="text-base leading-none">{l.flag}</span>
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

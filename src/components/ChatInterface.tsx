import { useEffect, useRef, useState } from "react";
import { Send, Home, Sparkles, Mic, Square, FileText, ArrowRight, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mascotFace from "@/assets/tawreed-mascot-face.png";
import logoAr from "@/assets/ppa-logo-ar.png";
import logoEn from "@/assets/ppa-logo-en.png";
import { dict, type Lang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WEBHOOK_URL = "https://n8n.multydo.com/webhook/tawreed-chat";

type Doc = { name: string; url: string };
type Msg = {
  id: string;
  sender: "user" | "bot";
  text: string;
  docs?: Doc[];
  retry?: () => void;
};

export function ChatInterface({ lang, onHome }: { lang: Lang; onHome: () => void }) {
  const t = dict[lang];
  const sessionId = useRef("session-" + Date.now());
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: "init", sender: "bot", text: t.welcomeMsg }]);
  }, [lang, t.welcomeMsg]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const val = text.trim();
    if (!val || sending) return;
    const userMsg: Msg = { id: crypto.randomUUID(), sender: "user", text: val };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    try {
      const formData = new FormData();
      formData.append("chatInput", val);
      formData.append("sessionId", sessionId.current);
      formData.append("language", lang);
      formData.append("languageName", lang === "ar" ? "Arabic" : lang === "fr" ? "French" : "English");
      formData.append(
        "languageInstruction",
        `Reply ONLY in ${lang === "ar" ? "Arabic (العربية)" : lang === "fr" ? "French (Français)" : "English"}. Do not switch languages.`
      );

      const res = await fetch(WEBHOOK_URL, { method: "POST", body: formData });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: data.output || data.response || "...",
          docs: data.documents || [],
        },
      ]);
    } catch {
      setMessages((m) => [...m, { id: crypto.randomUUID(), sender: "bot", text: t.error }]);
    } finally {
      setSending(false);
    }
  }

  async function sendAudio(blob: Blob, formData?: FormData, isRetry = false) {
    if (!isRetry) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), sender: "user", text: "🎤 Voice message" }]);
    }
    setSending(true);

    const fd = formData ?? (() => {
      const f = new FormData();
      f.append("file", blob, "audio.webm");
      f.append("sessionId", sessionId.current);
      return f;
    })();

    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: data.output || data.response || "...",
          docs: data.documents || [],
        },
      ]);
    } catch (err) {
      console.error("[voice] upload failed", err);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), sender: "bot", text: t.error, retry: () => sendAudio(blob, fd, true) },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function startRecording() {
    if (recording || sending) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const finalMime = mr.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: finalMime });
        stream.getTracks().forEach((tr) => tr.stop());
        if (blob.size > 0) sendAudio(blob);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (err) {
      console.error("mic error", err);
      setMessages((m) => [...m, { id: crypto.randomUUID(), sender: "bot", text: "Microphone access denied." }]);
    }
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setRecording(false);
  }

  const logo = lang === "ar" ? logoAr : logoEn;

  return (
    <div className="relative flex min-h-screen h-[100dvh] flex-col overflow-hidden gradient-chat" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="orb" style={{ width: 320, height: 320, background: "hsl(var(--ppa-blue))", top: -80, right: -80, opacity: 0.15 }} />
      <div className="orb" style={{ width: 260, height: 260, background: "hsl(var(--ppa-green))", bottom: -60, left: -60, opacity: 0.15, animationDelay: "3s" }} />

      {/* PPA watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.06]">
        <img src={logo} alt="" className="w-[80%] h-[80%] object-contain" />
      </div>

      {/* Header */}
      <div
        className="sticky top-0 z-30 shrink-0 border-b border-white/40 bg-white/60 backdrop-blur-xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-3">
          <button
            onClick={onHome}
            className="h-10 w-10 rounded-xl glass-panel flex items-center justify-center hover:shadow-glow transition"
            aria-label="Home"
          >
            <Home size={18} style={{ color: "hsl(var(--ppa-blue))" }} />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="PPA" className="h-9 object-contain" />
          </div>
          <div className="h-10 w-10 rounded-xl overflow-hidden ring-2 ring-white shadow-soft">
            <img src={tawreedLogo} alt="Tawreed" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto" style={{ paddingTop: 16, paddingBottom: 32 }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col space-y-8">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} lang={lang} onSuggest={send} />
          ))}
          {sending && (
            <div className={`flex ${lang === "ar" ? "justify-end" : "justify-start"} fade-in`}>
              <div className="flex items-end gap-3 max-w-[85%]">
                <img src={mascotFace} alt="" className="h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-md flex-shrink-0" />
                <div className="glass-panel border border-gray-200 rounded-lg rounded-bl-sm px-5 py-4 shadow-soft">
                  <span className="typing-dot" />
                  <span className="typing-dot mx-1" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full shrink-0">
        {messages.length <= 1 && (
          <div className="max-w-4xl w-full mx-auto px-4 md:px-6 pb-3 fade-in">
            <div className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3 px-1 flex items-center gap-2" style={{ color: "hsl(var(--ppa-navy) / 0.5)" }}>
              <Sparkles size={12} style={{ color: "hsl(var(--ppa-blue))" }} />
              {lang === "ar" ? "اقتراحات" : lang === "fr" ? "Suggestions" : "Try asking"}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {t.suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{ animationDelay: `${i * 60}ms`, color: "hsl(var(--ppa-navy))" }}
                  className="fade-in group text-xs md:text-sm px-4 py-2.5 rounded-2xl bg-white/85 hover:bg-white border border-white shadow-soft backdrop-blur-md transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 font-medium"
                >
                  <Sparkles size={14} className="flex-shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-transform" style={{ color: "hsl(var(--ppa-blue))" }} />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full border-t border-white/40 bg-gradient-to-t from-white/95 via-white/90 to-white/70 backdrop-blur-2xl">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-3 pb-2 flex items-center gap-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder={t.placeholder}
              className="flex-1 h-12 px-5 rounded-2xl border-2 border-white bg-white/90 outline-none focus:bg-white transition-all duration-300 text-sm md:text-base placeholder:text-muted-foreground shadow-soft focus:shadow-glow"
            />

            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={sending && !recording}
              aria-label={recording ? "Stop recording" : "Start recording"}
              className={`relative h-12 w-12 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                recording
                  ? "bg-destructive border-destructive text-destructive-foreground scale-105"
                  : "bg-white/90 border-white shadow-soft hover:shadow-glow active:scale-95"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={!recording ? { color: "hsl(var(--ppa-blue))" } : undefined}
            >
              {recording && <span className="pulse-ring" />}
              {recording ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => send(input)}
              disabled={sending || !input.trim() || recording}
              aria-label={t.send}
              className="h-12 w-12 shrink-0 rounded-2xl border-2 bg-white/90 border-white shadow-soft hover:shadow-glow active:scale-95 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "hsl(var(--ppa-blue))" }}
            >
              <Send size={20} className={lang === "ar" ? "rotate-180" : ""} />
            </button>
          </div>
          <div
            className="max-w-4xl mx-auto px-4 md:px-6 pb-2 pt-1 text-center text-[10px] md:text-xs leading-tight font-semibold"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))", color: "hsl(var(--ppa-navy) / 0.65)" }}
          >
            {lang === "ar"
              ? "توريد قد يخطئ، القوانين والأنظمة هي المرجع"
              : lang === "fr"
              ? "Tawreed peut se tromper, les lois et règlements font foi"
              : "Tawreed can make mistakes. Laws and regulations are the reference."}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, lang, onSuggest }: { msg: Msg; lang: Lang; onSuggest: (text: string) => void }) {
  const isUser = msg.sender === "user";
  const align = isUser
    ? lang === "ar" ? "justify-start" : "justify-end"
    : lang === "ar" ? "justify-end" : "justify-start";

  const navy = "hsl(var(--ppa-navy-deep))";
  const mdComponents = {
    a: ({ node, ...props }: any) => (
      <a {...props} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: navy }} />
    ),
    h1: ({ node, ...props }: any) => <h1 {...props} className="font-bold mt-3 mb-2" style={{ color: navy }} />,
    h2: ({ node, ...props }: any) => <h2 {...props} className="font-bold mt-3 mb-2" style={{ color: navy }} />,
    h3: ({ node, ...props }: any) => <h3 {...props} className="font-bold mt-2 mb-1.5" style={{ color: navy }} />,
    h4: ({ node, ...props }: any) => <h4 {...props} className="font-bold mt-2 mb-1.5" style={{ color: navy }} />,
    strong: ({ node, ...props }: any) => <strong {...props} className="font-bold" style={{ color: navy }} />,
    ul: ({ node, ...props }: any) => <ul {...props} className="list-disc ps-6 my-2 space-y-1.5" />,
    ol: ({ node, ...props }: any) => <ol {...props} className="list-decimal ps-6 my-2 space-y-1.5" />,
    li: ({ node, ...props }: any) => <li {...props} className="leading-relaxed" />,
    p: ({ node, ...props }: any) => <p {...props} className="my-2 leading-relaxed" />,
  };

  if (isUser) {
    return (
      <div className={`flex ${align} fade-in`}>
        <div className="max-w-[85%] gradient-primary text-primary-foreground rounded-3xl px-5 py-3 shadow-elegant">
          <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
        </div>
      </div>
    );
  }

  const docs = (msg.docs || []).filter((d) => d.name && d.url && d.url !== "undefined");

  const nextActions = getNextActions(lang);

  return (
    <div className={`flex ${align} fade-in`}>
      <div className="flex items-end gap-3 max-w-[90%] w-full">
        <img src={mascotFace} alt="" className="h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-md flex-shrink-0" />
        <Card className="flex-1 glass-panel border border-gray-200 rounded-lg rounded-bl-sm px-5 py-4 shadow-soft">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="chat-prose prose prose-sm max-w-none text-foreground/90 leading-relaxed flex flex-col"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {msg.text}
            </ReactMarkdown>
          </div>
          {docs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {docs.map((d) => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-border hover:shadow-soft transition underline"
                  style={{ color: "hsl(var(--ppa-navy-deep))", borderColor: "hsl(var(--ppa-navy-deep) / 0.3)" }}
                >
                  <FileText size={13} />
                  {d.name}
                </a>
              ))}
            </div>
          )}
          {msg.id !== "init" && (
            <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-2">
              <Button size="sm" variant="default" onClick={() => onSuggest(nextActions[0])} className="gap-1.5">
                <ArrowRight size={14} /> {nextActions[0]}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onSuggest(nextActions[1])} className="gap-1.5">
                <Sparkles size={14} /> {nextActions[1]}
              </Button>
            </div>
          )}
          {msg.retry && (
            <button onClick={msg.retry} className="mt-3 text-xs font-semibold underline flex items-center gap-1" style={{ color: "hsl(var(--ppa-blue))" }}>
              <RefreshCw size={12} /> {lang === "ar" ? "إعادة المحاولة" : lang === "fr" ? "Réessayer" : "Retry"}
            </button>
          )}
        </Card>
      </div>
    </div>
  );
}

function parseBotMessage(text: string): { title: string; body: string; callout: string; steps: string[] } {
  const lines = text.split("\n");
  let title = "";
  let rest = text;

  // Title = first markdown heading or first non-empty line if short
  const headingMatch = text.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) {
    title = headingMatch[1].trim();
    rest = text.replace(headingMatch[0], "").trim();
  } else {
    const first = lines.find((l) => l.trim());
    if (first && first.length < 90 && lines.length > 1) {
      title = first.replace(/^\*+|\*+$/g, "").trim();
      rest = lines.slice(lines.indexOf(first) + 1).join("\n").trim();
    }
  }

  // Extract numbered steps (lines starting with "1.", "2.", etc.)
  const steps: string[] = [];
  const stepRegex = /^\s*\d+[.)]\s+(.+)$/gm;
  let m;
  while ((m = stepRegex.exec(rest)) !== null) steps.push(m[1].trim());
  if (steps.length > 0) rest = rest.replace(stepRegex, "").trim();

  // Callout: blockquote (lines starting with >) OR last paragraph if it begins with key markers
  let callout = "";
  const blockquoteMatch = rest.match(/(^|\n)((?:>\s?.*(?:\n|$))+)/);
  if (blockquoteMatch) {
    callout = blockquoteMatch[2].replace(/^>\s?/gm, "").trim();
    rest = rest.replace(blockquoteMatch[0], "").trim();
  }

  return { title, body: rest, callout, steps };
}

function getNextActions(lang: Lang): [string, string] {
  if (lang === "ar") return ["أخبرني المزيد", "أعطني مثالاً"];
  if (lang === "fr") return ["En savoir plus", "Donnez-moi un exemple"];
  return ["Tell me more", "Give me an example"];
}


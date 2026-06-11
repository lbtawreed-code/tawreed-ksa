export type Lang = "ar" | "en" | "fr";

type Feature = { t: string; d: string };

type Entry = {
  title: string;
  tagline: string;
  subtitle: string;
  welcome: string;
  desc: string;
  watchIntro: string;
  start: string;
  features: Feature[];
  disclaimer: string;
  disclaimerLabel: string;
  welcomeMsg: string;
  placeholder: string;
  send: string;
  error: string;
  suggestions: string[];
};

export const dict: Record<Lang, Entry> = {
  en: {
    title: "TAWREED",
    tagline: "Government Procurement AI",
    subtitle: "Your intelligent guide to Saudi government procurement and Etimad",
    welcome: "Welcome to TAWREED",
    desc: "I help you understand the <strong>Saudi Government Tenders and Procurement Law</strong>, navigate the Etimad platform procedures, and find the right answers — fast, accurate, and in your language.",
    watchIntro: "Watch intro",
    start: "Start chatting",
    features: [
      { t: "Trusted source", d: "Grounded in official Saudi laws, regulations, and Etimad guidelines." },
      { t: "Trilingual", d: "Arabic, English & French." },
      { t: "Knowledge base", d: "Procedures, competition rules & legal frameworks." },
    ],
    disclaimer: "TAWREED is an AI assistant. Responses may contain errors — official Saudi laws, regulations, and Etimad portal terms remain the sole legal reference.",
    disclaimerLabel: "Notice",
    welcomeMsg: "Hello! I'm TAWREED, your assistant on Saudi public procurement. How can I help you today?",
    placeholder: "Ask anything about Saudi tenders, competitions, or Etimad…",
    send: "Send",
    error: "Sorry, something went wrong. Please try again.",
    suggestions: [
      "What are the main rules of the Saudi Procurement Law?",
      "How do I participate in a competition on Etimad?",
      "Who is eligible to submit a proposal for government tenders?",
      "What is the mechanism for submitting a grievance or appeal?",
    ],
  },
  ar: {
    title: "توريد",
    tagline: "ذكاء المشتريات الحكومية",
    subtitle: "دليلك الذكي إلى المشتريات الحكومية ومنصة اعتماد في المملكة",
    welcome: "أهلاً بك في توريد",
    desc: "أساعدك على فهم <strong>نظام المنافسات والمشتريات الحكومية السعودي</strong>، والتنقّل في إجراءات منصة اعتماد، وإيجاد الإجابات الدقيقة بسرعة وبلغتك.",
    watchIntro: "شاهد المقدمة",
    start: "ابدأ المحادثة",
    features: [
      { t: "مصدر موثوق", d: "مبني على الأنظمة واللوائح الرسمية السعودية وأدلة منصة اعتماد." },
      { t: "ثلاثي اللغة", d: "العربية والإنكليزية والفرنسية." },
      { t: "قاعدة معرفة", d: "إجراءات، شروط المنافسات، والأطر النظامية." },
    ],
    disclaimer: "توريد مساعد ذكاء اصطناعي. قد تحتوي الإجابات على أخطاء — وتبقى الأنظمة واللوائح الحكومية الرسمية الصادرة وشروط منصة اعتماد المرجع القانوني الوحيد.",
    disclaimerLabel: "تنبيه",
    welcomeMsg: "مرحباً! أنا توريد، مساعدك في المشتريات الحكومية السعودية ومنصة اعتماد. كيف يمكنني مساعدتك اليوم؟",
    placeholder: "اسأل أي شيء عن المنافسات والمشتريات الحكومية…",
    send: "إرسال",
    error: "عذراً، حدث خطأ ما. يُرجى المحاولة مجدداً.",
    suggestions: [
      "ما هي أبرز قواعد نظام المنافسات والمشتريات الحكومية؟",
      "كيف يمكنني التقديم على فرصة استثمارية عبر اعتماد؟",
      "من المؤهل لتقديم العروض للمنافسات الحكومية؟",
      "ما هي آلية تقديم التظلمات أو الاعتراضات؟",
    ],
  },
  fr: {
    title: "TAWREED",
    tagline: "IA des Marchés Publics",
    subtitle: "Votre guide intelligent pour les marchés publics saoudiens et la plateforme Etimad",
    welcome: "Bienvenue sur TAWREED",
    desc: "Je vous aide à comprendre la <strong>loi saoudienne sur les appels d'offres et les marchés publics</strong>, à naviguer les procédures de la plateforme Etimad, et à trouver les bonnes réponses — rapidement, précisément, et dans votre langue.",
    watchIntro: "Voir l'intro",
    start: "Commencer à discuter",
    features: [
      { t: "Source de confiance", d: "Basé sur les lois officielles, les réglementations saoudiennes et les directives d'Etimad." },
      { t: "Trilingue", d: "Arabe, Anglais et Français." },
      { t: "Base de connaissances", d: "Procédures, règles de concurrence et cadres juridiques." },
    ],
    disclaimer: "TAWREED est un assistant IA. Les réponses peuvent contenir des erreurs — les lois officielles saoudiennes, les réglementations et les conditions de la plateforme Etimad restent la seule référence légale.",
    disclaimerLabel: "Avis",
    welcomeMsg: "Bonjour! Je suis TAWREED, votre assistant pour les marchés publics saoudiens et Etimad. Comment puis-je vous aider aujourd'hui?",
    placeholder: "Posez vos questions sur les appels d'offres saoudiens ou Etimad...",
    send: "Envoyer",
    error: "Désolé, un problème est survenu. Veuillez réessayer.",
    suggestions: [
      "Quelles sont les principales règles de la loi saoudienne sur les marchés publics?",
      "Comment participer à un appel d'offres sur Etimad?",
      "Qui est éligible pour soumettre une offre aux marchés publics?",
      "Quel est le mécanisme pour soumettre une réclamation ou un recours?",
    ],
  },
};

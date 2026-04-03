import { createContext, useContext, useState, ReactNode } from "react";

type Language = "PT" | "EN" | "ES" | "DE";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  PT: {
    "login.title": "Soccer Mind Control",
    "login.subtitle": "Painel administrativo",
    "login.welcome": "Bem-vindo",
    "login.welcomeSubtitle": "Acesse sua conta para continuar",
    "login.email": "Email",
    "login.password": "Senha",
    "login.rememberMe": "Lembrar-me",
    "login.forgotPassword": "Esqueceu a senha?",
    "login.button": "Entrar no Painel",
    "login.loading": "Entrando...",
    "login.error": "Email ou senha incorretos",
    "login.footer": "Sistema interno Soccer Mind • Uso exclusivo da equipe",
    "login.emailPlaceholder": "seu@email.com",
    "login.passwordPlaceholder": "••••••••",
    "dashboard.title": "Dashboard",
  },
  EN: {
    "login.title": "Soccer Mind Control",
    "login.subtitle": "Administrative Panel",
    "login.welcome": "Welcome",
    "login.welcomeSubtitle": "Access your account to continue",
    "login.email": "Email",
    "login.password": "Password",
    "login.rememberMe": "Remember me",
    "login.forgotPassword": "Forgot password?",
    "login.button": "Enter Panel",
    "login.loading": "Signing in...",
    "login.error": "Incorrect email or password",
    "login.footer": "Soccer Mind internal system • Exclusive team use",
    "login.emailPlaceholder": "your@email.com",
    "login.passwordPlaceholder": "••••••••",
    "dashboard.title": "Dashboard",
  },
  ES: {
    "login.title": "Soccer Mind Control",
    "login.subtitle": "Panel administrativo",
    "login.welcome": "Bienvenido",
    "login.welcomeSubtitle": "Accede a tu cuenta para continuar",
    "login.email": "Correo electrónico",
    "login.password": "Contraseña",
    "login.rememberMe": "Recuérdame",
    "login.forgotPassword": "¿Olvidaste tu contraseña?",
    "login.button": "Entrar al Panel",
    "login.loading": "Ingresando...",
    "login.error": "Correo o contraseña incorrectos",
    "login.footer": "Sistema interno Soccer Mind • Uso exclusivo del equipo",
    "login.emailPlaceholder": "tu@correo.com",
    "login.passwordPlaceholder": "••••••••",
    "dashboard.title": "Panel de Control",
  },
  DE: {
    "login.title": "Soccer Mind Control",
    "login.subtitle": "Administratives Panel",
    "login.welcome": "Willkommen",
    "login.welcomeSubtitle": "Greifen Sie auf Ihr Konto zu, um fortzufahren",
    "login.email": "E-Mail",
    "login.password": "Passwort",
    "login.rememberMe": "Erinnere dich an mich",
    "login.forgotPassword": "Passwort vergessen?",
    "login.button": "Panel betreten",
    "login.loading": "Anmelden...",
    "login.error": "Falsche E-Mail oder Passwort",
    "login.footer": "Soccer Mind internes System • Ausschließliche Teamnutzung",
    "login.emailPlaceholder": "ihre@email.com",
    "login.passwordPlaceholder": "••••••••",
    "dashboard.title": "Dashboard",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("PT");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

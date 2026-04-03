const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function sendWelcomeEmail(params: {
  name: string;
  email: string;
  role: string;
  password: string;
}): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Erro ao enviar email:", err);
  }
}

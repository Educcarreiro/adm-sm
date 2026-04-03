const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendWelcomeEmail(params: {
  name: string;
  email: string;
  role: string;
  password: string;
}): Promise<void> {
  const { name, email, role, password } = params;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0a1929; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #22d3ee; font-size: 28px; margin: 0;">Soccer Mind</h1>
        <p style="color: #94a3b8; margin-top: 8px;">Painel Administrativo</p>
      </div>

      <div style="background-color: #0f1c2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; margin-bottom: 24px;">
        <h2 style="color: #ffffff; margin-top: 0;">Olá, ${name}!</h2>
        <p style="color: #94a3b8; line-height: 1.6;">
          Você foi cadastrado no painel administrativo interno da <strong style="color: #22d3ee;">Soccer Mind</strong>.
          Abaixo estão suas credenciais de acesso:
        </p>

        <div style="background-color: #0a1929; border: 1px solid #22d3ee33; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #ffffff;">Email:</strong> ${email}</p>
          <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #ffffff;">Senha:</strong> ${password}</p>
          <p style="margin: 8px 0; color: #94a3b8;"><strong style="color: #ffffff;">Cargo:</strong> ${role}</p>
        </div>

        <p style="color: #94a3b8; line-height: 1.6;">
          Acesse o painel em: <a href="https://admsoccermind.com.br" style="color: #22d3ee;">admsoccermind.com.br</a>
        </p>

        <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
          Por segurança, recomendamos alterar sua senha no primeiro acesso.
        </p>
      </div>

      <p style="color: #475569; font-size: 12px; text-align: center;">
        Soccer Mind · Sistema interno · Uso exclusivo da equipe
      </p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Soccer Mind <adm@soccermind.com.br>",
      to: [email],
      subject: "Bem-vindo ao Painel Administrativo Soccer Mind",
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Erro ao enviar email:", err);
    throw new Error("Falha ao enviar email de boas-vindas");
  }
}

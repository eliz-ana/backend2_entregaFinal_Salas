import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

export async function sendPasswordResetEmail(to, url) {
  const html = `
    <div style="font-family: Arial, sans-serif">
      <h2>Restablecer contraseña</h2>
      <p>Hacé clic en el botón para restablecer tu contraseña. Este enlace vence en 1 hora.</p>
      <p style="margin: 24px 0">
        <a href="${url}" 
           style="background:#4f46e5;color:white;padding:12px 16px;text-decoration:none;border-radius:8px;">
          Restablecer contraseña
        </a>
      </p>
      <p>Si no fuiste vos, ignorá este correo.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Soporte" <no-reply@TuApp>`,
    to,
    subject: "Restablecer contraseña",
    html,
  });
}

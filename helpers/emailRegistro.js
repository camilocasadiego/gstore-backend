import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  //   Enviar email
  const {correo, usuario, token} = datos;

  const info = await transporter.sendMail({
    from: "GStore - Games Store",
    to: correo,
    subject: "Confirmar cuenta en GStore",
    text: "Confirmar tu cuenta en GStore",
    html: `
        <p>Hola ${usuario}, confirma tu cuenta en GStore.</p>
        <p>
            Tu cuenta ya estas lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        </p>
        <p>Si tu no creaste una cuenta puedes ignorar este mensaje.</p>
    `

  });

  console.log('Mensaje enviado: %s', info.messageId);

}

export default emailRegistro;
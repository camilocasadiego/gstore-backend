import nodemailer from 'nodemailer';

const emailRecuperarCuenta = async (datos) => {
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
    subject: "Recupera tu cuenta de GStore",
    text: "Recupera tu cuenta de GStore",
    html: `
        <p>Hola ${usuario}, recupera tu cuenta en GStore.</p>
        <p>
            Para cambiar tu contraseña debes ingresar al siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/cambiar-password/${token}">Recuperar Cuenta</a>
        </p>
        <p>Si no estas intentando restablecer tu contraseña puedes ingnorar este mensaje.</p>
    `

  });

  console.log('Mensaje enviado: %s', info.messageId);

}

export default emailRecuperarCuenta;
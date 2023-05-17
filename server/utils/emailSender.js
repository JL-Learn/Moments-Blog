import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.USER,
		pass: process.env.PASS,
	},
})

export const sendEmail = async (email, URL, res) => {
	const mailOptions = {
		from: `Memories Server 👻 <${process.env.USER}>`,
		to: email,
		subject: 'Redefina o link de senha para Memories',
		text: `Clique neste link para redefinir sua senha
		${URL}`,
	}

	transport.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error)
			return res.status(500).json({ message: 'Email não foi enviado' })
		}
		res.status(200).json(info)
	})
}

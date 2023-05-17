import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/posts', postRoutes)
app.use('/user', userRoutes)

app.get('/', (_, res) => res.send('Hello to Memories API'))

const PORT = process.env.PORT || 5000

mongoose // https://www.mongodb.com/cloud/atlas
	.connect(process.env.CONNECTION_URL)
	.then(console.log('Conectado ao MongoDB Database 🌐'))
	.then(() => app.listen(PORT, () => console.log(`Servidor na porta: ${PORT} 🚀`)))
	.catch((error) => console.log(`❎ Servidor não conectado ⚠️\n${error}`))
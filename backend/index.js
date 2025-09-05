import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import chatbotRoutes from './routes/chatbot.route.js'
import cors from 'cors'

const app = express()
dotenv.config()
const port = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected')
}).catch((err) => console.log(err))


//defining routes
app.use("/bot/v1/",chatbotRoutes)

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})


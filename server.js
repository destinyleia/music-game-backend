import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import imagesGameData from './data/images-game.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/music-game'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Image = mongoose.model('Image', {
  id: String,
  image: String
})

if (process.env.RESET_DB) {
  const fixedDatabase = async () => {
    await Image.deleteMany()
    imagesGameData.forEach((imagesGameData) => {
    new Image(imagesGameData).save()
    })
  }
  fixedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello welcome to my music game - image api!')
})

app.get('/images', async (req, res) => {
  const getImages = await Image.find(req.query)

  if (getImages) {
    res.json(getImages)
  } else {
    res.status(404).json({ error: 'There is no image like this' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

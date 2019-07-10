import express from 'express'
import path from 'path'

const app = express()

// Serve the frontend React app
app.use(express.static(path.join(__dirname, 'frontend')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
})

app.listen(8080)

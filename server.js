const express = require('express')
const app = express()

app.get('/stuff', (req, res) => {
  res.json({ "stuff": ['this', 'that', 'then'] })
})

app.listen(5000, () => {console.log("Server started on port 5000")})
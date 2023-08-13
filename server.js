const express = require('express')
const app = express()
const fs = require('fs')

app.get('/stuff', (req, res) => {
  fs.readFile('./workouts.json', 'utf-8', (err, jsonString) => {
    if(err) {
      console.log(err)
      res.status(500).json({ error: 'An error occured while reading the file'})
    } else {
      try {
        const data = JSON.parse(jsonString);
        console.log(data)
        res.json({ workouts: data})
      } catch (err) {
        console.log('Error parsing JSON:', err)
        res.status(500).json({ error: 'An error occured while parsing JSON'})
      }
    }
  })
})

app.listen(5000, () => {console.log("Server started on port 5000")})
const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json()); // Add this line to parse JSON in the request body

app.get('/stuff', (req, res) => {
  fs.readFile('./workouts.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred while reading the file' });
    } else {
      try {
        const data = JSON.parse(jsonString);
        res.json({ workouts: data });
      } catch (err) {
        console.log('Error parsing JSON:', err);
        res.status(500).json({ error: 'An error occurred while parsing JSON' });
      }
    }
  });
});

app.post('/stuff', (req, res) => {
  const newWorkout = req.body.newWorkout;
  console.log('Received new data', newWorkout);

  fs.readFile('./workouts.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file' });
    } else {
      try {
        const existingData = JSON.parse(jsonString);
        existingData.push(newWorkout)

        fs.writeFile('./workouts.json', JSON.stringify(existingData, null, 2), 'utf-8', writeErr => {
          if (writeErr) {
            console.error('Error writing to workouts.json:', writeErr);
            res.status(500).json({ error: 'An error occurred while writing to file' });
          } else {
            res.json({ message: 'Post was successful', workouts: existingData });
          }
        });
      } catch (parseErr) {
        console.log('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'An error occurred while parsing JSON' });
      }
    }
  });
});

app.delete('/stuff/:index', (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile('./workouts.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file' });
    } else {
      try {
        const existingData = JSON.parse(jsonString);
        existingData.splice(index, 1);

        fs.writeFile('./workouts.json', JSON.stringify(existingData, null, 2), 'utf-8', writeErr => {
          if (writeErr) {
            console.error('Error writing to workouts.json:', writeErr);
            res.status(500).json({ error: 'An error occurred while writing to file' });
          } else {
            res.json({ message: `Workout at index ${index} deleted successfully`, workouts: existingData });
          }
        });
      } catch (parseErr) {
        console.log('Error parsing JSON:', parseErr);
        res.status(500).json({ error: 'An error occurred while parsing JSON' });
      }
    }
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

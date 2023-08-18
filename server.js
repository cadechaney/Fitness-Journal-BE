const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./users.json');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const { generateUniqueId } = require('./utils'); 

app.use(express.json()); // Add this line to parse JSON in the request body

app.post('/users/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    user.token = token; // Update the user's token in memory
    updateUsersFile(users); // Update the users.json file
    res.json({ token, user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

function updateUsersFile(usersData) {
  fs.writeFile('./users.json', JSON.stringify(usersData, null, 2), 'utf-8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing to users.json:', writeErr);
    }
  });
}

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

app.delete('/stuff/:workoutId', (req, res) => {
  const workoutId = parseInt(req.params.workoutId);

  fs.readFile('./workouts.json', 'utf-8', (err, jsonString) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file' });
    } else {
      try {
        const existingData = JSON.parse(jsonString);
        
        const index = existingData.findIndex(workout => workout.id === workoutId)

        if(index === -1) {
          return res.status(404).json({error: 'Workout not found'})
        }

        existingData.splice(index, 1)

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

app.post('/users/signup', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Generate a unique ID for the new user (you can use a library like 'uuid')
  const newUserId = generateUniqueId(); // Make sure to define generateUniqueId()

  const newUser = {
    id: newUserId,
    username,
    password,
  };

  users.push(newUser);
  updateUsersFile(users);

  // Generate a JWT token with the user's ID
  const token = jwt.sign({ userId: newUserId }, secretKey, { expiresIn: '1h' });

  res.status(201).json({ message: 'User registered successfully', token, user: newUser });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

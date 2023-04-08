const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [{    title: "Two states",    description: "Given an array, return the maximum of the array?",    testCases: [{        input: "[1,2,3,4,5]",        output: "5"    }]
}];

const SUBMISSIONS = [];

app.use(express.json()); // Parse JSON body

// Signup route
app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user already exists in the USERS array
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send("User with this email already exists");
  }

  // Add the user to the USERS array
  USERS.push({ email, password });

  // Return back 200 status code to the client
  res.sendStatus(200);
});

// Login route
app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // Generate a token (just a random string for now)
  const token = Math.random().toString(36).substring(7);

  // Return back 200 status code and the token to the client
  res.status(200).json({ token });
});

// Get all questions route
app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

// Get all submissions route
app.get("/submissions", function(req, res) {
  res.json(SUBMISSIONS);
});

// Submit a solution route
app.post("/submissions", function(req, res) {
  const { problemIndex, solution } = req.body;

  // Check if the problem index is valid
  if (problemIndex < 0 || problemIndex >= QUESTIONS.length) {
    return res.status(400).send("Invalid problem index");
  }

  // Check if the solution is correct (just a random boolean for now)
  const isCorrect = Math.random() >= 0.5;

  // Add the submission to the SUBMISSIONS array
  SUBMISSIONS.push({ problemIndex, solution, isCorrect });

  // Return back 200 status code and whether the submission was correct or not
  res.status(200).json({ isCorrect });
});

// Add a new problem route (only for admins)
app.post("/problems", function(req, res) {
  const { title, description, testCases } = req.body;

  // Check if the user is an admin (just a random boolean for now)
  const isAdmin = Math.random() >= 0.5;
  if (!isAdmin) {
    return res.status(401).send("Only admins can add new problems");
  }

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push({ title, description, testCases });

  // Return back 200 status code
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

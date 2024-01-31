const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const Task = mongoose.model('Task', {
  taskName: String,
  deadline: Number,
});

app.post('/api/tasks', async (req, res) => {
  const { taskName, deadline } = req.body;
  console.log('Received task:', taskName, deadline);

  try {
    const newTask = new Task({ taskName, deadline });
    const savedTask = await newTask.save();
    console.log('Task saved in MongoDB:', savedTask);
    res.json(savedTask);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

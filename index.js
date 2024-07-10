const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Post schema and model
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});
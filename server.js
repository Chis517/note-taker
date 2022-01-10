const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data));
  })
});

app.post('/api/notes', (req, res) => {
  var newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  }
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    let allNotes = JSON.parse(data)
    allNotes.push(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(allNotes), err => {
      err ? console.log(err) : console.log('Saved New Note!');
    })
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  })
})

app.delete('/api/notes/:id', (req, res) => {
  let clicked = req.params.id
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    let allNotes = JSON.parse(data)
    let filtered = allNotes.filter(note => note.id !== clicked)
    fs.writeFile('./db/db.json', JSON.stringify(filtered), err => {
      err ? console.log(err) : console.log('Note Deleted!');
    })
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

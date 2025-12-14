const express = require('express');
const app = express();
const path = require('path');
app.use('/asset', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
    try {
    app.listen(808);
    }
    catch {
    console.log("something went wrong");
    }
app.get('/', (req, res) => res.status(200).sendFile(path.join(__dirname, 'pages', 'front_page.html')));
app.get('/song/:song_id', (req, res) => res.status(200).sendFile(path.join(__dirname, 'pages', 'song_page.html')));
app.get('/user/:user_id', (req, res) => res.status(200).sendFile(path.join(__dirname, 'pages', 'user_page.html')));
app.get('/songs', (req, res) => res.status(200).sendFile(path.join(__dirname, 'pages', 'search_song_page.html')));
app.get('/users', (req, res) => res.status(200).sendFile(path.join(__dirname, 'pages', 'search_user_page.html')));
app.get('*', (req, res) => res.status(400).redirect('/'));
app.post('*', (req, res) => res.status(405).redirect('/'));
app.put('*', (req, res) => res.status(405).redirect('/'));
app.patch('*', (req, res) => res.status(405).redirect('/'));
app.delete('*', (req, res) => res.status(405).redirect('/'));
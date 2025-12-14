const express = require('express');
const fs = require('fs');
const mysql2 = require('mysql2');
const bp = require('body-parser');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();
const app = express();
const upload = multer();
app.use(bp.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
const oauth2client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
oauth2client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const pool = mysql2.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
    });
    try {
    app.listen(process.env.SERVER_PORT);
    }
    catch {
    console.log("something went wrong");
    }
let new_users_data = [];
function create_session(res, user_id, success) {
const session_token = bcrypt.hashSync(Math.round(10000 + 89999 * Math.random()).toString(), 1);
    pool.query('delete from sessions where user_id="' + user_id + '"', (err, result, fields) => {
    if (err) res.status(503).send({ message: 'failed to create' });
        else pool.query('insert into sessions (user_id, token) values("' + user_id + '", "' + session_token + '")', (err, result, fields) => {
        if (err) res.status(503).send({ message: 'failed to create' });
        else res.status(success).send({ user_id: user_id, token: session_token });
        });
    });
}
app.get('/', (req, res) => res.status(400).send({message: 'invalid request'}));
    app.post('/login', (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(400).send({message: 'empty body'}); 
        else {
            pool.query('select email, password, id from users where email = "' + req.body.email + '"', (err, result, fields) => {
            if (err) res.status(503).send({message: 'database error'});
                if (result.length === 0) {
                const access_token = oauth2client.getAccessToken();
                    const transporter = nodemailer.createTransport({
                    service: 'gmail',
                        auth: {
                        type: 'oauth2',
                        user: process.env.VERIFY_EMAIL,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                        accessToken: access_token
                        }
                    });
                while (new_users_data.find(user => user.new_user_email === req.body.email) !== undefined) new_users_data.splice(new_users_data.findIndex(user => user.new_user_email === req.body.email), 1);
                    new_users_data.push({
                    verification_code: Math.round(1000000000 + 8999999999 * Math.random()).toString(),
                    new_user_email: req.body.email,
                    new_user_password: bcrypt.hashSync(req.body.password, 10)
                    });
                    const mail_options = {
                    from: process.env.VERIFY_EMAIL,
                    to: req.body.email,
                    subject: 'Muzotron verification code',
                    text: 'Code to activate your muzotron account: ' + new_users_data[new_users_data.length - 1].verification_code
                    }
                new_users_data[new_users_data.length - 1].verification_code = bcrypt.hashSync(new_users_data[new_users_data.length - 1].verification_code, 10);
                transporter.sendMail(mail_options);
                res.status(201).send({ message: 'sent email' });
                }
            for (const entry of result) if (bcrypt.compareSync(req.body.password, entry.password)) create_session(res, entry.id, 200);                
            else res.status(403).send({ message: 'access denied' });
            });
        }
    });
    app.post('/register', upload.single('pfp_upload'), (req, res) => {
    request_data = JSON.parse(req.body.user_data);
    if (Object.keys(req.body).length === 0) res.status(400).send({message: 'empty body'});   
        else {
        new_user_data = new_users_data.find(user => user.new_user_email === request_data.email);
            if (bcrypt.compareSync(request_data.code, new_user_data.verification_code)) {
            if (req.file !== undefined) fs.writeFileSync(path.join(__dirname, '/assets/pfp', request_data.user_link + '.png'), req.file.buffer);
                pool.query('insert into users (email, password, id, name, join_date) values("' + new_user_data.new_user_email + '", "' + new_user_data.new_user_password + '", "' + request_data.user_link + '", "' + request_data.name + '",  current_date())', (err, result, fields) => {
                if (err) res.status(503).send({ message: 'failed to create' });
                    else {
                    new_users_data.splice(new_users_data.findIndex(user => user.new_user_email === request_data.email), 1);
                    create_session(res, request_data.user_link, 201);
                    }
                });
            }
        else res.status(403).send({message: 'access denied'});         
        }
    });
    app.get('/user_info/:user_id', (req, res) => {
        pool.query('select name, join_date from users where id = "' + req.params['user_id'] + '"', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get user data'});
        if (result.length === 0) res.status(404).send({message: 'no such user exist'});
            else for (const entry of result) res.status(200).send({
            name: entry.name,
            join_date: entry.join_date
            });
        });
    });
    app.get('/user_pfp/:user_id', (req, res) => {
    if (fs.existsSync(path.join(__dirname, '/assets/pfp', req.params['user_id'] + '.png'))) user_pfp = fs.readFileSync(path.join(__dirname, '/assets/pfp', req.params['user_id'] + '.png'));
    else user_pfp = fs.readFileSync(path.join(__dirname, '/assets/pfp', 'default.png'));
    res.status(200).send(user_pfp);
    });
    app.get('/users', (req, res) => {
        pool.query('select users.id, avg(comments.rating) as rating from users left join songs on users.id = songs.author_id left join comments on songs.id = comments.song_id where  users.name like "' + req.query.search + '%" group by users.id order by rating desc', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get user data'});
        if (result.length === 0) res.status(404).send({message: 'no such user exist'});
            else {
            let search_result = []
            for (const entry of result) search_result.push(entry.id);
            res.status(200).send(search_result);
            }
        });
    });
    app.post('/upload_song', upload.fields([{ name: 'song_upload', maxCount: 1 }, { name: 'cover_upload', maxCount: 1 }]), (req, res) => {
    request_data = JSON.parse(req.body.song_data);
    let upload_query;
    if (request_data.desc === '') upload_query = 'insert into songs (id, author_id, name, upload_date) values("' + request_data.song_link + '", "' + request_data.author_id + '", "' + request_data.name + '",  current_date())';
    else upload_query = 'insert into songs (id, author_id, name, description, upload_date) values("' + request_data.song_link + '", "' + request_data.author_id + '", "' + request_data.name + '", "' + request_data.desc + '",  current_date())';
    if (Object.keys(req.body).length === 0) res.status(400).send({message: 'empty body'}); 
        else {
        fs.writeFileSync(path.join(__dirname, '/assets/music', request_data.song_link + '.mp3'), req.files.song_upload[0].buffer);
        if (req.files.cover_upload !== undefined) fs.writeFileSync(path.join(__dirname, '/assets/cover', request_data.song_link + '.png'), req.files.cover_upload[0].buffer);
            pool.query(upload_query, (err, result, fields) => {
            if (err) res.status(503).send({ message: 'failed to create' });
            else res.status(201).send({ id: request_data.song_link });
            });
        }
    });
    app.get('/song_info/:song_id', (req, res) => {
        pool.query('select songs.name, songs.upload_date, songs.description, songs.author_id, avg(comments.rating) as rating from songs left join comments on songs.id = comments.song_id where songs.id = "' + req.params['song_id'] + '"', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get song data'});
        if (result.find(entry => entry.name === null && entry.upload_date === null && entry.description === null && entry.rating === null)) res.status(404).send({ message: 'no such song exist' });
            else for (const entry of result) {
            let rating_score = entry.rating;
            if (rating_score !== null) rating_score = Number(rating_score);
                res.status(200).send({
                name: entry.name,
                upload_date: entry.upload_date,
                description: entry.description,
                rating: rating_score,
                author_id: entry.author_id
                });
            }
        });
    });
    app.get('/song_file/:song_id', (req, res) => {
        if (fs.existsSync(path.join(__dirname, '/assets/music', req.params['song_id'] + '.mp3'))) {
        song_file = fs.readFileSync(path.join(__dirname, '/assets/music', req.params['song_id'] + '.mp3'));
        res.status(200).send(song_file);
        }
    else res.status(410).send({message: 'song unavailable'});
    });
    app.get('/song_cover/:song_id', (req, res) => {
    if (fs.existsSync(path.join(__dirname, '/assets/cover', req.params['song_id'] + '.png'))) cover_art = fs.readFileSync(path.join(__dirname, '/assets/cover', req.params['song_id'] + '.png'));
    else cover_art = fs.readFileSync(path.join(__dirname, '/assets/cover', 'default.png'));
    res.status(200).send(cover_art);
    });
    app.get('/user_songs/:user_id', (req, res) => {
        pool.query('select id from songs where author_id = "' + req.params['user_id'] + '" order by upload_date desc', (err, result, fields) => {
        if (err) res.status(503).send({ message: 'cant get song data' });
        if (result.length === 0) res.status(404).send({ message: 'user has no songs' });
            else {
            let user_songs = []
            for (const entry of result) user_songs.push(entry.id);
            res.status(200).send(user_songs);
            }
        });
    });
    app.get('/songs', (req, res) => {
        pool.query('select songs.id, avg(comments.rating) as rating from songs left join comments on songs.id = comments.song_id where name like "' + req.query.search + '%" group by songs.id order by rating desc', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get song data'});
        if (result.length === 0) res.status(404).send({message: 'no such song exist'});
            else {
            let search_result = []
            for (const entry of result) search_result.push(entry.id);
            res.status(200).send(search_result);
            }
        });
    });
    app.get('/today_songs', (req, res) => {
        pool.query('select id from songs where datediff(current_date(), songs.upload_date) <= 0', (err, result, fields) => {
        if (err) res.status(503).send({ message: 'cant get song data' });
        if (result.length === 0) res.status(404).send({message: 'no songs today'});
            else {
            let search_result = []
            for (const entry of result) search_result.push(entry.id);
            res.status(200).send(search_result);
            }
        });
    });
    app.get('/week_songs', (req, res) => {
        pool.query('select songs.id, avg(comments.rating) as rating from songs left join comments on songs.id = comments.song_id where datediff(current_date(), songs.upload_date) <= 7 group by songs.id order by rating desc limit 20', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get song data'});
        if (result.length === 0) res.status(404).send({message: 'no songs this week'});
            else {
            let search_result = [];
            for (const entry of result) search_result.push(entry.id);
            res.status(200).send(search_result);
            }
        });
    });
    app.post('/post_comment', (req, res) => {
    let upload_query;
        if (req.body.unrated) {
        if (req.body.content === '') upload_query = 'insert into comments (id, author_id, song_id, post_date) values("' + req.body.comment_id + '", "' + req.body.author_id + '", "' + req.body.song_id + '",  current_date())';
        else upload_query = 'insert into comments (id, author_id, song_id, content, post_date) values("' + req.body.comment_id + '", "' + req.body.author_id + '", "' + req.body.song_id + '", "' + req.body.content + '",  current_date())';
        }      
        else {
        if (req.body.content === '') upload_query = 'insert into comments (id, author_id, song_id, rating, post_date) values("' + req.body.comment_id + '", "' + req.body.author_id + '", "' + req.body.song_id + '", "' + req.body.rating + '",  current_date())';
        else upload_query = 'insert into comments (id, author_id, song_id, content, rating, post_date) values("' + req.body.comment_id + '", "' + req.body.author_id + '", "' + req.body.song_id + '", "' + req.body.content + '", "' + req.body.rating + '",  current_date())';
        }
    if (Object.keys(req.body).length === 0) res.status(400).send({message: 'empty body'});
        else pool.query(upload_query, (err, result, fields) => {
        if (err) res.status(503).send({ message: 'failed to create' });
        else res.status(201).send({ message: 'posted comment' });
        });
    });
    app.get('/song_comments/:song_id', (req, res) => {
        pool.query('select id, author_id from comments where song_id = "' + req.params['song_id'] + '" order by post_date desc', (err, result, fields) => {
        if (err) res.status(503).send({ message: 'cant get comment data' });
        if (result.length === 0) res.status(404).send({ message: 'song has no comments' });
            else {
            let song_comments = []
            for (const entry of result) song_comments.push({comment_id: entry.id, author_id: entry.author_id});
            res.status(200).send(song_comments);
            }
        });
    });
    app.get('/comment_info/:comment_id', (req, res) => {
        pool.query('select author_id, content, rating, post_date from comments where id = "' + req.params['comment_id'] + '"', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get comment data'});
        if (result.length === 0) res.status(404).send({ message: 'no such comment exist' });
            else for (const entry of result) {
                res.status(200).send({
                author_id: entry.author_id,
                content: entry.content,
                rating: entry.rating,
                post_date: entry.post_date
                });
            }
        });
    });
    app.get('/authenticate', (req, res) => {
        pool.query('select token from sessions where user_id = "' + req.query.user_id + '"', (err, result, fields) => {
        if (err) res.status(503).send({message: 'cant get session data'});
        if (result.length === 0) res.status(401).send({ message: 'unauthorized' });
            else for (const entry of result) {
            if (entry.token === req.query.token) res.status(200).send();
            else res.status(401).send({ message: 'unauthorized' });
            }
        });
    });
    app.delete('/logout', (req, res) => {
        pool.query('delete from sessions where user_id="' + req.body.id + '"', (err, result, fields) => {
        if (err) res.status(503).send({ message: 'failed to create' });
        else res.status(200).send({ message: 'logout successful' });
        });
    });
app.get('*', (req, res) => res.status(400).redirect('/'));
app.post('*', (req, res) => res.status(400).redirect('/'));
app.put('*', (req, res) => res.status(400).redirect('/'));
app.patch('*', (req, res) => res.status(405).redirect('/'));
app.delete('*', (req, res) => res.status(405).redirect('/'));
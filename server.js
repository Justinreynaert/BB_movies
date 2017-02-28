/*
REST SERVER.JS voor Movies_BB
met Express en MongoDB
 */

// dependencies

var application_root = __dirname;
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

// BodyParser/MethodOverride/errorHandler geen deel meer van Express 4.x -- Zelf toevoegen via npm installs --save
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

mongoose.connect('mongodb://localhost/filmotheek');



// server
var app = express();

    // bodyParser deprecated --
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(methodOverride());


    // app.use(app.router); // OVERBODIG IN EXPRESS 4 ----!!!
    // toon all fouten
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
    app.use(express.static(path.join(application_root,'app')));

// start server
var port = 6012;
app.listen(port,function(){
    console.log('Express server luistert op poort %d in %s mode',port,app.settings.env);
});

var Cast = new mongoose.Schema({
    acteur: String
});

//Film Schema
var Film = new mongoose.Schema({
    filmNr: Number,
    titel: String,
    beschrijving: String,
    genre: String,
    cast: [Cast],
    duur: String,
    regisseur: String,
    release: Date,
    foto: String
});

//mongoDB Model
var filmModel = mongoose.model('Film',Film);

//Routes ===============

//GET /api/films : ALLE FILMS TONEN
app.get('/api/films', function(request, response) {
    return filmModel.find(function(err,films) {
        if (!err) {
            response.send(films);
        }
        else {
            return console.log(err);
        }
    })
});

//GET /api/fims/id: GET enkele film by ID

app.get('/api/films/:id', function(request, response){
    return filmModel.findById(request.params.id,function(err,films) {
        if (!err) {
            response.send(films);
        }
        else {
            return console.log(err);
        }
    })
});

//POST /api/films : film toevoegen

app.post('/api/films', function(request,response) {

    console.log(request.body);
    var film = new filmModel({
        filmId: request.body.filmId,
        titel: request.body.titel,
        beschrijving : request.body.beschrijving,
        genre: request.body.genre,
        duur: request.body.duur,
        regisseur: request.body.regisseur,
        release: request.body.release,
        foto : request.body.foto,
        cast: request.body.cast
    });

    film.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }

    });

    return response.send(film);
});

//PUT api/films/id update een film
app.put('/api/films/:id', function(request, response) {
    console.log('updating film' + request.body.titel);

    return filmModel.findById(request.params.id, function(err, film) {
            filmId = request.body.filmId;
            titel = request.body.titel;
            beschrijving = request.body.beschrijving;
            genre = request.body.genre;
            duur = request.body.duur;
            regisseur = request.body.regisseur;
            release = request.body.release;
            foto = request.body.foto;
            film.cast = request.body.cast;

            return film.save(function(err) {
                if (!err) {
                    console.log('film geupdated');
                    return response.send(film);
                }
                else {
                    return console.log(err);
                }
            })
    })
});

app.delete('/api/films/:id', function(request,response) {
    console.log('verwijderen film met id ' + request.params.id);
    return filmModel.findById(request.params.id, function(err, film) {
        return film.remove(function(err) {
            if (!err) {
                console.log('film gewist');
                return response.send('');
            }
            else {
                return console.log(err);
            }
        })
    })
});




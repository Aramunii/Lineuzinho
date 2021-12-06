//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');
const translate = require('translate');
async function teste() {

     var response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
     const text = await translate(response.data.text, "pt");

}

teste();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}
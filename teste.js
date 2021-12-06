//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');

async function teste() {

    var response = await axios.get('http://desciclopedia.org/wiki/Especial:Aleat%C3%B3ria')

    var $ = cheerio.load(response.data);
    
    var title = $('.firstHeading').text();
    var content = $('.mw-parser-output').text();

    console.log(title , content);

}

teste();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}
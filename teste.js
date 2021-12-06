//var another = require('./movie.js');
var another = require('./steam.js');
const fs = require('fs');
const axios = require('axios');
const Path = require('path')
const cheerio = require('cheerio');

async function teste() {

    var response = await axios.get('https://www.allmusic.com/genre/rap-ma0000002816/')

    var $ = cheerio.load(response.data);

    var response = await axios.get('https://www.allmusic.com/genre/rap-ma0000002816/artists')
    $ = cheerio.load(response.data);
    var artists = $('.info-grid').toArray();

    artists = artists.map(element => {
        return $(element).find('.artist').text().trim();
    })

    var response = await axios.get('https://www.allmusic.com/genre/rap-ma0000002816/albums')
    $ = cheerio.load(response.data);
    var albums = $('.album-highlight').toArray();
    artists += albums.map(element => {
        return $(element).find('.title').text().trim();
    })

    var response = await axios.get('https://www.allmusic.com/genre/rap-ma0000002816/songs')
    $ = cheerio.load(response.data);
    var albums = $('.song-highlights').find('table').find('.title').toArray();
    artists += albums.map(element => {
        return $(element).data('sort-value');
    })

    artists = artists.split(',')
    var currNum = Math.round((artists.length - 1) * Math.random());
    console.log(artists[currNum])

}

teste();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function replaceToEmoji(number) {

}
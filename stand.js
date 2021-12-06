const axios = require('axios');
const fs = require('fs');
const Path = require('path')
const cheerio = require('cheerio');

var methods = {};

methods.getStand = async function getMovieRandom(link) {
    var response = await axios.get(link + '/artists')
    $ = cheerio.load(response.data);
    var artists = $('.info-grid').toArray();

    artists = artists.map(element => {
        return $(element).find('.artist').text().trim();
    })

    var response = await axios.get(link + '/albums')
    $ = cheerio.load(response.data);
    var albums = $('.album-highlight').toArray();
    artists += albums.map(element => {
        return $(element).find('.title').text().trim();
    })

    var response = await axios.get(link + '/songs')
    $ = cheerio.load(response.data);
    var albums = $('.song-highlights').find('table').find('.title').toArray();
    artists += albums.map(element => {
        return $(element).data('sort-value');
    })

    artists = artists.split(',')
    var currNum = Math.round((artists.length - 1) * Math.random());

    return artists[currNum];
}



exports.data = methods;

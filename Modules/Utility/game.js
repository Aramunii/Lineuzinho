const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Path = require('path')

var methods = {};

methods.getGame = async function getGame(query) {

    var search = query.split(' ').join('+');
    var response = await axios.get('https://fitgirl-repack.org/?s=' + search);

    const $ = cheerio.load(response.data);


    var links = $('.post').toArray()[0];
    console.log(links);
    var link = $(links).find('.entry-title').find('a').attr('href');
    var title = $(links).find('.entry-title').text();
    var img_link = $(links).find('.post-image').find('img').attr('src');

    if (typeof img_link != 'undefined') {
        var img = await downloadImage(img_link, query);
    }

    var game = {
        text: `*Jogo:* ${title} \n*Link:* ${link}`,
        poster_path: typeof img_link != 'undefined' ? query.replace(/[^\w\s]/gi, '') : '',
        error: typeof link == 'undefined' ? true : false
    }

    console.log(game);
    return game;
}



async function downloadImage(img_link, query) {
    const url = encodeURI(img_link)
    try {
        const path = 'modules/images/' + query.replace(/[^\w\s]/gi, '') + '.jpg'
        const writer = fs.createWriteStream(path)

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        console.log(writer);

        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })

    } catch (error) {
        console.log(error);
    }

}


exports.data = methods;

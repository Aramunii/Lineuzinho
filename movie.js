const axios = require('axios');
const fs = require('fs');
const Path = require('path')

var methods = {};

methods.getMovie = async function getMovieRandom() {
    var response = await axios.get('https://apimm.jukloud.com.br/getRandomWpp');
    response = response.data;

    var release_date = convertDate(response.release_date);
    var img = await downloadImage(response.poster_path);

    var movie = {
        text: `*Filme:* ${response.title} \n*Data de lançamento:* ${release_date} \n*Genêro:* ${response.genres}\n*Disponivel em:* ${response.providers}`,
        poster_path: response.poster_path.replace('/', '')
    }

    console.log(movie);

    return movie;
}

function convertDate(date) {
    var parts = date.split("-");
    var dt = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dt;
}

async function downloadImage(poster_path) {
    const url = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2' + poster_path
    const path = Path.resolve(__dirname, 'images', poster_path.replace('/', '') + '.jpg')
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })

}

exports.data = methods;

const axios = require('axios');
const fs = require('fs');
const Path = require('path')

var methods = {};

methods.getCat = async function getRandom() {

    var img = await downloadImage());

    return img;
}


async function downloadImage() {
    const url = 'https://cataas.com/cat/cute'
    const path = Path.resolve(__dirname, 'images', 'gato.jpg')
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

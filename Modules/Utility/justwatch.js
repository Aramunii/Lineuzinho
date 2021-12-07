const axios = require('axios');
const fs = require('fs');
const Path = require('path')

var methods = {};

methods.getNew = async function getMovieRandom(type) {
    var response = await axios.get(`https://apis.justwatch.com/content/titles/pt_BR/new?body=%7B%22providers%22:[%22${type}%22],%22enable_provider_filter%22:false,%22is_upcoming%22:false,%22titles_per_provider%22:10,%22monetization_types%22:[%22ads%22,%22buy%22,%22flatrate%22,%22flatrate_and_buy%22,%22rent%22,%22free%22],%22page%22:1,%22page_size%22:1,%22fields%22:[%22full_path%22,%22id%22,%22jw_entity_id%22,%22object_type%22,%22offers%22,%22poster%22,%22scoring%22,%22season_number%22,%22show_id%22,%22show_title%22,%22title%22,%22tmdb_popularity%22,%22backdrops%22]%7D&filter_price_changes=false&language=pt`);
    var json = response.data;
    var date = convertDate(json.days[0].date);
    var items = json.days[0].providers[0].items.map(item => {

        imdb_score = 'N/A'
        if (item.scoring) {
            imdb_scores = item.scoring.filter(score => {
                return score.provider_type == 'imdb:score';
            })
            console.log(imdb_scores[0]);
            if (typeof imdb_scores[0] != 'undefined') {
                imdb_score = imdb_scores[0].value;
            }
        }
        var show_title = item.show_title ? item.show_title : '';

        return `*Titúlo:* ${show_title} ${item.title}\n*IMDb:* ${imdb_score}`
    });

    var text = `*Data:* ${date}\n\n` + items.join('\n\n');

    return text;
}

methods.getPrime = async function getMovieRandom() {
    var response = await axios.get('https://apis.justwatch.com/content/titles/pt_BR/new?body=%7B%22providers%22:[%22prv%22],%22enable_provider_filter%22:false,%22is_upcoming%22:false,%22titles_per_provider%22:10,%22monetization_types%22:[%22ads%22,%22buy%22,%22flatrate%22,%22flatrate_and_buy%22,%22rent%22,%22free%22],%22page%22:1,%22page_size%22:1,%22fields%22:[%22full_path%22,%22id%22,%22jw_entity_id%22,%22object_type%22,%22offers%22,%22poster%22,%22scoring%22,%22season_number%22,%22show_id%22,%22show_title%22,%22title%22,%22tmdb_popularity%22,%22backdrops%22]%7D&filter_price_changes=false&language=pt');
    var json = response.data;
    var date = convertDate(json.days[0].date);

    var items = json.days[0].providers[0].items.map(item => {

        imdb_score = 'N/A'
        if (item.scoring) {
            imdb_scores = item.scoring.filter(score => {
                return score.provider_type == 'imdb:score';
            })
            console.log(imdb_scores[0]);
            if (typeof imdb_scores[0] != 'undefined') {
                imdb_score = imdb_scores[0].value;
            }
        }
        var show_title = item.show_title ? item.show_title : '';
        return `*Titúlo:* ${show_title} ${item.title}\n*IMDb:* ${imdb_score}`
    });

    var text = `*Data:* ${date}\n\n` + items.join('\n\n');

    return text;
}

function convertDate(date) {
    let data = new Date(date);
    let dataFormatada = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    return dataFormatada;
}

exports.data = methods;

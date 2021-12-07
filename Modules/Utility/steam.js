const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Path = require('path')

var methods = {};

methods.getSteam = async function getSteam(query) {

    var response = await axios.get(`https://api.steampowered.com/IStoreService/GetAppList/v1/?key=1C38BE712F5B29F307D179D41D4D384B`);

    var games = await response.data.response.apps.filter(function (el) {
        return el.name.toLowerCase().includes(query.toLowerCase().trim());
    });

    var result = await Promise.all(games.map(async (element) => {
        try {
            var response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${element.appid}`);
            var game = response.data[Object.keys(response.data)[0]];
            var discount = game.data.price_overview.discount_percent > 0 ? '*O Jogo está com desconto de ' + game.data.price_overview.discount_percent + '%* \n' : ''

            return `\n *${element.name}* \n
*Data Lançamento:* ${game.data.release_date.date}
*Preço:* ${game.data.price_overview.final_formatted}
*Link:* https://store.steampowered.com/app/${element.appid}/
${discount}
----------------------------------------`;
        } catch (e) {

        }
    }));


    var steam = {
        text: `🕹️ *STEAM* 👾 \n ${result.join('')}`,
        error: games.length > 0 ? false : true
    }


    return steam;

}



exports.data = methods;

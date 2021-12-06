
var methods = {};
const axios = require('axios');

methods.api = async function apiRequest(uri, data) {
    var type;
    if (typeof data == 'undefined') {
        type = 'GET';
    } else {
        type = 'POST';
    }
    var response = await axios.post('https://apimm.jukloud.com.br/lineu/' + uri, {
        data
    })

    return response.data;
}

exports.data = methods;


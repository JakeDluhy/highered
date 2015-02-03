var Mailgun = require('mailgun').Mailgun;
var apiKey = '';

var mg = new Mailgun(apiKey);

module.exports = mg;
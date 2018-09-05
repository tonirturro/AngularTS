/*
** Basic startup
*/

var app = require('./app').main;

app.application.set('port', process.env.PORT || 3000);

var server = app.application.listen(app.application.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

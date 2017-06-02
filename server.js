/*
** Basic startup
*/

var app = require('./App/app');
var open = require('open');

app.application.set('port', process.env.PORT || 3000);

var server = app.application.listen(app.application.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
    open("http://localhost:" + server.address().port);
});

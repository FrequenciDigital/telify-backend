var express = require('express'),
twilio = require('twilio'),
app = express(),
engine =  require('consolidate'),
assert = require('assert'),
bodyParser = require('body-parser'),
path = require('path'),
client = twilio();


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.engine('html',engine.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));


//handler function
function handler(req,res){
  console.log(req.body);
  var twiml = new twilio.TwimlResponse();
  var songLink=req.body.songLink;
  twiml.play(songLink);
  twiml.hangup();
  res.send(twiml.toString());
  app.set('data', twiml.toString());
}

// main route
app.get('/', function(req, res){

  res.json({

    'Message':'Welcome to the Telify backend'

});

});
// POST route for song. Handles the twilio stuff
app.post('/song', handler);

// GET request receives data from /song endpoint
app.get('/getSong', function(req,res){

res.send(app.get('data'));

});

//POST request to actually make the call. Gets data from getSong endpoint
app.post('/call', function(req,res){
  //phone number
  var number = req.body.phoneNumber;

  //make call with Twilio client
  client.makeCall({
    to: number,
    from: '+12027385182',
    url: 'http://frequenci.ngrok.io/getSong',
    method: 'GET'
  });


});





app.listen(3000, function(){
  console.log('Listening at http://localhost:3000');
});

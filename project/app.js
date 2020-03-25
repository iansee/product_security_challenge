var express = require('express');
var Checker = require('password-checker');
var bodyParser = require('body-parser');


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('accounts.json')
const db = low(adapter)
const crypto = require('crypto')
const saltedMd5 = require('salted-md5');
const expressSanitizer = require('express-sanitizer');

var Recaptcha = require('express-recaptcha').RecaptchaV3;
var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY',{callback:'cb'});


var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })


var app = express();

app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(cookieParser())
app.use(expressSanitizer());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (err, req, res, next) {

   if (err.code !== 'EBADCSRFTOKEN') {
   return next(err)}
   res.status(403);
   res.send(err)
   
 })

app.get('/',csrfProtection,function (req, res) {
   
   var path = require('path');
   res.render( path.resolve  ("index.html"),{ csrfToken: req.csrfToken() });
})

app.post('/login',csrfProtection,function(req,res,next){
   console.log(req.body);
   val = getaccount(req.body.user,req.body.password);
   if (val == '1' ){
      var tokenExpire = 14 * 24 * 3600000;
      res.cookie('local',{'username':req.body.user,"password":req.body.password,maxAge: tokenExpire,httpOnly:false});
      res.send('logged')
   }
   else
   {
   res.send(val)}
   
})
app.get('/login',function(req,res){
   var path = require('path');
   res.render( path.resolve  ("login.html"));
   
})

app.get('/create',csrfProtection,  function(req,res)
{  
   var path = require('path');
   res.render( path.resolve  ("account.html"),{ csrfToken: req.csrfToken() });
});

app.post('/create', csrfProtection,function(request,res){
   
   var passchecker = new Checker();
   passchecker.min_length = 8;
   passchecker.requireLetters(true);
   passchecker.requireNumbers(true);
   passchecker.requireSymbols(true);

   password = request.body.password;
   userid = request.sanitize(request.body.user);
   email = request.body.email;

   if (!passchecker.check(password)){
      res.send('password requires minimum length 8, numbers and symbols')
   }
   else{
      respond = createaccount(userid,password,email);
      res.send(respond);
   }
   });

function getaccount(userid,password){

   details = (db.get('accounts').find({username:userid}).value());
   if (!details){
      return ('user name or account is wrong');
   }
   else{
      local_tries = details.tries
      salt = details.salt
      hash = details.hash
      email = details.email

      if (local_tries > 5){
         return "Locked out - reset password"
      }

      if (saltedMd5(password,salt) == hash){
         return ('1');
      }
      else {   
         local_tries += 1
         db.get('accounts').find({username:userid}).assign({tries: local_tries}).write()
         return ('user name or account is wrong');
      }
   }
}

function createaccount(userid,password,email)
{
   salt = crypto.randomBytes(32).toString('hex');;
   saltedHash = saltedMd5(password,salt );
   if (db.get('accounts').value())
   {
   db.get('accounts').push({username:userid,salt:salt,hash:saltedHash,email:email,tries:0}).write();
   }
   else{
      db.defaults({accounts:[]}).write();
      db.get('accounts').push({username:userid,salt:salt,hash:saltedHash,email:email,tries:0}).write();
   }

   return 'account created';
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
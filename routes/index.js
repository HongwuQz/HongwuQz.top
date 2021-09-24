var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});
router.get('/virus',function(req,res,next){
  res.render('killVirus.html',{status: 0,interval: 800,speed: 3})
})

module.exports = router;

var express = require('express');
var router = express.Router();
var updateStreakUser = require('../schedule/updateStreakUser');
var sendNotification = require('../schedule/sendNotification');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/teste1', updateStreakUser);

router.get('/teste2', sendNotification);


module.exports = router;
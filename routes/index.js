var express = require('express');
var mysql   = require('mysql');
var router = express.Router();
var db      = require('../models/database');

db.query("CREATE TABLE IF NOT EXISTS tax_object(id int AUTO_INCREMENT NOT NULL , name varchar(255),tax_code tinyint(1),price float(11),primary key (id))",function (error, results, fields) {
  if (error) throw error;
  console.log("table has been created");
});

/* GET home page. */
router.get('/', function(req, res, next) {

  db.query("SELECT * FROM tax_object",function(err, result, fields){
    var data  = result;
  
    var tax_type   = [
      "Food & Beverages",
      "Tobacco",
      "Entertainment"
    ];
  
    if(data.length > 0){
      data.forEach(function(item,index){
        data[index].type  = tax_type[item.tax_code-1];
        
        var tax_code      = item.tax_code;
        if(tax_code == 1){
          data[index].tax     = (10*parseFloat(data[index].price))/100;
          data[index].refund  = "yes";
        }else if(tax_code == 2){
          data[index].tax     = 10 + (2*parseFloat(data[index].price)/100);
          data[index].refund  = "no";
        }else{
          if(data[index].price < 100){
            data[index].tax   = 0;
          }else{
            data[index].tax   = (parseFloat(data[index].price) - 100)*1/100;
          }
          data[index].refund  = "no";
        }
        data[index].amount  = parseFloat(data[index].price) + parseFloat(data[index].tax);
      });
    }

    res.render('index', { title: 'Express', data: data });
  });
});

router.get('/create',function(req,res,next){
  res.render('create');
});

router.post('/save',function(req,res,next){
  if(req.body){
    db.query("INSERT INTO tax_object(name,tax_code,price) VALUES ('"+ req.body.name +"','"+ req.body.tax_code +"','"+ req.body.price +"')",function(err,result){
      if(err) throw err;
      res.redirect("/");
    })
  }
});

module.exports = router;

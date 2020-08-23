var port = 3001;
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(express.static("public"));
// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbms'
});

// const dbConnection = require('database');

db.connect(function(error){
    if(!!error)
        console.log('Error');
    else
        console.log('connected');    
})
app.get("/", function(req, res){
    res.render('index');
})
app.get("/cars", function(req, res){
    var sql = "SELECT * FROM CARS";
        db.query(sql, function(error, results){
            if(error)
                console.log(error);
            else    
                {
                    if(results.length > 0){
                        //console.log(results);
                        // res.send(results);
                       res.render('cars',{cars:results});
                    }else
                        console.log("no data");
                }
        });
});

app.get("/customer", function(req, res){
    var sql = "SELECT CA.CAR_NAME, CA.PRICE, CU.* FROM CARS CA JOIN CUSTOMER CU ON CA.CAR_ID = CU.CAR_ID ORDER BY CU.PURCHASE_DATE DESC";
    var sql1 = "SLECT * FROM BOOKING";
    db.query(sql, sql1, function(err, results){
        if(err)
            console.log(err);
        else{
            res.render("customer", {detail:results});
        }
    })
})

app.get("/cars/:id", function(req, res){
    var KEY = req.params.id;
    var sql = "SELECT * FROM CARS JOIN SPECIFICATION ON CARS.CAR_ID = SPECIFICATION.CAR_ID AND CARS.CAR_ID = ? " ;
    // var sql = "SELECT * FROM CARS WHERE CARS.CAR_ID = 1";
    db.query(sql, KEY, function(err, results){
        if(err)
            console.log(err);
        else
        {
            if(results.length >0)
                res.render('cardet', {cardet:results});
            else
                res.redirect("/cars");
        }
    })
})

app.get("/employee", function(req, res){
    var sql = "SELECT * FROM EMPLOYEE";
    db.query(sql, function(err, results){
        if(err)
        {
            console.log(err);
            res.redirect(back);
        }
        else
            res.render('employee',{empdet:results});
    })
})

app.get("/addcustomer", function(req, res){
    res.render('addcust');
})

app.post("/addcustomer", function(req, res){
    var key = req.body.car;
    var sql = "SELECT CAR_ID FROM cars WHERE CAR_NAME = ?";

        db.query(sql,key.toString(),  function(err, result){
        if(err)
            console.log(err);
        else{
            var sql1 = "INSERT INTO customer (CUST_NAME,CUST_ADDRESS, CUST_EMAIL, CUST_PHONE, CAR_ID, PURCHASE_DATE) VALUES ('"+req.body.name+"','"+req.body.add+"','"+req.body.email+"','"+req.body.phone+"','"+result[0].CAR_ID+"',CURDATE())";
            db.query(sql1, function(err, results){
                if(err)
                    console.log(err);
                else
                    res.redirect("/customer");
            })
        }
    })
})

app.post("/carsearch", function(req,res){
    var key = req.body.name;
    // var sql = "SELECT * FROM CARS WHERE MODEL = '"+req.body.name+"'";
    var sql = "SELECT CAR_ID FROM CARS WHERE CAR_NAME = ?";
    db.query(sql, key.toString(), function(err, results){
        if(err)
        {
            console.log(err);
            res.redirect(back);
        }
        else
        {
            if(results.length > 0){
                var val = results[0].CAR_ID;
                // console.log("/cars/"+val+"");
                res.redirect("/cars/"+val+"");
            }
            else
            {
                // console.log("No data");
                // <script>alert("No data");</script>
                res.redirect("/cars");
            }
        }
    })
})

app.post("/custsearch", function(req,res){
    var key = req.body.name;
    // var sql = "SELECT * FROM CARS WHERE MODEL = '"+req.body.name+"'";
    var sql = "SELECT * FROM CUSTOMER WHERE CUST_NAME = ?";
    db.query(sql, key.toString(), function(err, results){
        if(err)
        {
            console.log(err);
            res.redirect(back);
        }
        else
        {
            if(results.length > 0)
                res.render('customer',{detail:results});
            else
            {
                console.log("No data");
                res.redirect("/customer");
            }
        }
    })
})

app.listen(port, function(req, res){
    console.log("Server is running");
})
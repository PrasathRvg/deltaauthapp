var express = require("express");
var app = express();
const { MongoClient,ObjectId } = require('mongodb');
var url = "mongodb://localhost:27017/";
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views','./views');

app.get("/",function(req,res){
    res.sendFile(__dirname+"/home.html")
})
app.get("/aboutus",function(req,res){
    res.sendFile(__dirname+"/aboutus.html")
})
app.get("/products",function(req,res){
    console.log("req cookies for prod req::",req.cookies)
    res.render("products")
})
app.get("/services",function(req,res){
    console.log("req cookies for prod req::",req.cookies)
    res.render("services")
})
app.get("/signupform",function(req,res){
    res.sendFile(__dirname+"/userregistrationform.html")
})
app.post("/register",function(req,res){
    console.log("req fields",req.body)
    if(req.body.pwd!==req.body.cpwd){
        res.sendFile(__dirname+"/CofirmpasswordErrorRegistrationform.html")
    }
    else{
        MongoClient.connect(url,function(err,conn){
            var db = conn.db("delta");
            db.collection("users").find({username:req.body.username})
            .toArray(function(err,data){
                if(data.length===0){
                    db.collection('users').insertOne(req.body,function(err,data){
                        res.send(data)
                    })                    
                }
                else{
                    res.sendFile(__dirname+"/usernameexistform.html");                    
                }
            })
        })
    
    }
})
app.get("/loginform",function(req,res){
    res.sendFile(__dirname+"/login.html")
})
app.post("/login",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db = conn.db("delta");
        db.collection("users").find({username:req.body.username})
        .toArray(function(err,data){
            if(data.length===0){
                res.sendFile(__dirname+"/loginwithusernamenotfoundpage.html")               
            }
            else{
                if(data[0].pwd===req.body.pwd){
                    res.cookie("username",req.body.username);
                    res.cookie("pwd",req.body.pwd);
                    res.send("login successful")
                }  
                else{
                    res.send("Incorrect password or username")
                }          
            }
        })
    })
})
app.listen(9090,function(){console.log("App running on 9090")})
var express = require('express');
var router = express.Router();
var Contact = require('../models/contact.js');
var ObjectID = require('mongodb').ObjectID;
var nodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  apiKey: 'AIzaSyANpmFb2U9rjGAIaClkoTMJms8iOUE67XA',
  formatter: null
};
var geocoder = nodeGeocoder(options);

function restrict(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.session.error = "Access Denied!";
    console.log("Unauthorized Page Access.");
    res.redirect("login");
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET mailer page
router.get("/mailer", function(req, res, next) {
  res.render("mailer");
});

// POST mailer page
router.post("/mailer", function(req, res, next) {
    
    var contact = {};
    var name = req.body.firstName + " " + req.body.lastName;
    contact.address = req.body.street + " " + req.body.city + " " + req.body.state + " " + req.body.zip;
    if (req.body.title) {
      contact.name=req.body.title + " " + name;
    } else {
      contact.name=name;
    }
    contact.phone=req.body.phone;
    contact.email=req.body.email;
    contact.cbPhone=req.body.cbPhone;
    contact.cbEmail=req.body.cbEmail;
    contact.cbMail=req.body.cbMail;
    contact.any=req.body.any;
    geocoder.geocode(contact.address, function(err, res) {
      contact.lat = res[0].latitude;
      contact.lng = res[0].longitude;
      Contact.create(contact, function(err, post){
        if (err) throw err;
      });
    });
    
    res.render("thanks", {name: req.body.firstName});
});

// GET contacts page
router.get("/contacts", restrict, function(req, res, next) {
  Contact.find(function(err, result){
    if (err) throw err;
    res.render("contacts", {people: result});
  });
  
});

router.get("/contacts/:id", function(req, res, next){
  Contact.findById(req.params.id, req.body, function(err, result){
    if (err) throw err;
    res.render("edit", {person: result});
  });
});

router.post("/contacts/:id", function(req, res, next){
  var contact = {};
  contact.name = req.body.name;
  contact.address = req.body.address;
  contact.phone=req.body.phone;
  contact.email=req.body.email;
  contact.cbPhone=req.body.cbPhone;
  contact.cbEmail=req.body.cbEmail;
  contact.cbMail=req.body.cbMail;
  contact.any=req.body.any;
  geocoder.geocode(contact.address, function(err, res) {
    contact.lat = res[0].latitude;
    contact.lng = res[0].longitude;
    Contact.findByIdAndUpdate({_id: req.body.id}, contact, function(err, result){
    if (err) throw err;
    });
  });
  Contact.find(function(err, result){
    if (err) throw err;
    res.render("contacts", {people: result});
  });
});

router.get("/contacts/:id/delete", function(req, res) {
  Contact.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) throw err;
  });
  Contact.find(function(err, result){
    if (err) throw err;
    res.render("contacts", {people: result});
  });
});


module.exports = router;

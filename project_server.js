/*
email: ohjaeg@oregonstate.edu
name: Jaegeun Oh
Date: 04-16-2021
*/

const express = require('express');
const logger = require('./lib/logger');

const { validateAgainstSchema } = require('./lib/validation');
const { LodgingSchema } = require('./models/lodging');
const { r_LodgingSchema } = require('./models/lodging');
const { p_LodgingSchema } = require('./models/lodging');

const app = express();
const port = process.env.PORT || 8000;

const lodgings = require('./business');
const reviews = require('./review');
const pictures = require('./picture');

app.use(express.json());
app.use(express.urlencoded()); //to fix err 6

console.log("=--Start");

/*
name: /business
function: display 
description: list all business information
*/
app.get('/business', (req, res, next) => {
  res.status(200).send({
    lodgings: lodgings
  });
});

/*
name: /business
function: Add
description: add the business on the server. 
*/
app.post('/business', (req, res, next) => {

  console.log(" --req.body:", req.body);
  if (validateAgainstSchema(req.body, LodgingSchema)) {
    lodgings.push(req.body);
    const id = lodgings.length - 1;
    res.status(201).send({
      id: id
    });
  } else {
    //400 when the body does not have the right format
    //404 when the client ask something doesn't exits
    res.status(400).send({
      err: "Request body does not contain a valid Lodging."
    });
  }
});

/*
name: /business:id
function: display
description: Display business by business id
*/
app.get('/business/:id', (req, res, next) => {

  const id = req.params.id;
  if(lodgings[id]) {
    res.status(200).send(lodgings[id]);
  } else {
    res.status(404).send({
      err: "Not a valid Page"
    });
  }
});

/*
name: user/:uid/businesses/
function: display
description: Display business by owner id
*/
app.get('/user/:uid/businesses', (req, res, next) => {
  const uid = req.params.uid;
  console.log(" --List all Business(es) user"+uid +"owned");

  var arr = [];
  for(i = 0; i < lodgings.length; i++) {
    var id = lodgings[i].owner_id;
    if(id == uid) {
      arr.push(lodgings[i].name);
    }
  }

  res.status(200).send(arr);
});


/*
name: /business/:id
function: update
description: update the business information by business id
*/
app.put('/business/:id', (req, res, next) => {

  console.log(" --Update business information");
  const id = req.params.id;
  if (lodgings[id]) {
    if (validateAgainstSchema(req.body, LodgingSchema)) {
      lodgings[id] = req.body;
      res.status(204).send();
    } else {
      res.status(400).send({
        err: "Request body does not contain a valid Lodging."
      });
    }
  } else {
    next();
  }
});

/*
name: /business/:id
function: delete
description: delete business information by id
*/
app.delete('/business/:id', (req, res, next) => {

  console.log(" --Removing business information");
  const id = req.params.id;
	if (lodgings[id]) {
		lodgings[id] = null;
    res.status(204).send();
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}
});

/*
name: /review/:id
function: display
description: list out all review by id
*/
app.get('/review/:id', (req,res,next) => {	

  const id = req.params.id;
  if(reviews[id]) {
    res.status(200).send(reviews[id]);
  } else {
    res.status(404).send({
      err: "Not a valid Page"
    });
  }
});

/*
name: /user/:uid/reviews
function: display
description: display review by the user id
*/
app.get('/user/:uid/reviews', (req,res,next) => {	
  const uid = req.params.uid;
  console.log(" --List all Businesses' reviews of user"+uid);

  var arr = [];
  for(i = 0; i < reviews.length; i++) {
    var fid = reviews[i].user_id;
    console.log("=="+fid);
    if(fid == uid) {
      arr.push(reviews[i].write);
    }
  }

  res.status(200).send(arr);
});

/*
name: /review
function: add
description: add review 
*/
app.post('/review', (req, res, next) => {

  console.log(" --req.body:", req.body);
  if (validateAgainstSchema(req.body, r_LodgingSchema)) {
    reviews.push(req.body);
    const id = reviews.length - 1;
    res.status(201).send({
      id: id
    });
  } else {
    res.status(400).send({
      err: "Request body does not contain a valid Lodging."
    });
  }
});

/*
name: /review/:id
function: update
description: update the review by the user id
*/
app.put('/review/:id', (req, res, next) => {

  console.log(" --Update user review");
  const id = req.params.id;
  if (reviews[id]) {
    if (validateAgainstSchema(req.body, r_LodgingSchema)) {
      reviews[id] = req.body;
      res.status(204).send();
    } else {
      res.status(400).send({
        err: "Request review does not contain a valid data."
      });
    }
  } else {
    next();
  }
});

/*
name: /review/:id
function: delete
description: delete review by review id
*/
app.delete('/review/:id', (req, res, next) => {

  console.log(" --Remove user review");
  const id = req.params.id;
	if (reviews[id]) {
		reviews[id] = null;
    console.log("== Custmers' stars, dollar Sign, feedback have been removed.");
    res.status(204).send();
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}
});

/*
name: /picture/:id
function: display
description: list photo by id
*/
app.get('/picture/:id', (req,res,next) => {	

  console.log(" --List photo by id");
  const id = req.params.id;
	if (pictures[id]) {
    res.status(200).json(pictures[id].p_name);
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}
});

/*
name: /user/:uid/picture
function: display
description: list all pictures by the user id
*/
app.get('/user/:uid/picture', (req,res,next) => {	

  const uid = req.params.uid;
  console.log(" --List all pictures of the user"+uid);

  var arr = [];
  for(i = 0; i < pictures.length; i++) {
    var fid = pictures[i].user_id;
    if(fid == uid) {
      arr.push(pictures[i].p_name);
    }
  }

  res.status(200).send(arr);
});

/*
name: /picture
function: add
description: add picture on the server
*/
app.post('/picture', (req, res, next) => {

  console.log(" --add customer picture");
  if (validateAgainstSchema(req.body, p_LodgingSchema)) {
    pictures.push(req.body);
    const id = pictures.length - 1;
    res.status(201).send({
      p_id: id
    });
  } else {
    res.status(404).send({
      err: "Request review does not contain a valid data."
    });
  }
});

/*
name: /picture/:pic
function: update
description: update picture by picture id
*/
app.put('/picture/:pic', (req, res, next) => {

  console.log(" --Update user picture");
  const id = req.params.pic;
  if (pictures[id]) {
    if (validateAgainstSchema(req.body, p_LodgingSchema)) {
      pictures[id] = req.body;
      res.status(204).send();
    } else {
      res.status(400).send({
        err: "Request picture does not contain a valid data."
      });
    }
  } else {
    next();
  }
});

/*
name: /picture/:pic
function: delete
description: removew all infomation of picture by id
*/
app.delete('/picture/:pic', (req, res, next) => {

  console.log(" --Remove user picture");
  const id = req.params.pic;
	if (pictures[id]) {
		pictures[id] = null;
    console.log("== customer picture removed.");
    res.status(204).send();
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}
});

app.use('*', (req, res, next) => {
  res.status(404).send({
    err: "The requested resource doesn't exist: " + req.originalUrl
  });
});

app.listen(port, () => {
  console.log("== Server is listening on port", port);
});
const express = require('express');
const router = express.Router();

const boatsModel = require('../schema/boatModel');
const Response = require('../server');
const upload= require('../middleware/uploadFile')

router.get('/', function(req, res, next) {
    res.render('index');
  });
  
router.get('/get-all-boats-api', function(req, res, next) {
    boatsModel.find({}, function(err, posts) {
        if (err) {
            Response.errorResponse(err, res);
        } else {
            Response.successResponse('Boat Listing!', res, posts);
        }
    });

});

router.post('/add-boats-api', function(req, res, next) {
    console.log(req.body);

    const mybodydata = {
        boat_name: req.body.boat_name,
        boat_boat_manufractureYear: req.body.boat_manufractureYear,
        boat_price: req.body.boat_price,
        boat_sail: req.body.boat_sail,
        boat_motor: req.body.boat_motor,
        boat_image: req.body.boat_image
    }

  
    const data = boatsModel(mybodydata);
    //const data = boatsModel(req.body);
    data.save(function(err) {
        if (err) {
            Response.errorResponse(err, res);
           
        } else {

            Response.successResponse('Boat Added!', res, {});
        }
    })
});


/* GET SINGLE POST BY ID */
router.get('/get-boats-details-api/:id', function(req, res, next) {
  boatsModel.findById(req.params.id, function (err, post) {
    if(err){
      Response.errorResponse(err,res);
  }else{
      Response.successResponse('Boat Detail!',res,post);
  }
  });
});

/* DELETE POST BY ID */
router.delete('/delete-boats-api', function(req, res, next) {
  boatsModel.findByIdAndRemove(req.body._id, function (err, post) {
    if (err) {
      Response.errorResponse(err,res);
    } else {
      Response.successResponse('Boat deleted!',res,{});
    }
  });
});

/* UPDATE POST */
router.post('/update-boats-api', function(req, res, next) {
  console.log(req.body._id);
  boatsModel.findByIdAndUpdate(req.body._id, req.body, function (err, post) {
  if (err) {
    Response.errorResponse(err,res);
  } else {
    Response.successResponse('Boat updated!',res,{});
  }
});
});









//List Table Data
router.get('/display', function(req, res) {
    boatsModel.find(function(err, boats) {
        if (err) {
            console.log(err);
        } else {
            res.render('display-table', {boats: boats });
            console.log(boats);
        }
    });
});


//Display Form 
router.get('/add', function(req, res, next) {
    res.render('add-form');
});


/* POST Data. */
router.post('/add', upload.single('boat_image'),function(req, res, next) {
    console.log(req.body);

    const mybodydata = {
        boat_name: req.body.boat_name,
        boat_manufractureYear: req.body.boat_manufractureYear,
        boat_price: req.body.boat_price,
        boat_sail: req.body.boat_sail,
        boat_motor: req.body.boat_motor,
        boat_image: req.body.boat_image
    }

    if(req.file){
        mybodydata.boat_image=req.file.path
    }
    const data = boatsModel(mybodydata);
    //const data = boatsModel(req.body);
    data.save(function(err) {
        if (err) {

            res.render('add-form', { message: 'User registered not successfully!' });
        } else {

            res.render('add-form', { message: 'User registered successfully!' });
        }
    })
});

/* DELETE User BY ID */
router.get('/delete/:id', function(req, res) {
    boatsModel.findByIdAndRemove(req.params.id, function(err, project) {
        if (err) {

            req.flash('error_msg', 'Record Not Deleted');
            res.redirect('../display');
        } else {

            req.flash('success_msg', 'Record Deleted');
            res.redirect('../display');
        }
    });
});

/* GET SINGLE User BY ID */
router.get('/show/:id', function(req, res) {
    console.log(req.params.id);
    boatsModel.findById(req.params.id, function(err, boat) {
        if (err) {
            console.log(err);
        } else {
            console.log(boat);

            res.render('show', { boats: boat });
        }
    });
});

/* GET SINGLE User BY ID */
router.get('/edit/:id', function(req, res) {
    console.log(req.params.id);
    boatsModel.findById(req.params.id, function(err, boat) {
        if (err) {
            console.log(err);
        } else {
            console.log(boat);

            res.render('edit-form', { boats: boat });
        }
    });
});

/* UPDATE User */
router.post('/edit/:id', function(req, res) {
    boatsModel.findByIdAndUpdate(req.params.id, req.body, function(err) {
        if (err) {
            req.flash('error_msg', 'Something went wrong! Boat could not updated.');
            res.redirect('edit/' + req.params.id);
        } else {
            req.flash('success_msg', 'Record Updated');
            res.redirect('../display');
        }
    });
});

module.exports = router;

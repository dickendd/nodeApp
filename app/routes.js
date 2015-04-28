var Truck = require('./models/truck');
var User = require('./models/user');
var jwt = require('jsonwebtoken');

module.exports = function(app, auth) {

	app.post('/login', function(req, res) {
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            if (user) {
	               res.json({
	                    type: true,
	                    data: user,
	                    token: user.token
	                }); 
	            } else {
	                res.json({
	                    type: false,
	                    data: "Incorrect email/password"
	                });    
	            }
	        }
	    });
	});

	app.post('/signup', function(req, res) {
	    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            if (user) {
	                res.json({
	                    type: false,
	                    data: "User already exists!"
	                });
	            } else {
	                var userModel = new User();
	                userModel.email = req.body.email;
	                userModel.password = req.body.password;
	                userModel.save(function(err, user) {
	                    user.token = jwt.sign(user, auth.secret);
	                    user.save(function(err, user1) {
	                        res.json({
	                            type: true,
	                            data: user1,
	                            token: user1.token
	                        });
	                    });
	                })
	            }
	        }
	    });
	});

	app.get('/me', ensureAuthorized, function(req, res) {
	    User.findOne({token: req.token}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            res.json({
	                type: true,
	                data: user
	            });
	        }
	    });
	});

	// test route to make sure everything is working (GET http://localhost:8080/api)
	app.get('/api', function(req, res) {
		res.json({ message: 'API working just fine' });
	});

	// add more routes here
	app.post('/api/trucks', function(req, res){
		var truck = new Truck();
		truck.name = req.body.name;
		truck.geo = req.body.geo;
		truck.windowCopy = req.body.windowCopy;
		truck.menuUrl = req.body.menuUrl;

		truck.save(function(err){
			if (err) {
				res.send(err);
			}
			res.json({ message: truck });
		});
	});

	app.get('/api/trucks', function(req, res){
		Truck.find(function(err, trucks){
			if (err) {
				res.send(err);
			}
			res.json(trucks);
		});
	});

	app.get('/api/trucks/:truck_id', function(req, res){
		Truck.findById(req.params.truck_id, function(err, truck){
			if (err) {
				res.send(err);
			}
			res.json(truck);
		});
	});

	app.put('/api/trucks/:truck_id', function(req, res){
		Truck.findById(req.params.truck_id, function(err, truck){
			if (err) {
				res.send(err);
			}
			truck.windowUrl = req.body.windowUrl;
			truck.save(function(err){
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Truck updated!' });
			});
		})
	});

	app.delete('/api/trucks/:truck_id', function(req, res){
		Truck.remove({
			_id: req.params.truck_id
		}, function(err, truck){
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Truck successfully deleted!' });
		})
	});

	// frontend route
	// route to handle all angular requests
	app.get('*', function(req, res){
		res.sendfile('./public/views/index.html');
	});
};

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

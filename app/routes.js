var Bear = require('./models/bear');

module.exports = function(app) {

	// test route to make sure everything is working (GET http://localhost:8080/api)
	app.get('/api', function(req, res) {
		res.json({ message: 'API working just fine' });
	});

	// add more routes here
	app.post('/api/bears', function(req, res){
		var bear = new Bear();
		bear.name = req.body.name;
		bear.geo = req.body.geo;

		bear.save(function(err){
			if (err) {
				res.send(err);
			}
			res.json({ message: bear });
		});
	});

	app.get('/api/bears', function(req, res){
		Bear.find(function(err, bears){
			if (err) {
				res.send(err);
			}
			res.json(bears);
		});
	});

	app.get('/api/bears/:bear_id', function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if (err) {
				res.send(err);
			}
			res.json(bear);
		});
	});

	app.put('/api/bears/:bear_id', function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if (err) {
				res.send(err);
			}
			bear.name = req.body.name;
			bear.save(function(err){
				if (err) {
					res.send(err);
				}
				res.json({ message: 'Bear updated!' });
			});
		})
	});

	app.delete('/api/bears/:bear_id', function(req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if (err) {
				res.send(err);
			}
			res.json({ message: 'Bear successfully deleted!' });
		})
	});

	// frontend route
	// route to handle all angular requests
	app.get('*', function(req, res){
		res.sendfile('./public/views/index.html');
	});
}
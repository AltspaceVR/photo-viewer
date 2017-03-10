(function () {
'use strict';

function param(p) {
	return new RegExp(p).test(location.search);
}

function qs(s) {
	return document.querySelector(s);
}

function getImageUrl (photo) {
	return ("https://farm" + (photo.farm) + ".staticflickr.com/" + (photo.server) + "/" + (photo.id) + "_" + (photo.secret) + "_h.jpg");
}

var config = {
	flickr_api_key: '75fabb998a4640ce64a154f8955bb22a',
	flickr_api_secret: 'f86c48f23df63ea7'
};

/* globals THREE, altspace, Flickr, moment */

// Create a "Simulation". This just takes care of some app boilerplate for us.
var sim = new altspace.utilities.Simulation();

if (param('360')) {
	// Use the Altspace API to retrieve the "document". 
	// This represents the content of the webpage loaded in the Altspace enclosure.
	altspace.getDocument().then(function (doc) {
		// The doc object is a Three.js Mesh that we can manipulate.
		// Here we change its geometry to a sphere instead of the default 2D plane.
		var docGeo = new THREE.SphereGeometry(1, 32, 32);
		doc.geometry = docGeo;
		doc.geometry.verticesNeedUpdate = true;

		// Set some more properties on the mesh so that the 360 image
		// displays correctly.
		doc.material.side = THREE.BackSide;
		doc.material.transparent = false;
		doc.scale.x = -1;

		// Disable cursor interactions on the mesh.
		doc.userData.altspace = { collider: { enabled: false } };

		// Optionally scale and reposition the sphere.
		if (param('scaled')) {
			doc.scale.multiplyScalar(0.2);
			// Units are in "pixels" by default.
			doc.position.y = -300;
		}

		// Finally, render it into the app.
		sim.scene.add(doc);
	});
}

// Optionally use the Flickr API to display images instead of the static test image.
if (param('flickr')) {
	var displayImage = qs('#displayImage');
	displayImage.src = '';

	var flickr = new Flickr({
		api_key: config.flickr_api_key,
		secret: config.flickr_api_secret
	});

	flickr.photos.search({
		tags: 'equirectangular,nature',
		tag_mode: 'all',
		min_taken_date: moment().subtract(1, 'year').unix(),
		sort: 'interestingness-desc',
		safe_search: 1,
	}, function(err, result) {
		if(err) { throw new Error(err); }

		var index = 0;
		displayImage.src = getImageUrl(result.photos.photo[index]);

		// Optionally add a 3D button to the app for flipping through Flickr images.
		if (param('button')) {
			var nextButton = new THREE.Mesh(
				new THREE.BoxGeometry(50, 50, 50),
				new THREE.MeshBasicMaterial({color: '#2196F3'})
			);
			nextButton.position.y = -300;

			// We can listen to events on 3D objects.
			nextButton.addEventListener('cursorup', function () {
				displayImage.src = getImageUrl(result.photos.photo[++index]);
			});

			sim.scene.add(nextButton);
		}
	});
}

}());

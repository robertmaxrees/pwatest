(function() {
	this.addEventListener('push', (event) => {
		const payload = event.data.json(),
			title = payload.title,
			icon = payload.icon,
			body = payload.body,
			tag = 'simple-push-demo-notification-tag';

		event.waitUntil(
			this.registration.showNotification(title, {
				body,
				icon,
				tag
			})
		);
	});

	this.addEventListener('notificationclick', function(event) {
		event.notification.close();
	});

	this.addEventListener('install', function(event) {

		// all urls will be added to cache
		function cacheAssets(assets) {
			return new Promise(function(resolve, reject) {
				// open cache
				caches.open('0.0.5c')
					.then(cache => {
						// the API does all the magic for us
						cache.addAll(assets)
							.then(() => {
								console.log('all assets added to cache')
								resolve()
							})
							.catch(err => {
								console.log('error when syncing assets', err)
								reject()
							})
					}).catch(err => {
						console.log('error when opening cache', err)
						reject()
					})
			});
		}

		var assets = [
			'/',
			'/manifest.json',
			'/css/bootstrap.min.css',
			'/css/bootstrap-theme.min.css',
			'/css/style.css',
			'/js/jquery.min.js',
			'/js/bootstrap.min.js',
			'/js/main.js'
		];

		cacheAssets(assets).then(() => {
			console.log('All assets cached')
		});

	});

	// this is the service worker which intercepts all http requests
	self.addEventListener('fetch', function fetcher(event) {
		var request = event.request;
		// check if request
		if (request.url.indexOf('/css') > -1 || request.url.indexOf('/js') > -1) {
			// contentful asset detected
			event.respondWith(
				caches.match(event.request).then(function(response) {
					// return from cache, otherwise fetch from network
					return response || fetch(request);
				})
			);
		}
		// otherwise: ignore event
	});
}());
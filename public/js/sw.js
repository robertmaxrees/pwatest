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
		event.waitUntil(
			caches.open('0.0.5a').then(function(cache) {
				return cache.addAll([
					'/',
					'/css/bootstrap.min.css',
					'/css/bootstrap-theme.min.css',
					'/css/style.css',
					'/js/jquery.min.js',
					'/js/bootstrap.min.js',
					'/js/main.js'
				]);
			})
		);
	});
}());
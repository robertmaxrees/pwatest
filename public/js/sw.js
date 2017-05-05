(function() {
	var link;

	// this.addEventListener('install', (event) => {
	// 	this.skipWaiting();
	// 	console.log('Installed', event);
	// });

	// this.addEventListener('activate', (event) => {
	// 	console.log('Activated', event);
	// });

	this.addEventListener('push', (event) => {
		const payload = event.data.json();
		console.log(payload);
		var title = payload.title,
			body = payload.body,
			icon = '/img/192.png',
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
		console.log(event);
		event.notification.close();
	});
}());
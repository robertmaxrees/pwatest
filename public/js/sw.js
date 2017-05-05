(function() {
	console.log('Started', this);

	var link;

	this.addEventListener('install', (event) => {
		this.skipWaiting();
		console.log('Installed', event);
	});

	this.addEventListener('activate', (event) => {
		console.log('Activated', event);
	});

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
		console.log('Notification click: tag', event.notification.tag);
		// Android doesn't close the notification when you click it
		// See http://crbug.com/463146
		event.notification.close();
		var url = link;
		// Check if there's already a tab open with this URL.
		// If yes: focus on the tab.
		// If no: open a tab with the URL.
		event.waitUntil(
			clients.matchAll({
				type: 'window'
			})
				.then(function(windowClients) {
					console.log('WindowClients', windowClients);
					for (var i = 0; i < windowClients.length; i++) {
						var client = windowClients[i];
						console.log('WindowClient', client);
						if (client.url === url && 'focus' in client) {
							return client.focus();
						}
					}
					if (clients.openWindow) {
						return clients.openWindow(url);
					}
				})
		);
	});
}());
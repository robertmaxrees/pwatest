(function() {
	console.log('Started', self);

	var link;

	self.addEventListener('install', function(event) {
		self.skipWaiting();
		console.log('Installed', event);
	});

	self.addEventListener('activate', function(event) {
		console.log('Activated', event);
	});

	// self.addEventListener('push', function(event) {
	// 	console.log('Push message', event);

	// 	var title = 'Push message';

	// 	var httpHeaders = new Headers();
	// 	httpHeaders.append('pragma', 'no-cache');
	// 	httpHeaders.append('cache-control', 'no-cache');

	// 	var fetchInit = {
	// 		method: 'GET',
	// 		headers: httpHeaders,
	// 	};

	// 	event.waitUntil(
	// 		fetch("/app/api/notifications/latest.json", fetchInit).then(function(res) {
	// 			return res.json().then(function(notificationData) {
	// 				link = notificationData.link;
	// 				self.registration.showNotification(notificationData.title, {
	// 					'body': notificationData.body,
	// 					'icon': notificationData.icon
	// 				});
	// 			})
	// 		})
	// 	);
	// });

	self.addEventListener('push', function(event) {
		console.log('Received a push message', event);

		var title = 'Yay a message.';
		var body = 'We have received a push message.';
		var icon = '/img/192.png';
		var tag = 'simple-push-demo-notification-tag';

		event.waitUntil(
			self.registration.showNotification(title, {
				body,
				icon,
				tag
			})
		);
	});

	self.addEventListener('notificationclick', function(event) {
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
(function() {
	var link;

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
}());
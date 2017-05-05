(function() {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
			return navigator.serviceWorker.ready;
		}).then(function(registration) {
			registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
				var endpointSections = sub.endpoint.split('/');
				var fcmSubscriptionId = endpointSections[endpointSections.length - 1];
				const xhr = new XMLHttpRequest();

				xhr.open('POST', '/setuserfcm');
				xhr.send(JSON.stringify({
					fcmSubscriptionId: fcmSubscriptionId
				}));
				console.log('endpoint:', fcmSubscriptionId);
			});
		});
		navigator.serviceWorker.ready.then(function(registration) {
			console.log('Service Worker Ready');
		});
	} else {
		console.warn('Push messaging is not supported');
		pushButton.textContent = 'Push Not Supported';
	}
}());


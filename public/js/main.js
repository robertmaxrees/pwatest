(function() {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
			return navigator.serviceWorker.ready;
		}).then((registration) => {
			registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
				const endpointSections = sub.endpoint.split('/'),
					fcmSubscriptionId = endpointSections[endpointSections.length - 1],
					xhr = new XMLHttpRequest();

				xhr.open('POST', '/setuserfcm');
				xhr.send(JSON.stringify({
					fcmSubscriptionId: fcmSubscriptionId
				}));
				console.log('endpoint:', fcmSubscriptionId);
			});
		}).catch((err) => console.error(err));
		navigator.serviceWorker.ready.then(function(registration) {
			console.log('Service Worker Ready');
		});
	} else {
		console.warn('Push messaging is not supported');
		pushButton.textContent = 'Push Not Supported';
	}

	document.addEventListener("DOMContentLoaded", function() {
		window.addEventListener(document.querySelector('button'), () => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', '/sendfcmnotification');
			xhr.send();
		});
	});
}());


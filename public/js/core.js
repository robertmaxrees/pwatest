(function() {
	// Init service worker file
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		console.log('Service Worker and Push are supported');

		navigator.serviceWorker.register('sw.js')
			.then(function(swReg) {
				console.log('Service Worker is registered', swReg);

				// Subscribe user for push messaging
				navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
					serviceWorkerRegistration.pushManager.subscribe({
						userVisibleOnly: true
					}).then(function(subscription) {
						// The subscription was successful
						const xhr = new XMLHttpRequest();

						xhr.open('POST', '/setUserFCM');
						xhr.setRequestHeader("Content-Type", "application/json");
						xhr.send(subscription);
					})
						.catch(function(e) {
							if (Notification.permission === 'denied') {
								console.warn('Permission for Notifications was denied');
							} else {
								console.error('Unable to subscribe to push.', e);
							}
						});
				});

				window.swRegistration = swReg;
			})
			.catch(function(error) {
				console.error('Service Worker Error', error);
			});
	} else {
		console.warn('Push messaging is not supported');
		pushButton.textContent = 'Push Not Supported';
	}
}());

(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDQpCYx_19KYDXR1ir5lizWe5423IRai1w",
		authDomain: "gh0sts-test-application.firebaseapp.com",
		databaseURL: "https://gh0sts-test-application.firebaseio.com",
		projectId: "gh0sts-test-application",
		storageBucket: "gh0sts-test-application.appspot.com",
		messagingSenderId: "1085538655921"
	};
	firebase.initializeApp(config);

	const messaging = firebase.messaging();

	messaging.onMessage(function(payload) {
		console.log(payload);
	});

	messaging.requestPermission().then(function() {
		console.log('foo');
	});


	// Get Instance ID token. Initially this makes a network call, once retrieved
	// subsequent calls to getToken will return from cache.
	messaging.getToken()
		.then(function(currentToken) {
			if (currentToken) {
				console.log(currentToken);
			} else {
				// Show permission request.
				console.log('No Instance ID token available. Request permission to generate one.');
			}
		})
		.catch(function(err) {
			console.log('An error occurred while retrieving token. ', err);
		});

	// Callback fired if Instance ID token is updated.
	messaging.onTokenRefresh(function() {
		messaging.getToken()
			.then(function(refreshedToken) {
				console.log('Token refreshed.');
			})
			.catch(function(err) {
				console.log('Unable to retrieve refreshed token ', err);
			});
	});
}());
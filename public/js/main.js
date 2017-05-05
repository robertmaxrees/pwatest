(function() {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function() {
			return navigator.serviceWorker.ready;
		}).then((registration) => {
			registration.pushManager.subscribe({ userVisibleOnly: true }).then(function(subscription) {
				const xhr = new XMLHttpRequest();

				xhr.open('POST', '/setuserfcm');
				xhr.send(JSON.stringify({
					fcmSubscriptionData: subscription
				}));
				// console.log('endpoint:', subscription);
			});
		}).catch((err) => console.error(err));
		navigator.serviceWorker.ready.then(function(registration) {
			// console.log('Service Worker Ready');
		});
	} else {
		// console.warn('Push messaging is not supported');
		pushButton.textContent = 'Push Not Supported';
	}

	document.addEventListener("DOMContentLoaded", function() {
		//console.log(document.querySelector('button'));
		document.querySelector('button').addEventListener('click', () => {
			const xhr = new XMLHttpRequest(),
				postData = {
					title: document.querySelector('.notification-title').value,
					text: document.querySelector('.notification-body').value
				}

			xhr.open('POST', '/sendfcmnotification');
			xhr.send(JSON.stringify(postData));
		});
	});
}());


export class HTMLTemplateForRedirection {
	async redirectionHTMLTemplate(url: string, name: string): Promise<string> {
		return `
		<html lang='en'>
		<head>
			<meta charset='UTF-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<title>Redirecting...</title>
			<script>
				window.onload = function () { const button = document.getElementById('disable-button'); setTimeout( function () {
				button.disabled = false; }, 3000 ); };
			</script>
		</head>
	
		<body>
			<div>
				<h1>Hey ${name} !! Are you sure you want to redirect?</h1>
				<a href='${url}'><button id='disable-button' disabled>Redirect to Original Site</button></a>
			</div>
	
		</body>
	</html>`;
	}

	async expiredTemplate(url: string, name: string): Promise<string> {
		return `
		<html lang='en'>
		<head>
			<meta charset='UTF-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<title>Redirecting...</title>
		</head>
	
		<body>
			<div>
				<h1>Hey ${name}  </h1><br />
				<h1>The short url '${url}' is expired !</h1>
			</div>
	
		</body>
	</html>`;
	}
	async pageNotFoundTemp(): Promise<string> {
		return `
		<html lang='en'>
		<head>
			<meta charset='UTF-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<title>Redirecting...</title>
		</head>
	
		<body>
			<div>
				
				<h1>404! PAGE NOT FOUND</h1>
			</div>
	
		</body>
	</html>`;
	}
}

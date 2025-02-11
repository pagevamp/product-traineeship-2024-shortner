export class HTMLTemplateForRedirection {
	private cssStyle = `
	        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #121212;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin: 0 0 20px 0;
            color: #ff5555;
        }
        p {
            font-size: 1.2rem;
            margin: 10px 0;
        }
        a {
            color: #bb86fc;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
		button {
        	background-color: #bb86fc;
        	color: #121212;
        	border: none;
        	padding: 10px 20px;
        	font-size: 1rem;
        	font-weight: bold;
        	border-radius: 5px;
        	cursor: pointer;
        	transition: background-color 0.3s ease;
        }
        button:disabled {
            background-color: #555;
            cursor: not-allowed;
        }
        button:hover:not(:disabled) {
            background-color: #9a67ea;
        }
	`;

	async redirectionHTMLTemplate(url: string): Promise<string> {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8" />
				    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				    <title>Redirecting...</title>
				    <style>
				${this.cssStyle}
				    </style>
				    <script>
				        window.onload = function () {
				            const button = document.getElementById('disable-button');
				            setTimeout(function () {
				                button.disabled = false;
				                button.textContent = "Redirect to Original Site";
				            }, 3000);
				        };
				    </script>
				</head>
				<body>
				    <div>
				        <h1>Are you sure you want to redirect?</h1>
				        <a href="${url}">
				            <button id="disable-button" disabled>Redirecting in 3 seconds...</button>
				        </a>
				    </div>
				</body>
				</html>
		`;
	}

	async expiredTemplate(): Promise<string> {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <title>URL Expired</title>
				    <style>
				${this.cssStyle}
				    </style>
				</head>
				<body>
				    <div>
				        <h1>Expired URL</h1>
				        <p>The URL you are trying to access is Expired. Please contact the URL owner.</p>
				        <p><a href="/api/v1">Go back to the homepage</a></p>
				    </div>
				</body>
				</html>
		`;
	}

	async pageNotFoundTemp(): Promise<string> {
		return `
				<!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <title>404 - Page Not Found</title>
				    <style>
					${this.cssStyle}
				    </style>
				</head>
				<body>
				    <div>
				        <h1>404</h1>
				        <p>Oops! The page you're looking for doesn't exist.</p>
				         <p><a href="/api/v1">Go back to the homepage</a></p>
				    </div>
				</body>
				</html>
		`;
	}
}

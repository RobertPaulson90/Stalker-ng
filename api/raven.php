<?php
	// The Raven error handler
	if (@include('/var/www/raven-php/lib/Raven/Autoloader.php')) {
		Raven_Autoloader::register();
		$client = new Raven_Client('https://7a20f7c773124f72a88f510adaab5f2a:ac2f9b8e13f44c94b2d3b8276193f55d@app.getsentry.com/7104');
		$error_handler = new Raven_ErrorHandler($client);
		set_error_handler(array($error_handler, 'handleError'));
		set_exception_handler(array($error_handler, 'handleException'));
	}
?>
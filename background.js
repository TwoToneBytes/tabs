var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://api.instagram.com/oauth/authorize',
  'authorize_url': 'https://api.instagram.com/oauth/authorize/',
  'access_url': 'https://api.instagram.com/v1/',
  'consumer_key': 'anonymous',
	'consumer_secret': 'anonymous',
  'scope': 'likes+comments+relationships',
});

function callback(resp, xhr) {
  // ... Process text response ...
  console.log("callback "+ resp);
  console.log("status "+ hr.status);
};
function onAuthorized() {
	console.log('we did it');
  var url = 'https://api.instagram.com/v1/';
  var request = {
    'method': 'GET',
    'parameters': {
    	'client_id': 'ae3dcf48bd7543778a31707248781bdd', 
    	'response_uri': 'https://lolhnmcgahdbcphokklkdcclafhihhmi.chromiumapp.org/',
    	'response_type': 'token',
      'scope': 'likes+comments+relationships'
    }
  };
  console.log('url '+ url);
  console.log('request '+ request);
  // Send: GET https://docs.google.com/feeds/default/private/full?alt=json
  oauth.sendSignedRequest(url, callback, request);
};
oauth.authorize(onAuthorized); 
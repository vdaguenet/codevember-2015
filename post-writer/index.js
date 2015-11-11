var http = require('http');

// Get collection id
var index = process.argv.indexOf('--collection');
var collectionId = process.argv[index + 1];
var posts = '';

if (index === -1) {
  console.log('Collection argument is required');
  process.exit(2);
}

if (!collectionId) {
  console.log('No collection id given');
  process.exit(2);
}
// Call API
requestAPI(collectionId);

/**
 * Call CodePen API with the given collection id
 * Thanks for Nate Wiley (http://codepen.io/natewiley/)
 * to made this API (doc: http://cpv2api.com/)
 */
function requestAPI (id) {
  var data;
  var options = {
    hostname: 'cpv2api.com',
    port: 80,
    path: '/collection/' + id,
    method: 'GET',
  };

  var req = http.request(options, function(res) {
    var str = '';

    res.on('data', function (chunk) {
      str += chunk;
    });

    res.on('end', function () {
      res = JSON.parse(str);
      if (res.success) {
        formatData(res.data);
        console.log(posts);
      } else {
        console.log('API error');
        process.exit(2);
      }
    });
  });
  req.on('error', function(err) {
    console.log("ERROR: " + err.message);
  });
  req.end();
}

/**
 * Format API object as embed CodePen
 */
function formatData (data) {
  data.forEach(function (pen) {
    posts += '<p data-height="268" data-theme-id="0" data-slug-hash="'+pen.id+'" data-default-tab="result" data-user="'+pen.user.username+'" data-preview="true" class="codepen">';
    posts += 'See the Pen <a href="'+pen.link+'">'+pen.title+'</a> by '+pen.user.nicename+' (<a href="http://codepen.io/'+pen.user.username+'">@'+pen.user.username+'</a>) on <a href="http://codepen.io">CodePen</a>.';
    posts += '</p>';
    posts += '<br><br>';
  });

  posts += '<br><br>';
  posts += 'See you tomorrow!';
  posts += '<script async src="//assets.codepen.io/assets/embed/ei.js"></script>';
}

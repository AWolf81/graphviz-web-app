var ghpages = require('gh-pages');
var path = require('path');

module.exports = function() {
  ghpages.publish(path.join(__dirname, '../dist'), function(err) {
    console.log('Error publishing to gh-pages branch...');
    console.log(err);
  });
}

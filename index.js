var casper = require('casper').create({
  verbose: true,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
  },
  clientScripts: ['vendor/jquery.js', 'vendor/lodash.js']
});

var links = [];

function getLinks() {
  var links = $('.b_algo a');
  return _.map(links, function(e) {
    return e.getAttribute('href');
  });
}

casper.start('http://bing.com/', function() {
  this.fill('form[action="/search"]', {
    q: 'casperjs'
  }, true);
});

casper.then(function() {
  links = this.evaluate(getLinks);

  // now search for 'phantomjs' by filling the form in again
  this.fill('form[action="/search"]', {
    q: 'phantomjs'
  }, true);
});

casper.then(function() {
  links = links.concat(this.evaluate(getLinks));
});

casper.run(function() {
  //echo results in a readable fashion
  this.echo(links.length + 'links found: ');
  this.echo(' - ' + links.join('\n - ')).exit();
});
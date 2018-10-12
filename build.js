const mv = require('mv');

mv('www', 'dist', {clobber: false}, function (err) {
  console.log('moved over filed to dist folder');
});

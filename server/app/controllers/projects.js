var revolutions3D = require('../../libraries/printing3D/revolutions-of-solids');

module.exports = {
  printRevolution: function(req, res) {
    console.log(req);
    res.json({'success': 'Hello'});
    // revolutions3D(req.faces, function(err, message) {
    //   if(err) {
    //     res.json({error: message});
    //   } else {
    //     res.json({success: message});
    //   }
    // });
  }
};
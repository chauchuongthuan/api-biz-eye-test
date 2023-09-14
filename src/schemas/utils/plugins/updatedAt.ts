module.exports = exports = function updatedAtPlugin(schema, options) {
   schema.post('findOneAndUpdate', function (doc) {
      // doc.updatedAt = (new Date()).toString();
      if (doc) {
         doc.save();
      }
   });

   schema.post('update', function (doc) {
      // doc.updatedAt = (new Date()).toString();
      if (doc) {
         doc.save();
      }
   });

   schema.post('updateOne', function (doc) {
      // doc.updatedAt = (new Date()).toString();
      if (doc) {
         doc.save();
      }
   });

   if (options && options.index) {
      schema.path('updatedAt').index(options.index);
   }
};

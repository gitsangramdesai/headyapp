var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('config');
var mongoConnectionString = config.get('database.mongo').connectionString;

//'mongodb://localhost/heady'
mongoose.connect(mongoConnectionString);

var productSchema = new Schema({
    productId: { type: Number, required: true},
    productName: String,
    price:{type:Number},
    categoryId: [Number],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});


var Product = mongoose.model('Product', productSchema);

module.exports = {
   "Product": Product,
   "ProductSchema":productSchema
}
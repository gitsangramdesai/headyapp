var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('config');
var mongoConnectionString = config.get('database.mongo').connectionString;

//'mongodb://localhost/heady'
mongoose.connect(mongoConnectionString);

var categorySchema = new Schema({
    categoryId: { type: Number, required: true, unique: true },
    parentCategoryId: {type:Number,default:0},
    categoryName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});


var Category = mongoose.model('Category', categorySchema);


module.exports = {
    "Category": Category,
    "CategorySchema": categorySchema
}
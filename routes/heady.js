var express = require('express');
var router = express.Router();

var Category = require('../models/category').Category;
var Product = require('../models/product').Product;

var CategorySchema = require('../models/category').CategorySchema;
var ProductSchema = require('../models/product').ProductSchema;

/** HTTP VERB USAGE 
 * GET - SELECT record(s) 
 * POST -INSERT record
 * PUT - Update record
 * DELETE -remove record
 * **/

/* create new category */
router.post('/category', function (req, res, next) {
    var newCategory = new Category({
        categoryId: req.body.categoryId,
        parentCategoryId: req.body.parentCategoryId,
        categoryName: req.body.categoryName
    });

    newCategory.save(function (err) {
        if (err) throw err;
        console.log('Category saved successfully!');
        res.send('Category saved successfully!');
    });
});

/*get all categories*/
router.get('/category', function (req, res, next) {
    Category.find({}, function (err, categories) {
        if (err) throw err;
        res.json(categories);
    });
});

/*get all products*/
router.get('/product', function (req, res, next) {
    Product.find({}, function (err, products) {
        if (err) throw err;
        res.json(products);
    });
});

/*find category by Id*/
router.get('/category/:categoryId', function (req, res, next) {
    Category.find({ categoryId: req.params.categoryId }, function (err, category) {
        if (err) throw err;
        res.json(category);
    });
});

/*find product by Id*/
router.get('/product/:productId', function (req, res, next) {
    Product.find({ productId: req.params.productId }, function (err, product) {
        if (err) throw err;
        res.json(product);
    });
});

/* create new product */
router.post('/product', function (req, res, next) {
    var newProduct = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        price: req.body.price,
        categoryId: req.body.categoryId,
    });

    newProduct.save(function (err) {
        if (err) throw err;
        console.log('Product saved successfully!');
        res.send('Product saved successfully!');
    });
});

/*update product*/
router.put('/product/:productId', function (req, res, next) {
    Product.findOne({ productId: req.params.productId }, function (err, product) {
        product.productName = req.body.productName
        product.price = req.body.price
        product.categoryId = req.body.categoryId;
        product.updatedAt = new Date();

        product.save(function (err) {
            if (err) {
                console.error('UNABLE TO UPDATE product!');
                throw err;                
            }
            res.send('Product is updated successfully!');
        });
    });
});

/*update category*/
router.put('/category/:categoryId', function (req, res, next) {
    console.log(req.body);
    Category.findOne({ categoryId: req.params.categoryId }, function (err, category) {
        category.categoryName = req.body.categoryName
        category.parentCategoryId = req.body.parentCategoryId
        category.updatedAt = new Date();

        category.save(function (err) {
            if (err) {
                console.error('UNABLE TO UPDATE Category!');
                throw err;                
            }
            res.send('Category is updated successfully!');
        });
    });
});

/*product inside given category*/
router.get('/product/bycategory/:categoryId', function (req, res, next) {
    Product.find({ categoryId: { "$in" : [req.params.categoryId]} }, function (err, products) {
        if (err) throw err;
        res.json(products);
    });
});

/*get child category of given category*/
router.get('/childcategory/:categoryId', function (req, res, next) {
    var parent_category_id = parseInt(req.params.categoryId)
    Category.aggregate([
        {
            $match: {
                parentCategoryId: parent_category_id
            }
        },
        {
            $group: {
                _id: "$parentCategoryId",
                child_categories: {$push: "$$ROOT"}
            }
        },
        {
            $project: {
                'parent_category_id': '$_id',
                 'child_categories':1,
                 '_id':0
            }
        }, 
        { $sort : { "parent_category_id" : 1 } }
        
    ], function (err, result) {
        if (err) {
            throw err;
        } else {
            res.json(result);
        }
    });
});

module.exports = router;

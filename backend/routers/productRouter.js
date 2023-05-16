import express from 'express';
import multer from 'multer';
import fs from 'fs'
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils';
import Product from '../models/productModel';



const productRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null,'./backend/uploads/')
  },
  filename: (req,file,cb) => {
    cb(null,file.originalname)
  },
});
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...searchKeyword });
    if (products) {
      res.send(products);
    } else {
      res.status(500).send({ message: 'Error in creating product' });
    }
  })
);
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  })
);
const upload = multer({storage});
productRouter.post(
  '/',
  upload.single('testImage'),
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.name,
      image: {
          data: fs.readFileSync(`./backend/uploads/${req.file.filename}`),
          contenType:"image/png", 
      },
      category: req.body.category,
      price: req.body.price,
      brand: req.body.brand,
      rating: 0,
      numberReviews: 0,
      description: req.body.description,
      countInStock: 0,
      originalname: req.body.originalname,
    });
    const createdProduct = await product.save();
    
    if (createdProduct) {
      res
        .status(201)
        .send({ message: 'Product Created', product: createdProduct });
    } else {
      res.status(500).send({ message: 'Error in creating product' });
    }
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(500).send({ message: 'Error in updaing product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.id)
    const response = await Product.findByIdAndDelete(req.params.id)
    if (response) {
      res.send({ message: 'Product Deleted'});
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.user._id,
        name: req.user.name,
      };
      product.reviews.push(review);
      product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
      product.numReviews = product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Comment Created.',
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      throw Error('Product does not exist.');
    }
  })
);

export default productRouter;

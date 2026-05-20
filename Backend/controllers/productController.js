
import cloudinary from '../config/cloudinary.js';
import Product from "../models/Product.js";




const getProductById = async (req, res) => {
    try {

        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error hai getting product",
            error: error.message
        });

    }
};



const getProducts = async (req, res) => {   
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products', error });
    }
};





const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: result.secure_url
        });

        await newProduct.save();

        res.status(201).json(newProduct);

    } catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);
        res.status(500).json({ 
            message: "Error creating product",
            error: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const { name, description, price, category, stock } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }

        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });

    }
};

const deleteProduct = async (req, res) => {
   try {
        const productId = await product.findByIdAndDelete(req.params.id);
        if (!productId) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }               


};  



export { getProducts, createProduct, getProductById, updateProduct, deleteProduct };  

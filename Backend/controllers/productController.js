const router = require("express").Router();
const cloudinary = require("cloudinary");
const productModel = require("../models/productModel");
const authGuard = require("../auth/auithGuard");

router.post("/add", authGuard, async (req, res) => {
    console.log(req.body);
    const { productName, productPrice, productCategory, productDescription } = req.body;
    const { productImage } = req.files;
    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    const uploadedImage = await cloudinary.v2.uploader.upload(
        productImage.path,
        {
            folder: "onlinebazar",
            crop: "scale"
        },
    );

    try {

        const newProduct = new productModel({
            name: productName,
            price: productPrice,
            category: productCategory,
            description: productDescription,
            image: uploadedImage.secure_url,
        });

        await newProduct.save();
        
        res.status(201).json({ message: "Product added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

//  get all products
router.get("/get_products", async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
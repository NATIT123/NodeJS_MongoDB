const Router = require("express").Router;

const router = Router();

const Product = require("../models/product");

const products = [
  {
    name: "Stylish Backpack",
    description:
      "A stylish backpack for the modern women or men. It easily fits all your stuff.",
    price: 79.99,
    image: "http://localhost:3100/images/product-backpack.jpg",
  },
  {
    name: "Lovely Earrings",
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: "http://localhost:3100/images/product-earrings.jpg",
  },
  {
    name: "Working MacBook",
    description:
      "Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!",
    price: 1799,
    image: "http://localhost:3100/images/product-macbook.jpg",
  },
  {
    name: "Red Purse",
    description: "A red purse. What is special about? It is red!",
    price: 159.89,
    image: "http://localhost:3100/images/product-purse.jpg",
  },
  {
    name: "A T-Shirt",
    description:
      "Never be naked again! This T-Shirt can soon be yours. If you find that buy button.",
    price: 39.99,
    image: "http://localhost:3100/images/product-shirt.jpg",
  },
  {
    name: "Cheap Watch",
    description: "It actually is not cheap. But a watch!",
    price: 299.99,
    image: "http://localhost:3100/images/product-watch.jpg",
  },
];

// Get list of products products
router.get("/", async (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  // const queryPage = req.query.page;
  // const pageSize = 5;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  // res.json(resultProducts);

  try {
    const listProduct = await Product.find();
    res.status(201).json({ message: "Product added", data: listProduct });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Product Empty", err: err });
  }
});

// Get single product
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(201).json({ message: "Product added", data: product });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Product Empty", err: err });
  }
});

// Add new product
// Requires logged in user
router.post("", async (req, res, next) => {
  try {
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
      image: req.body.image,
    };

    console.log(newProduct);
    const product = await Product.create(newProduct);
    res
      .status(201)
      .json({ message: "Product added", productId: product.insertId });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Add Product Failed", error: err });
  }
});

// Edit existing product
// Requires logged in user
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      res.status(401).json({ message: "Product Empty" });
    }
    const updatedProduct = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
      image: req.body.image,
    };
    await Product.findByIdAndUpdate(id, updatedProduct);
    res
      .status(200)
      .json({ message: "Product updated", productId: product._id });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Update Product Failed", error: err });
  }
});

// Delete a product
// Requires logged in user
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Delete Product Failed", error: err });
  }
});

module.exports = router;

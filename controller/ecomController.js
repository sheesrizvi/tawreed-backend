const asyncHandler = require("express-async-handler");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const EcomCategory = require("../models/ecom/categoryEcomModel");

const EcomProduct = require("../models/ecom/ecomProductModel");
const EcomBrand = require("../models/ecom/ecomBrandModel");
const FeaturedProduct = require("../models/ecom/featuredProduct");



const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

// Ecom Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, nameAr, descriptionAr, image, active } = req.body;

  const ecomCategory = EcomCategory.create({
    name,
    description,
    image,
    nameAr,
    descriptionAr,
    active,
  });
  if (ecomCategory) {
    res.status(201).json(ecomCategory);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id, name, description, image, active, nameAr, descriptionAr } =
    req.body;
  console.log(name)
  const ecomCategory = await EcomCategory.findById(id);
  if (ecomCategory) {
    ecomCategory.name = name;
    ecomCategory.description = description;
    ecomCategory.nameAr = nameAr;
    ecomCategory.descriptionAr = descriptionAr;
    ecomCategory.image = image ? image : ecomCategory.image;
    ecomCategory.active = ecomCategory.active;
    const updatedCategory = await ecomCategory.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  const sub = await EcomCategory.findById(subid);

  const f1 = sub.image;

  if (f1) {
    const fileName = f1.split("//")[1].split("/")[1];

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
    });
    const response = await s3.send(command);
  }

  await EcomCategory.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const createBrand = asyncHandler(async (req, res) => {
  const { name, description, nameAr, descriptionAr, image, active } = req.body;

  const ecomCategory = EcomBrand.create({
    name,
    description,
    nameAr,
    descriptionAr,
    image,
    active,
  });
  if (ecomCategory) {
    res.status(201).json(ecomCategory);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  console.log('update')
  const { id, name, description, image, active, nameAr, descriptionAr } =
    req.body;
  const ecomCategory = await EcomBrand.findById(id);
  if (ecomCategory) {
    ecomCategory.name = name;
    ecomCategory.description = description;
    ecomCategory.nameAr = nameAr;
    ecomCategory.descriptionAr = descriptionAr;
    ecomCategory.image = image ? image : ecomCategory.image;
    ecomCategory.active = ecomCategory.active;
    const updatedCategory = await ecomCategory.save();

    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  const sub = await EcomBrand.findById(subid);

  const f1 = sub.image;

  if (f1) {
    const fileName = f1.split("//")[1].split("/")[1];

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
    });
    const response = await s3.send(command);
  }

  await EcomBrand.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await EcomCategory.find({});
  res.json(categories);
});

const getAllCategoryWithPagination = asyncHandler(async (req, res) => {
  const pageNumber = req.query.pageNumber || 1
  const pageSize = req.query.pageSize || 20

  const totalDocuments = await EcomCategory.countDocuments({})
  const pageCount = Math.ceil(totalDocuments/pageSize)

  const categories = await EcomCategory.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
  res.json({categories, pageCount});
});

const getAllBrands = asyncHandler(async (req, res) => {
  const categories = await EcomBrand.find({});
  res.json(categories);
});

const getAllBrandsWithPagination = asyncHandler(async (req, res) => {
  const pageNumber = req.query.pageNumber || 1
  const pageSize = req.query.pageSize || 20

  const totalDocuments = await EcomBrand.countDocuments({})
  const pageCount = Math.ceil(totalDocuments/pageSize)
  const categories = await EcomBrand.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
  res.json({categories, pageCount});
});

const getActiveCategory = asyncHandler(async (req, res) => {
  const categories = await EcomCategory.find({ active: true });
  res.json(categories);
});
const activateDeactivateCategory = asyncHandler(async (req, res) => {
  const { catId, active } = req.body;

  const category = await EcomCategory.findById(catId);
  if (category) {
    category.active = active;
    const updatedCategory = await category.save();
    res.status(201).json(updatedCategory);
  }
});

// Ecom Products
const createProduct = asyncHandler(async (req, res) => {
  const {
    seller,
    sku,
    name,
    description,
    nameAr,
    descriptionAr,
    image,
    ecomBrand,
    ecomCategory,
    manufacturer,
    details,
    detailsAr,
    price,
    discount,
    countInStock,
    active,
  } = req.body;


  const ecomProduct = EcomProduct.create({
    _id: sku + seller,
    name,
    seller,
    description,
    nameAr,
    descriptionAr,
    image,
    ecomBrand,
    ecomCategory,
    manufacturer,
    details,
    detailsAr,
    price,
    discount,
    countInStock,
    active,
  });
  if (ecomProduct) {
    res.status(201).json(ecomProduct);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    description,
    image,
    nameAr,
    descriptionAr,
    ecomBrand,
    ecomCategory,
    manufacturer,
    details,
    detailsAr,
    price,
    discount,
    countInStock,
  } = req.body;

  const ecomProduct = await EcomProduct.findById(id);
  if (ecomProduct) {
    ecomProduct.name = name;
    ecomProduct.description = description;
    ecomProduct.nameAr = nameAr;
    ecomProduct.descriptionAr = descriptionAr;
    ecomProduct.image = image ? image : ecomProduct.image;
    ecomProduct.active = ecomProduct.active;
    ecomProduct.ecomBrand = ecomBrand;
    ecomProduct.ecomCategory = ecomCategory;
    ecomProduct.manufacturer = manufacturer;
    ecomProduct.details = details;
    ecomProduct.detailsAr = detailsAr;
    ecomProduct.price = price;
    ecomProduct.discount = discount;
    ecomProduct.countInStock = countInStock;
    const updatedProduct = await ecomProduct.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  if(!subid) return res.status(400).send({message: 'product id needed for delete'})
  const sub = await EcomProduct.findById(subid);
  if(!sub) return res.status(400).send({message: 'product not found'})
  const featuredProduct = await FeaturedProduct.findOne({product: subid})
  if(featuredProduct) {
    await FeaturedProduct.findOneAndDelete({product: subid})
  }
  const f1 = sub.image;
  f1.map(async (file) => {
    const fileName = file.split("//")[1].split("/")[1];

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
    });
    const response = await s3.send(command);
  });

  await EcomProduct.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const getAllProduct = asyncHandler(async (req, res) => {
  const {
    ecomCategory,
    ecomBrand,
    seller,
    discount,
    price,
    ratings,
    min,
    max,
    mindiscount,
  } = req.query;

  const minprice = min ? min : 0;
  const maxprice = max ? max : 250000000;
  const mindiscountprice = mindiscount ? mindiscount : 0;
  const filter = {
    ecomCategory,
    ecomBrand,
    seller,
    discount,
    rating: ratings,
  };
  const asArray = Object.entries(filter);
  const filtered = asArray.filter(([key, value]) => value);
  const justStrings = Object.fromEntries(filtered);
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await EcomProduct.countDocuments({
    $and: [
      justStrings,
      { price: { $gte: minprice } },
      { price: { $lte: maxprice } },
      { discount: { $gte: mindiscountprice } },
    ],
  });

  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await EcomProduct.find({
    $and: [
      justStrings,
      { price: { $gte: minprice } },
      { price: { $lte: maxprice } },
      { discount: { $gte: mindiscountprice } },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .populate("ecomBrand ecomCategory seller");

  res.json({ products, pageCount });
});
const getActiveProduct = asyncHandler(async (req, res) => {
  const { ecomCategory, ecomBrand, price, ratings, min, max } = req.query;
  const minprice = price ? min : 0;
  const maxprice = price ? max : 2500000;
  const filter = {
    ecomCategory,
    ecomBrand,
    minprice,
    maxprice,
    rating: ratings,
  };
  const asArray = Object.entries(filter);
  const filtered = asArray.filter(([key, value]) => value);
  const justStrings = Object.fromEntries(filtered);
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const count = await EcomProduct.countDocuments({
    $and: [
      justStrings,
      { sell_price: { $gte: minprice } },
      { sell_price: { $lte: maxprice } },
      { active: true },
    ],
  });
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await EcomProduct.find({
    $and: [
      justStrings,
      { sell_price: { $gte: minprice } },
      { sell_price: { $lte: maxprice } },
      { active: true },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .populate("ecomBrand ecomCategory seller");

  res.json({ products, pageCount });
});
const activateDeactivateProduct = asyncHandler(async (req, res) => {
  const { catId, active } = req.body;

  const category = await EcomProduct.findById(catId);
  if (category) {
    category.active = active;
    const updatedProduct = await category.save();
    res.status(201).json(updatedProduct);
  }
});
const getProductById = asyncHandler(async (req, res) => {
  const product = await EcomProduct.findById(req.query.productId).populate(
    "ecomBrand ecomCategory"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
// const getProductByGroupId = asyncHandler(async (req, res) => {
//     const products = await Product.find({ groupId: req.query.groupId }).populate(
//       "color flavour brand category subcategory specialcategory size subBrand"
//     );
//     // console.log(products);
//     if (products) {
//       res.json(products);
//     } else {
//       res.status(404);
//       throw new Error("Product not found");
//     }
//   });

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, user, productId } = req.body;

  const product = await EcomProduct.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user.id,
    };

    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
const searchProducts = asyncHandler(async (req, res) => {
  const products = await EcomProduct.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: req.query.Query,
          path: [
            "name",
            "details",
            "description",
            "nameAr",
            "detailsAr",
            "descriptionAr",
          ],
        },
      },
    },
  ]);

  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getProductBySeller = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await EcomProduct.countDocuments({
    seller: req.query.sellerId,
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await EcomProduct.find({ seller: req.query.sellerId })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("ecomBrand ecomCategory seller");

  res.json({ products, pageCount });
});

module.exports = {
  getProductBySeller,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getActiveCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getActiveProduct,
  activateDeactivateCategory,
  activateDeactivateProduct,
  getAllCategoryWithPagination,
  createProductReview,
  getProductById,
  searchProducts,
  createBrand,
  getAllBrands,
  getAllBrandsWithPagination,
  updateBrand,
  deleteBrand,
};

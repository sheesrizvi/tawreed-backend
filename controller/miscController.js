const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModel");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const Wishlist = require("../models/wishlistModel");
const FeaturedProduct = require("../models/ecom/featuredProduct");
const FeaturedProperty = require("../models/property/featuredProperty");
const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

//banner
const createBanner = asyncHandler(async (req, res) => {
  const { name, image, product, company, maintenanceService, property } =
    req.body;

  const s = await Banner.create({
    name,
    img: image,
    product,
    company,
    maintenanceService,
    property,
  });
  if (s) {
    res.status(201).json(s);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const getBanner = asyncHandler(async (req, res) => {
  const s = await Banner.find({});
  if (s) {
    res.json(s);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const deleteBanner = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  const sub = await Banner.findById(subid);

  const f1 = sub.image;

  const command = new DeleteObjectsCommand({
    Bucket: process.env.AWS_BUCKET,
    Delete: { Objects: f1 },
  });
  const response = await s3.send(command);

  await Banner.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

// wishlist
const addWishlistItems = asyncHandler(async (req, res) => {
  const { items, user } = req.body;

  const wishlist = await Wishlist.findOne({ user: user });
  if (wishlist) {
    const olditems = wishlist.items;
    const newitems = olditems.concat(items);
    wishlist.items = newitems;
    const updatedWishlist = await wishlist.save();
    res.json(updatedWishlist);
  } else {
    const wishlist = await Wishlist.create({
      user,
      items,
    });

    res.json(wishlist);
  }
});

const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.query.userId }).populate(
    "items.ecomproduct items.properties items.companies"
  );

  res.json(items);
});

const createfeaturedProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const orderAgain = FeaturedProduct.create({
    product: id,
  });
  if (orderAgain) {
    res.status(201).json(orderAgain);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const createfeaturedProperty = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const orderAgain = FeaturedProperty.create({
    property: id,
  });
  if (orderAgain) {
    res.status(201).json(orderAgain);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const getfeaturedProperties = asyncHandler(async (req, res) => {
  const orderAgain = await FeaturedProperty.find({}).populate({
    path: "property",
    populate: [
      {
        path: "propertyManager",
      },
    ],
  });
  res.json(orderAgain);
});
const getfeaturedProducts = asyncHandler(async (req, res) => {
  const orderAgain = await FeaturedProduct.find({}).populate({
    path: "product",
    populate: [
      {
        path: "ecomCategory",
      },
      {
        path: "ecomBrand",
      },
      {
        path: "seller",
      },
    ],
  });
  res.json(orderAgain);
});
const deletefeaturedProduct = asyncHandler(async (req, res) => {
  await FeaturedProduct.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const deletefeaturedProperty = asyncHandler(async (req, res) => {
  await FeaturedProperty.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

const deleteWishlistItems = asyncHandler(async (req, res) => {
  const { items, user } = req.body;
  const wishlist = await Wishlist.find({ user: user });
  if (wishlist) {
    wishlist.items = wishlist.items.filter((i) => !items.includes(i));
    res.json({ message: "Item removed" });
  } else {
    res.status(404);
    throw new Error("wishlist not found");
  }
});

module.exports = {
  createBanner,
  deleteBanner,
  addWishlistItems,
  deleteWishlistItems,
  getBanner,
  deletefeaturedProduct,
  deletefeaturedProperty,
  createfeaturedProduct,
  createfeaturedProperty,
  getfeaturedProducts,
  getfeaturedProperties,
  getWishlist,
};

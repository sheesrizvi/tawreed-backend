const asyncHandler = require("express-async-handler");
const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const Properties = require("../models/property/propertiesModel");
const FeaturedProperty = require("../models/property/featuredProperty");

const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

const createProperty = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    nameAr,
    descriptionAr,
    image,
    location,
    details,
    detailsAr,
    price,
    type,
    propertyType,
    bathroom,
    rooms,
    size,
    status,
    propertyManager,
    area
  } = req.body;

  const property = Properties.create({
    name,
    description,
    nameAr,
    descriptionAr,
    detailsAr,
    image,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
    },
    details,
    price,
    propertyType,
    bathroom,
    area,
    rooms,
    size,
    type,
    status,
    propertyManager
  });
  if (property) {
    res.status(201).json(property);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updateProperty = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    nameAr,
    descriptionAr,
    detailsAr,
    image,
    location,
    details,
    price,
    area,
    type,
    status,
    id
  } = req.body;

  const property = await Properties.findById(id);

  if (property) {
    property.name = name;
    property.description = description;
    property.nameAr = nameAr;
    property.area = area;
    property.descriptionAr = descriptionAr;
    property.image = image ? image : property.image;
    property.status = status;
    property.type = type;
    property.details = details;
    property.detailsAr = detailsAr;
    property.price = price;
    property.location = location ? {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
    } : property.location;

    const updatedProperty = await property.save();

    res.json(updatedProperty);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});
const deleteProperty = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  if(!subid) return res.status(400).send({message: 'property id needed for delete'})
  const sub = await Properties.findById(subid);
  if(!sub) return res.status(400).send({message: 'property not found'})
  const featuredProperty = await FeaturedProperty.findOne({property: subid})
  if(featuredProperty) {
    await FeaturedProperty.findOneAndDelete({property: subid})
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

  await Properties.deleteOne({ _id: req.query.id });
  res.json("deleted");
});

const getAllProperties = asyncHandler(async (req, res) => {
  const { type, status, area, propertyType, min, max } = req.query;

  const minprice = min ? Number(min) : Number(0);
  const maxprice = max ? Number(max) : Number(250000000);

  const filter = {
    type,
    status,
    propertyType,
    area,
  };
  const asArray = Object.entries(filter);
  const filtered = asArray.filter(([key, value]) => value);
  const justStrings = Object.fromEntries(filtered);
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;

  const count = await Properties.countDocuments({
    $and: [
      justStrings,
      { price: { $gte: minprice } },
      { price: { $lte: maxprice } },
    ],
  });

  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Properties.find({
    $and: [
      justStrings,
      { price: { $gte: minprice } },
      { price: { $lte: maxprice } },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .populate("propertyManager area");

  res.json({ products, pageCount });
});

const getAllPropertiesManager = asyncHandler(async (req, res) => {
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Properties.countDocuments({
    propertyManager: req.query.manager,
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const sellers = await Properties.find({ propertyManager: req.query.manager })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .populate("propertyManager area");
  res.json({ sellers, pageCount });
});
const getAllPropertiesAdmin = asyncHandler(async (req, res) => {
  const sellers = await Properties.find({});
  res.json(sellers);
});

const getActiveProperties = asyncHandler(async (req, res) => {
  const { type, status, area, propertyType, price, min, max } = req.query;
  const minprice = price ? min : 0;
  const maxprice = price ? max : 2500000;
  const filter = {
    type,
    status,
    area,
    propertyType,
    minprice,
    maxprice,
    rating: ratings,
  };
  const asArray = Object.entries(filter);
  const filtered = asArray.filter(([key, value]) => value);
  const justStrings = Object.fromEntries(filtered);
  const pageSize = 30;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Properties.countDocuments({
    $and: [
      justStrings,
      { sell_price: { $gte: minprice } },
      { sell_price: { $lte: maxprice } },
    ],
  });
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const products = await Properties.find({
    $and: [
      justStrings,
      { sell_price: { $gte: minprice } },
      { sell_price: { $lte: maxprice } },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .populate("propertyManager area");

  res.json({ products, pageCount });
});

const getPropertyById = asyncHandler(async (req, res) => {
  const product = await Properties.findById(req.query.propertyId).populate(
    "propertyManager area"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});

const searchProperty = asyncHandler(async (req, res) => {
  const products = await Properties.aggregate([
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
    throw new Error("Property not found");
  }
});

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getActiveProperties,
  getAllProperties,
  getPropertyById,
  searchProperty,
  getAllPropertiesAdmin,
  getAllPropertiesManager,
};

const asyncHandler = require("express-async-handler");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const CompanyCategory = require("../models/directory/companyCategory");
const Companies = require("../models/directory/companiesModel");

const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);

// Directory Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, nameAr, descriptionAr, image, active } = req.body;

  const ecomCategory = CompanyCategory.create({
    name,
    description,
    image,
    active,
    nameAr,
    descriptionAr,
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
  const ecomCategory = await CompanyCategory.findById(id);
  if (ecomCategory) {
    ecomCategory.name = name;
    ecomCategory.nameAr = nameAr;
    ecomCategory.descriptionAr = descriptionAr;
    ecomCategory.description = description;
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
  const sub = await CompanyCategory.findById(subid);

  const f1 = sub.image;
  const fileName = f1.split("//")[1].split("/")[1];

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
  });
  const response = await s3.send(command);

  await CompanyCategory.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await CompanyCategory.find({});
  res.json(categories);
});
const getActiveCategory = asyncHandler(async (req, res) => {
  const categories = await CompanyCategory.find({ active: true });
  res.json(categories);
});
const activateDeactivateCategory = asyncHandler(async (req, res) => {
  const { catId, active } = req.body;

  const category = await CompanyCategory.findById(catId);
  if (category) {
    category.active = active;
    const updatedCategory = await category.save();
    res.status(201).json(updatedCategory);
  }
});

// Directory

const getAllCompany = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const count = await Companies.countDocuments({
    registered: true,
  });
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }
  const companies = await Companies.find({
    registered: true,
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));

  res.json({ companies, pageCount });
});

const getCompanyByCategory = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 20;
  const count = await Companies.countDocuments({
    $and: [
      { registered: true },
      { CompanyCategory: req.query.CompanyCategory },
    ],
  });
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }
  const companies = await Companies.find({
    $and: [
      { registered: true },
      { companyCategory: req.query.CompanyCategory },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));

  res.json({ companies, pageCount });
});
const searchCompanies = asyncHandler(async (req, res) => {
  const products = await Companies.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: req.query.Query,
          path: [
            "name",
            "address",
            "addressAr",
            "description",
            "details",
            "detailsAr",
            "nameAr",
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
const createCompanyReview = asyncHandler(async (req, res) => {
  const { rating, comment, user, productId } = req.body;

  const product = await Companies.findById(productId);

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
    throw new Error("Company not found");
  }
});

const setMyCategory = asyncHandler(async (req, res) => {
  const { id, category } = req.body;

  const manager = await Companies.findById(id);
  if (manager) {
    manager.companyCategory = category;
    const updatedCategory = await manager.save();
    res.status(201).json(updatedCategory);
  } else {
    res.json("Not Found");
  }
});

const getMyCategory = asyncHandler(async (req, res) => {
  const manager = await Companies.find(
    { _id: req.query.id },
    "companyCategory"
  );
  const arr = await CompanyCategory.find({
    _id: { $in: manager[0].companyCategory },
  });

  res.send(arr);
});

const delMyCategory = asyncHandler(async (req, res) => {
  const { id, category } = req.query;

  const manager = await Companies.findById(id);

  if (manager) {
    manager.companyCategory = category;
    const updatedCategory = await manager.save();
    res.status(201).json(updatedCategory);
  } else {
    res.json("Not Found");
  }
});

//profile

const updateProfile = asyncHandler(async (req, res) => {
  const {
    id,
    website,
    description,
    details,
    image,
    address,
    addressAr,
    descriptionAr,
    detailsAr,
  } = req.body;

  const manager = await Companies.findById(id);

  if (manager) {
    manager.website = website;
    manager.address = address;
    manager.addressAr = addressAr;
    manager.description = description;
    manager.descriptionAr = descriptionAr;
    manager.details = details;
    manager.detailsAr = detailsAr;
    manager.image = image;
    const updatedCategory = await manager.save();

    res.status(201).json(updatedCategory);
  } else {
    res.json("Not Found");
  }
});
const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const manager = await Companies.findById(id).populate("website");
  res.json(manager);
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getActiveCategory,
  activateDeactivateCategory,
  getAllCompany,
  getCompanyByCategory,
  searchCompanies,
  createCompanyReview,
  setMyCategory,
  getMyCategory,
  delMyCategory,
  updateProfile,
  getProfile,
};

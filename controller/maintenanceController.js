const asyncHandler = require("express-async-handler");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

const MaintenanceCategory = require("../models/maintenance/maintenanceCategoryModel");
const MaintenanceForm = require("../models/maintenance/maintenanceForms");

const MaintenanceManager = require("../models/maintenance/maintenanceManager");

const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s3 = new S3Client(config);
// Maintenance Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, nameAr, descriptionAr, image, active } = req.body;

  const maintenanceCategory = await MaintenanceCategory.create({
    name,
    description,
    nameAr,
    descriptionAr,
    image,
    active,
  });
  if (maintenanceCategory) {
    res.status(201).json(maintenanceCategory);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id, name, description, image, nameAr, descriptionAr } = req.body;
  const maintenanceCategory = await MaintenanceCategory.findById(id);
  if (maintenanceCategory) {
    maintenanceCategory.name = name;
    maintenanceCategory.description = description;
    maintenanceCategory.nameAr = nameAr;
    maintenanceCategory.descriptionAr = descriptionAr;
    maintenanceCategory.image = image ? image : maintenanceCategory.image;
    maintenanceCategory.active = maintenanceCategory.active;
    const updatedCategory = await maintenanceCategory.save();

    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const subid = req.query.id;
  const sub = await MaintenanceCategory.findById(subid);

  const f1 = sub.image;
  const fileName = f1.split("//")[1].split("/")[1];

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
  });
  const response = await s3.send(command);

  await MaintenanceCategory.deleteOne({ _id: req.query.id });
  res.json("deleted");
});
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await MaintenanceCategory.find({});
  res.json(categories);
});

const getAllCategoryWithPagination = asyncHandler(async (req, res) => {
  const pageNumber = req.query.pageNumber || 1
  const pageSize = req.query.pageSize || 20
  const totalDocuments = await MaintenanceCategory.countDocuments({})
  const pageCount = Math.ceil(totalDocuments/pageSize)
  const categories = await MaintenanceCategory.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize)
  res.json({categories, pageCount});
});

const getActiveCategory = asyncHandler(async (req, res) => {
  const categories = await MaintenanceCategory.find({ active: true });
  res.json(categories);
});
const setMyCategory = asyncHandler(async (req, res) => {
  const { id, category } = req.body;

  const manager = await MaintenanceManager.findById(id);
  if (manager) {
    manager.maintenanceCategory = category;
    const updatedCategory = await manager.save();
    res.status(201).json(updatedCategory);
  } else {
    res.json("Not Found");
  }
});
const getMyCategory = asyncHandler(async (req, res) => {
  const manager = await MaintenanceManager.find(
    { _id: req.query.id },
    "maintenanceCategory"
  );

  const arr = await MaintenanceCategory.find({
    _id: { $in: manager[0].maintenanceCategory },
  });

  res.send(arr);
});
const delMyCategory = asyncHandler(async (req, res) => {
  const { id, category } = req.query;

  const manager = await MaintenanceManager.findById(id);

  if (manager) {
    manager.maintenanceCategory = category;
    const updatedCategory = await manager.save();
    res.status(201).json(updatedCategory);
  } else {
    res.json("Not Found");
  }
});

const activateDeactivateCategory = asyncHandler(async (req, res) => {
  const { catId, active } = req.body;

  const category = await MaintenanceCategory.findById(catId);
  if (category) {
    category.active = active;
    const updatedCategory = await category.save();
    res.status(201).json(updatedCategory);
  }
});

// form

// const createForm = asyncHandler(async (req, res) => {
//   const { maintenanceCategory, questions } = req.body;

//   const maintenanceForm = await MaintenanceForm.create({
//     maintenanceCategory,
//     questions,
//   });
//   if (maintenanceForm) {
//     res.status(201).json(maintenanceForm);
//   } else {
//     res.status(404);
//     throw new Error("Error");
//   }
// });
// const getmaintenanceForms = asyncHandler(async (req, res) => {
//   const { maintenanceCategory } = req.query;
//   if (maintenanceCategory) {
//     const maintenanceForm = await MaintenanceForm.find({
//       maintenanceCategory,
//     });
//     res.json({ maintenanceForm });
//   } else {
//     const maintenanceForm = await MaintenanceForm.find({});
//     res.json({ maintenanceForm });
//   }
// });
const submitForm = asyncHandler(async (req, res) => {
  const {
    user,
    location,
    dateTime,
    image,
    manager,
    description,
    maintenanceCategory,
  } = req.body;

  const submittedForm = await MaintenanceForm.create({
    user,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude]
    },
    dateTime,
    image,
    manager,
    description,
    maintenanceCategory,
  });
  if (submittedForm) {
    res.status(201).json(submittedForm);
  } else {
    res.status(404);
    throw new Error("Error");
  }
});
const getsubmittedForms = asyncHandler(async (req, res) => {
  const { maintenanceCategory } = req.query;
  if (maintenanceCategory) {
    const submittedForm = await MaintenanceForm.find({
      maintenanceCategory,
    }).populate("user maintenanceCategory").sort({createdAt: -1});

    res.json({ submittedForm });
  } else {
    const submittedForm = await MaintenanceForm.find({}).populate(
      "user maintenanceCategory"
    ).sort({createdAt: -1});
    res.json({ submittedForm });
  }
});
const getsubmittedFormsByManager = asyncHandler(async (req, res) => {
  const pageNumber = req.query.pageNumber || 1
  const pageSize = 30

  const totalDocuments = await MaintenanceForm.countDocuments({
    manager: req.query.manager
  })
  const pageCount = Math.ceil(totalDocuments/pageSize)
  console.log(pageCount)
  const submittedForm = await MaintenanceForm.find({
    manager: req.query.manager,
  }).populate("user maintenanceCategory").sort({createdAt: -1}).skip((pageSize) * pageNumber - 1).limit(pageSize);

  res.json({ submittedForm, pageCount });
});
const getsubmittedFormsByUser = asyncHandler(async (req, res) => {
  const submittedForm = await MaintenanceForm.find({
    user: req.query.userId,
  })
    .populate("user maintenanceCategory")
    .sort({ createdAt: -1 });

  res.json({ submittedForm });
});

const createManagerReview = asyncHandler(async (req, res) => {
  const { rating, comment, user, productId } = req.body;

  const product = await MaintenanceManager.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user.id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Manager already reviewed");
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
    throw new Error("Manager not found");
  }
});

const getMaintenanceByCategory = asyncHandler(async (req, res) => {
  var arr = [req.query.CompanyCategory];
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await MaintenanceManager.countDocuments({
    $and: [
      { registered: true },
      { maintenanceCategory: { $in: arr } },
      // { CompanyCategory: req.query.CompanyCategory },
    ],
  });
  var pageCount = Math.floor(count / 20);
  if (count % 20 !== 0) {
    pageCount = pageCount + 1;
  }

  const companies = await MaintenanceManager.find({
    $and: [
      { registered: true },
      { maintenanceCategory: { $in: arr } },
      // { companyCategory: req.query.CompanyCategory },
    ],
  })
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1));

  res.json({ companies, pageCount });
});

module.exports = {
  getsubmittedForms,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getActiveCategory,
  activateDeactivateCategory,
  getMaintenanceByCategory,
  submitForm,
  createManagerReview,
  setMyCategory,
  getMyCategory,
  delMyCategory,
  getsubmittedFormsByManager,
  getsubmittedFormsByUser,
  getAllCategoryWithPagination
};

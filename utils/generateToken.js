const jwt = require("jsonwebtoken");

const generateTokenAdmin = (id, name, email, type) => {
  return jwt.sign({ id, name, email, type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
const generateTokenUser = (id, name, email, shippingAddress, phone) => {
  return jwt.sign(
    { id, name, email, shippingAddress, phone },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const generateTokenCompany = (
  id,
  name,
  nameAr,
  email,
  phone,
  type,
  registrationNumber,
  pushToken
) => {
  return jwt.sign(
    {
      id,
      name,
      nameAr,
      email,
      phone,
      type,
      registrationNumber,
      pushToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const generateTokenEcom = (
  id,
  name,
  nameAr,
  email,

  phone,
  type,

  registrationNumber,

  pushToken
) => {
  return jwt.sign(
    {
      name,
      nameAr,
      email,

      id,
      phone,
      type,

      registrationNumber,

      pushToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const generateTokenMaintenance = (
  id,
  name,
  nameAr,
  email,

  phone,
  type,

  registrationNumber,

  pushToken
) => {
  return jwt.sign(
    {
      id,
      name,
      nameAr,
      email,

      phone,
      type,

      registrationNumber,

      pushToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
const generateTokenProperty = (
  id,
  name,
  nameAr,
  email,
  phone,
  type,
  registrationNumber,
  pushToken
) => {
  return jwt.sign(
    {
      id,
      name,
      nameAr,
      email,

      phone,
      type,

      registrationNumber,

      pushToken,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = {
  generateTokenAdmin,
  generateTokenUser,
  generateTokenEcom,
  generateTokenMaintenance,
  generateTokenProperty,
  generateTokenCompany,
};

const { Product, validateProduct } = require("../../models/Product");
const {
  deleteFile,
  imageMimes,
  audioMimes,
  videoMimes
} = require("../../utils/file");
const { videoPath, audioPath, imagePath } = require("../../utils/filePaths");
let path;
let posterPath;

// Get admin add product
exports.getAddProduct = function(req, res) {
  const context = {
    title: "Add Product"
  };
  res.render("admin/add-product", context);
};

// Post admin add product
exports.postAddProduct = async function(req, res) {
  const { error } = validateProduct(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/admin/add-product");
  }
  const { file, poster } = req.files;
  const { title, description, price, rate, category } = req.body;

  if (category === "audio") {
    audioMimes(req, res, file);
    path = audioPath(file);
  }

  if (category === "video") {
    videoMimes(req, res, file);
    path = videoPath(file);
  }

  if (category === "image") {
    if (file) {
      imageMimes(req, res, file);
      path = imagePath(file);
    }
    if (poster) {
      imageMimes(req, res, poster);
      posterPath = imagePath(poster);
    }
  }

  const [filePath] = path && path.filter(route => route);
  const [posterRoute] = posterPath && posterPath.filter(route => route);
  let product = await Product.findOne({ title });
  if (product) {
    req.flash("error", `Product with the title ${title} already exists`);
    return res.redirect("/admin/add-product");
  }
  console.log(filePath, posterRoute);
  // await file.mv(`${filePath}`);
  // if (poster) await poster.mv(`${filePath}`);

  // product = new Product({
  //   user: req.user.id,
  //   title,
  //   description,
  //   category,
  //   price,
  //   file: filePath,
  //   size: file.size,
  //   rate
  // });
  // await product.save();
  // return res.redirect("/");
};

// Post admin edit product
exports.postAdminEditProduct = async (req, res) => {
  if (req.user.admin) {
    const { title, description, price, category, _id } = req.body;
    const productId = Number(_id);
    const { file, poster } = req.files;
    const imageSize = 1024 * 1024 * 5;
    if (file && file.size > imageSize) {
      req.flash("error", "Image size must not exceed 5Mbs");
      return res.redirect("/admin/products/edit-product");
    }
    const product = await Product.findOne({ _id: productId });
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (file) {
      deleteFile(`${product.file}`);
      product.file = Date.now() + "_" + file.name;
    }
    await product.save();
    req.flash("success", `updated ${product.title} successfully.`);
    return res.redirect("/admin/products");
  }
};

// Post admin delete product
exports.postAdminDeleteProduct = async function(req, res) {
  if (req.user.admin) {
    const { _id } = req.body;
    const product = await Product.findById(_id);
    req.flash("success", `deleted ${product.title} successfully.`);
    await Product.findByIdAndDelete(_id);
    deleteFile(`${product.file}`);
    return res.redirect("/admin/products");
  }
};

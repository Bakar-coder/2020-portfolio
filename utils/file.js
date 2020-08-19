const fs = require("fs");

const filterMimes = function(req, res, mimes, file, fileformat) {
  const [validMimetype] = mimes.filter(mime => mime === file.mimetype);
  const fileType = file.mimetype.split("/")[0];
  if (!validMimetype) {
    req.flash(
      "error",
      `Unsupported file, expected to upload ${fileformat} file but got ${fileType} file.`
    );
    return res.redirect("/admin/add-product");
  }
};

exports.videoMimes = function(req, res, file) {
  const mimes = ["video/mp4", "video/webm", "video/x-matroska", "video/mpeg"];
  const fileformat = "Video";
  filterMimes(req, res, mimes, file, fileformat);
  const videoSize = 1024 * 1024 * 100;
  if (file.size > videoSize) {
    req.flash("error", "Video file size should not exide 100Mbs");
    return res.redirect("/admin/add-product");
  }
};

exports.audioMimes = function(req, res, file) {
  const mimes = ["audio/mp3", "audio/mpeg"];
  const fileformat = "Audio";
  filterMimes(req, res, mimes, file, fileformat);
  const audioSize = 1024 * 1024 * 100;
  if (file.size > audioSize) {
    req.flash("error", "Audio file size should not exide 100Mbs");
    return res.redirect("/admin/add-product");
  }
};

exports.imageMimes = function(req, res, file, poster) {
  const mimes = ["image/jpg", "image/png", "image/gif", "image/jpeg"];
  const fileformat = "Image";
  filterMimes(req, res, mimes, file, fileformat);
  const imageSize = 1024 * 1024 * 5;
  if (file.size > imageSize) {
    req.flash("error", "Image file size should not exide 5Mbs");
    return res.redirect("/admin/add-product");
  }
};

exports.allMimes = function(req, res, file) {
  const mimes = [
    "image/jpg",
    "image/png",
    "image/gif",
    "image/jpeg",
    "video/mp4",
    "video/webm",
    "video/x-matroska",
    "video/mpeg",
    "audio/mp3",
    "audio/mpeg"
  ];
  filterMimes(req, res, mimes, file);
};

exports.deleteFile = function(filePath) {
  return fs.unlink(filePath, function(ex) {
    if (ex) throw ex;
  });
};

import Course from "../models/courses.model.js";

export async function isUserValidator(req, res, next) {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ message: "You are not authorized. Please login." });
  }
  next();
}

export async function isAdminValidator(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please login." });
    }

    // const course = await Course.findById(req.params.postId);

    if (req.user && req.user.isAdmin) {
        next(); 
    } else {
        res.status(403).json({ message: 'Forbidden: Requires admin privileges.' });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured during validation" });
  }
}
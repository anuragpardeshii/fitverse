const express = require("express");
const passport = require("passport");

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Default frontend URL

//Enable CORS for auth routes

// Google Authentication Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/dashboard`, // frontend URL
    failureRedirect: `${FRONTEND_URL}/login`, // frontend login page
  })
);

// router.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", (err, user, info) => {
//     if (err) return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
//     if (!user) return res.redirect(`${FRONTEND_URL}/login?error=no_user`);

//     req.logIn(user, (err) => {
//       if (err) return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
//       return res.redirect(`${FRONTEND_URL}/dashboard`);
//     });
//   })(req, res, next);
// });

// Get User Info (Session-based authentication)
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Fix CORS issue during logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Logout failed" });

      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logged out successfully" }); // ✅ Send JSON response
    });
  });
});

module.exports = router;

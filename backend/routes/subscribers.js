const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const subsController = require("../controllers/subscribers");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
// router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createSub", upload.single("image"), subsController.createSub);
router.get("/subscriber/:id", subsController.getSubscriber);
router.put("/updateSubscriber/:id", upload.single("image") ,subsController.updateSubscriper);
router.delete("/deleteSubscriper/:id", subsController.deleteSubscriber);

module.exports = router;

const cloudinary = require("../middleware/cloudinary");
const Subscriber = require("../models/Subscriber");
const User = require("../models/User")
const mongoose = require('mongoose')

module.exports = {
  getUser: async (req, res) => {
    try {
      console.log(req.user)
      res.status(200).json({ username: req.user?.username});
    } catch (err) {
      console.log(err);
    }
  },
  getSubscriber: async (req, res) => {
    try {
      const subscriberId = req.params.id;
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        return res.status(400).json({ error: "Invalid subscriber ID" });
      }
  
      // Find the subscriber in the database
      const subscriber = await Subscriber.findById(subscriberId).lean();
  
      // If subscriber not found, return a 404 error
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      // Send the subscriber data as a JSON response
      res.status(200).json(subscriber);
    }catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const subscribers = await Subscriber.find().sort({ createdAt: "desc" }).lean();
      res.json(subscribers);
    } catch (err) {
      console.log(err);
    }
  },
  createSub: async (req, res) => {
    try {
      let imageUrl = null;
      let cloudinaryId = null;
  
      // Upload image to Cloudinary only if a file is provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
      }

      await Subscriber.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        amount: req.body.amount,
        image: imageUrl,
        cloudinaryId: cloudinaryId,
        user: req.user,
      });
      // console.log(result)
      console.log("Subscriper has been added!");
      console.log(req.body); // Non-file fields
      console.log(req.file); // Uploaded file
      res.send("File uploaded successfully");
        } catch (err) {
      console.log(err);
    }
  },
  updateSubscriper: async (req, res) => {
    const subscriberId = req.params.id;
    const { firstName, lastName, phone, startDate, endDate, amount } = req.body;
    const image = req.file ? req.file.path : null;
  
    try {
      console.log('Request File:', req.file);
      console.log('Request Body:', req.body);      // Find the subscriber by ID
      const subscriber = await Subscriber.findById(subscriberId);
      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }
  
      // Prepare the update data
      const updateData = {
        firstName,
        lastName,
        phone,
        startDate,
        endDate,
        amount,
      };
  
      // If a new image is uploaded
      if (image) {
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
          folder: 'subscribers', // Optional: Organize images in a folder
        });
  
        // Delete the old image from Cloudinary if it exists
        if (subscriber.cloudinaryId) {
          await cloudinary.uploader.destroy(subscriber.cloudinaryId);
        }

        // Update the image URL and Cloudinary ID
        updateData.image = result.secure_url;
        updateData.cloudinaryId = result.public_id;
      } else {
        // If no new image is uploaded, keep the existing image and Cloudinary ID
        updateData.image = subscriber.image;
        updateData.cloudinaryId = subscriber.cloudinaryId;
      }
  
      // Find and update the subscriber
      const updatedSubscriber = await Subscriber.findByIdAndUpdate(
        subscriberId,
        updateData,
        { new: true, upsert: false } //ensures no new document is created
      );
  
      res.status(200).json(updatedSubscriber);
    } catch (error) {
      console.error('Error updating subscriber:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteSubscriber: async (req, res) => {
    try {
      const subscriber = await Subscriber.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if(subscriber.cloudinaryId){
         await cloudinary.uploader.destroy(subscriber.cloudinaryId);
      }
      // Delete subscriber from db
      await Subscriber.remove({ _id: req.params.id });
      console.log("Deleted Subscriper");
      res.status(200).json();
    } catch (err) {
      console.log(err);
    }
  },
};










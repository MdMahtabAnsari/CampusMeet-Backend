const queueConfig = require("../configs/queueConfig");
const UserRepository = require("../repositories/userRepository");
const cloudinary = require("../configs/cloudinaryConfig");
const fs = require("fs");
const userRepository = new UserRepository();
const { getIO } = require("../configs/socketIoConfig");
const SocketRepository = require("../repositories/socketRepository");
const socketRepository = new SocketRepository();

// Function to emit updated profile
const emitUpdatedProfile = async (userId) => {
  const io = getIO();
  const socketId = await socketRepository.getSocketId(userId);
  if (socketId) {
    const updatedUser = await userRepository.getUserById(userId);
    const data = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
    };
    io.to(socketId).emit("updatedProfile", data);
  }
};

const imageProcess = async () => {
  queueConfig.imageQueue.process(async (job) => {
    try {
      const user = job.data;
      if (user.image) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(user.image, {
          folder: "userImages",
        });

        // Delete the local image file
        fs.unlinkSync(user.image);

        // Update user image URL
        user.image = result.secure_url;
        await userRepository.updateImageById(user.id, user.image);

        // Emit updated profile
        await emitUpdatedProfile(user.id);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  });
};

module.exports = imageProcess;
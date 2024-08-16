const queueConfig = require('../configs/queueConfig');
const UserRepository = require('../repositories/userRepository');
const cloudinary = require('../configs/cloudinaryConfig');
const fs = require('fs');
const userRepository = new UserRepository();

const imageProcess = async () => {
    queueConfig.imageQueue.process(async (job) => {
        try {
            const user = job.data;
            if (user.image) {
                const result = await cloudinary.uploader.upload(user.image, {
                    folder: 'userImages',
                });
                fs.unlinkSync(user.image);

                user.image = result.secure_url;

                await userRepository.updateImageById(user.id, user.image);


            }

        }
        catch (error) {
            throw error;
        }
    });
}

module.exports = imageProcess;
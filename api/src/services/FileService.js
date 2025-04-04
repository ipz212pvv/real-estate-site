const path = require('path');
const { models } = require('../models');
const AWS = require('aws-sdk');

class FileService {
  constructor() {
    this.errorMessages = {
      entityNotFound: {
        user: 'Користувача не знайдено',
      },
      fileNotUploaded: 'Файл не завантажено'
    };

    this.s3 = new AWS.S3({
      endpoint: 'http://minio:9000',
      accessKeyId: 'rootroot',
      secretAccessKey: 'rootroot',
      s3ForcePathStyle: true,
      signatureVersion: 'v2',
      sslEnabled: false
    });

    this.initializeBucket();
  }

  async initializeBucket(bucketName = 'files') {
    try {
      const params = {
        Bucket: bucketName
      };

      try {
        await this.s3.headBucket(params).promise();
      } catch (error) {
        if (error.code === 'NotFound' || error.code === 'NoSuchBucket') {
          await this.s3.createBucket(params).promise();

          const publicReadPolicy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucketName}/*`]
              }
            ]
          };

          await this.s3.putBucketPolicy({
            Bucket: bucketName,
            Policy: JSON.stringify(publicReadPolicy)
          }).promise();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
      throw error;
    }
  }

  async uploadFile({
    modelInstance,
    file,
    fileNamePrefix,
    fileField,
    forcedExtension = null,
    bucketName = 'files'
  }) {
    try {
      if (!modelInstance) {
        throw new Error('Сутність не знайдено');
      }

      const fileExtension = forcedExtension || path.extname(file.originalname);
      const fileName = `${fileNamePrefix}_${modelInstance.id}_${Date.now()}${fileExtension}`;

      await this.deleteExistingFile(modelInstance[fileField]);

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer
      };

      await this.s3.putObject(params).promise();
      await modelInstance.update({ [fileField]: fileName });

      return fileName;
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      throw error;
    }
  }

  async getFileUrl(fileName, bucketName = 'files', expirationInSeconds = 3600) {
    try {
      if (!fileName) {
        throw new Error('Назву файлу не вказано');
      }

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: expirationInSeconds
      };

      const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
      return signedUrl.replace('minio:9000', 'localhost:9000');
    } catch (error) {
      console.error('Помилка отримання URL файлу:', error);
      throw error;
    }
  }

  async deleteExistingFile(fileName, bucketName = 'files') {
    if (!fileName) return;
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
    }
  }

  async getModelInstance(modelName, id) {
    const model = await models[modelName].findOne({ where: { id } });
    if (!model) {
      throw new Error(this.errorMessages.entityNotFound[modelName.toLowerCase()]);
    }
    return model;
  }

  async uploadUserImage(userId, file) {
    const user = await this.getModelInstance('User', userId);
    return this.uploadFile({
      modelInstance: user,
      file,
      fileNamePrefix: 'user',
      fileField: 'image'
    });
  }

  async getUserImage(userId) {
    const user = await this.getModelInstance('User', userId);
    if (!user.image) {
      return null;
    }
    return this.getFileUrl(user.image);
  }

  async deleteUserImage(userId) {
    const user = await this.getModelInstance('User', userId);
    if (user.image) {
      await this.deleteExistingFile(user.image);
      await user.update({ image: null });
    }
  }

  async uploadAdvertImage(AdvertImageId, file) {
    const advertImage = await this.getModelInstance('AdvertImage', AdvertImageId);
    return this.uploadFile({
      modelInstance: advertImage,
      file,
      fileNamePrefix: 'advert',
      fileField: 'imageUrl'
    });
  }

  async getAdvertImage(advertImage) {
    return this.getFileUrl(advertImage);
  }

  async deleteAdvertImage(advertId) {
    const advertImage = await this.getModelInstance('AdvertImage', advertId);

    if (advertImage) {
      await this.deleteExistingFile(advertImage.imageUrl);
      await advertImage.destroy();
    }
  }
}

module.exports = new FileService();
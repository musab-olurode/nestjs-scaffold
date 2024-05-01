import DataURIParser from 'datauri/parser';

const dataUri = new DataURIParser();

/**
 * @description This function converts the buffer to data url
 * @param {Object} file The file to be converted
 * @returns {String} The data url from the string buffer
 */
export const formatAsDataUri = (file: Express.Multer.File) =>
  dataUri.format(file.originalname, file.buffer);

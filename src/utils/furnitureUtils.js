import axios from 'axios';
import { PNPBackend } from './utils';

const uploadImage = async file => {
  // get S3 upload url from server
  const { data: uploadUrl } = await PNPBackend.get('/s3Upload');

  // upload image directly to S3 bucket
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // return box image url
  const imageUrl = uploadUrl.split('?')[0];
  return imageUrl;
};

const createNewFurniture = async donatedFurniture => {
  try {
    const res = await PNPBackend.post(`furniture`, donatedFurniture);
    const donation = res.data;
    return donation[0];
  } catch {
    return 'something went wrong';
  }
};

const updateFurniture = async (furnitureId, donatedFurniture) => {
  try {
    const res = await PNPBackend.put(`furniture/${furnitureId}`, donatedFurniture);
    const donation = res.data;
    return donation[0];
  } catch {
    return 'something went wrong';
  }
};

export default uploadImage;
export { createNewFurniture, updateFurniture };

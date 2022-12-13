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

export default uploadImage;

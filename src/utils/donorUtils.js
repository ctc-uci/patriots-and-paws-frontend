import { PNPBackend } from './utils';

const verifyDonorLogin = async (donationId, email) => {
  try {
    const res = await PNPBackend.get(`donations/verify/${donationId}/${email}`);
    const matched = res.data;
    return matched;
  } catch (err) {
    return false;
  }
};

export default verifyDonorLogin;

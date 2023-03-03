import { PNPBackend } from './utils';

const verifyDonorLogin = async (donationId, email) => {
  try {
    const res = await PNPBackend.post(`donations/verify`, { donationId, email });
    const matched = res.data;
    return matched;
  } catch (err) {
    return false;
  }
};

const getDonationStatus = async donationId => {
  try {
    const res = await PNPBackend.get(`donations/${donationId}/`);
    const donation = res.data;
    return donation[0].status;
  } catch (err) {
    return 'can not find donation';
  }
};

const getDonation = async donationId => {
  try {
    const res = await PNPBackend.get(`donations/${donationId}/`);
    // console.log(PNPBackend.get(`donations/`));
    const donation = res.data;
    return donation[0];
  } catch (err) {
    return 'can not find donation';
  }
};

export { verifyDonorLogin, getDonationStatus, getDonation };

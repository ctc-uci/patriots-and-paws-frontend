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

const createNewDonation = async data => {
  try {
    const { data: donation } = await PNPBackend.post(`donations`, data);
    return donation[0];
  } catch {
    return 'something went wrong';
  }
};

const updateDonation = async (donationId, data) => {
  try {
    const { data: donation } = await PNPBackend.put(`donations/${donationId}`, data);
    return donation[0];
  } catch {
    return 'something went wrong';
  }
};

const getDonationData = async donationId => {
  try {
    const res = await PNPBackend.get(`donations/${donationId}/`);
    const donation = res.data;
    return donation[0];
  } catch (err) {
    return 'can not find donation';
  }
};

export { verifyDonorLogin, getDonationData, createNewDonation, updateDonation };

const formatStaffData = (data, rowsPerPage) => {
  return data.reduce(
    (acc, curr) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup.length < rowsPerPage) {
        lastGroup.push(curr);
      } else {
        acc.push([curr]);
      }
      return acc;
    },
    [[]],
  );
};

export default formatStaffData;

export const generateClaimId = (existingCount) => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CLM-${year}-${random}`;
};

export const generateNotificationId = (existingCount) => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NTF-${year}-${random}`;
};

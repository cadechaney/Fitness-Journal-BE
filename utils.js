function generateUniqueId() {
  const timestamp = new Date().getTime().toString(36);
  const randomNumber = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomNumber}`;
}

module.exports = {
  generateUniqueId
};
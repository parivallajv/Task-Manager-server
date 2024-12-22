const getUserIdType = (role) => {
  switch (role) {
    case 0:
      return "adminId";
      break;
    case 1:
      return "managerId";
      break;
    case 2:
      return "_id";
      break;
    default:
      return "";
  }
};

module.exports = { getUserIdType };

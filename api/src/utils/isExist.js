
const isExistData = async (model, value) => {
  try {
    const record = await model.findByPk(value);
    return !!record;
  } catch (error) {
  }
};

module.exports = {
  isExistData
};

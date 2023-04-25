const {
  getSelectData, unGetSelectData
} = require('./../../utils');

const findAllDiscountCodeUnSelect = async ({
  limit = 50, page = 1, sort = 'ctime',
  filter, unSelect, model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

  return documents
}

const findAllDiscountCodeSelect = async ({
  limit = 50, page = 1, sort = 'ctime',
  filter, unSelect, model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean()

  return documents
}

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect
}
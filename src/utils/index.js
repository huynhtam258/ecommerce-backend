const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => Types.ObjectId(id);

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = object => {
    Object.keys(object).forEach(key => {
        if (object[key] === undefined
            || object[key] === null) delete object[key]
    })

    return object
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if(typeof obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}
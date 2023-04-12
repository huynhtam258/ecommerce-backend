const fs = require('fs');
const files = fs.readFileSync('./src/factories');
const { ProductService } = require('../services/product.service')

const SUB_FIX_FACTORIES = '.factory.js'
const DOT_SLACK = './'

const capitalizerFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

files.forEach(fileName => {
  if (fileName.includes(SUB_FIX_FACTORIES)) {
    const moduleName = fileName.replaceAll(SUB_FIX_FACTORIES, '');
    const className = capitalizerFirstLetter(moduleName)
    const obj = require(DOT_SLACK + fileName);
    ProductService.registerProductType(className, obj[className])
  }
})
module.exports = replaceTemplate = (cards, product) => {
  let output = cards.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%PRODUCTIMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCTNUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCTFROM%}/g, product.from);
  output = output.replace(/{%PRODUCTQUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRODUCTPRICE%}/g, product.price);
  output = output.replace(/{%PRODUCTDESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCTID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");
  return output;
};

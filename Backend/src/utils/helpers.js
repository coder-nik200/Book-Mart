import crypto from "crypto";

export const generateOrderNumber = () => {
  return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

export const calculateDiscount = (originalPrice, discountPercentage) => {
  return (originalPrice * discountPercentage) / 100;
};

export const calculateTax = (amount, taxPercentage = 10) => {
  return (amount * taxPercentage) / 100;
};

export const formatCurrency = (amount) => {
  return parseFloat(amount.toFixed(2));
};

export const calculateFinalPrice = (basePrice, discountPercentage = 0, taxPercentage = 10) => {
  const discountAmount = calculateDiscount(basePrice, discountPercentage);
  const priceAfterDiscount = basePrice - discountAmount;
  const taxAmount = calculateTax(priceAfterDiscount, taxPercentage);
  return {
    originalPrice: basePrice,
    discountAmount: formatCurrency(discountAmount),
    priceAfterDiscount: formatCurrency(priceAfterDiscount),
    taxAmount: formatCurrency(taxAmount),
    finalPrice: formatCurrency(priceAfterDiscount + taxAmount),
  };
};

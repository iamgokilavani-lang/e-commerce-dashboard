// Form validation helper utilities

export const validateProduct = (product) => {
  const errors = {};

  if (!product.title || product.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!product.category || product.category.trim() === '') {
    errors.category = 'Category is required';
  }

  if (product.price === undefined || product.price === '' || isNaN(product.price) || Number(product.price) <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (product.costPrice !== undefined && product.costPrice !== '') {
    if (isNaN(product.costPrice) || Number(product.costPrice) < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }
  }

  if (product.stock === undefined || product.stock === '' || isNaN(product.stock) || Number(product.stock) < 0) {
    errors.stock = 'Stock must be 0 or greater';
  }

  if (!product.sku || product.sku.trim() === '') {
    errors.sku = 'SKU is required';
  } else if (!/^[A-Z0-9-]+$/i.test(product.sku)) {
    errors.sku = 'SKU should only contain letters, numbers, and dashes';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCustomer = (customer) => {
  const errors = {};

  if (!customer.name || customer.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    errors.email = 'Valid email address is required';
  }

  if (customer.phone && customer.phone.trim().length < 7) {
    errors.phone = 'Phone number must be at least 7 digits';
  }

  if (!customer.city || customer.city.trim() === '') {
    errors.city = 'City is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRestock = (quantity, reason) => {
  const errors = {};
  if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
    errors.quantity = 'Quantity must be at least 1';
  }
  if (!reason || reason.trim() === '') {
    errors.reason = 'Reason is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

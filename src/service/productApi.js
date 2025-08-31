import { apiCall, getAuthToken } from './apiUtils';

// Get all products with authentication
export const getAllProducts = async () => {
  try {
    let allProducts = [];
    let currentPage = 1;
    let hasNext = true;
    
    // Fetch all pages to get all products
    while (hasNext) {
      const data = await apiCall(`/products/all-complete?page=${currentPage}&limit=100`, {
        method: 'GET'
      });
      
      if (data.success && data.data && data.data.products) {
        allProducts = [...allProducts, ...data.data.products];
        
        // Check if there are more pages
        if (data.data.pagination && data.data.pagination.hasNext) {
          currentPage++;
        } else {
          hasNext = false;
        }
      } else {
        hasNext = false;
      }
    }
    
    // Return in the same format as expected
    return {
      success: true,
      message: "Products retrieved successfully",
      data: {
        products: allProducts
      }
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch products');
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    return await apiCall(`/products/${productId}`, {
      method: 'GET'
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch product details');
  }
};

// Update product status
export const updateProductStatus = async (productId, enabled) => {
  try {
    return await apiCall(`/products/${productId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled })
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to update product status');
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    return await apiCall(`/products/${productId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to delete product');
  }
};

// Bulk update products via CSV
export const bulkUpdateProducts = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append('csvFile', csvFile);

    // Use apiCall with custom headers for FormData
    const token = getAuthToken();
    const response = await fetch(`${apiCall.BASE_URL || 'https://indigo-rhapsody-backend-ten.vercel.app'}/products/bulk-update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update products');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to update products');
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to create product');
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    return await apiCall(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to update product');
  }
};

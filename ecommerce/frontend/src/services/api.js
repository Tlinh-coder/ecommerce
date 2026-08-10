const API_BASE_URL = "http://localhost:8080/api";

export const getAllProducts = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu sản phẩm");
    }

    return await response.json();

  } catch (error) {
    console.error(
      "Lỗi service getAllProducts:",
      error
    );

    throw error;
  }
};


export const getProductById = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`
    );

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu sản phẩm");
    }

    return await response.json();

  } catch (error) {
    console.error(
      "Lỗi service getProductById:",
      error
    );

    throw error;
  }
};
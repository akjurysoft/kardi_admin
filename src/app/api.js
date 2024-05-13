import axios from "../../axios";

export const getProducts = async () => {
  try {
    const response = await axios.get("/api/get-products", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get("/api/fetch-categories", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getSubCategories = async () => {
  try {
    const response = await axios.get("/api/fetch-subcategories", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getSuperSubCategories = async () => {
  try {
    const response = await axios.get("/api/fetch-supersubcategories", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductBrands = async () => {
  try {
    const response = await axios.get("/api/fetch-product-brands-admin", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getCarBrands = async () => {
  try {
    const response = await axios.get("/api/fetch-car-brands");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductAttributes = async () => {
  try {
    const response = await axios.get("/api/fetch-all-attributes", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllCustomerData = async () => {
  try {
    const response = await axios.get("/api/fetch-customers", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllStoreData = async () => {
  try {
    const response = await axios.get("/api/fetch-all-store-info", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.data.code === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllTestimonialsData = async () => {
  try {
    const response = await axios.get("/api/fetch-all-testimonials", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllBannerData = async () => {
  try {
    const response = await axios.get("/api/v1/banners", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      console.log(response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllDealerData = async () => {
  try {
    const response = await axios.get("/api/fetch-dealers", {
      headers: {
        Authorization: localStorage.getItem("kardifyAdminToken"),
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField, Chip, collapseClasses } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { MdAdd } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useSnackbar } from '../SnackbarProvider';
import axios from '../../../axios';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getCarBrands, getCategories, getProductAttributes, getProductBrands, getSubCategories, getSuperSubCategories } from '../api';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProductEdit from './ProductEdit';

const CustomEditor = dynamic(() => import('../custom-editor'), { ssr: false });

const ProductList = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategory()
      // fetchCarBrand()
      fetchProductBrand()
    }

    return () => { unmounted = true };
  }, [])




  // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
  const [categoryData, setCategoryData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const fetchCategory = async () => {
    try {
      const getAllcategoryData = await getCategories();
      setCategoryData(getAllcategoryData.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ----------------------------------------------Fetch Category section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Sub Category section Starts-----------------------------------------------------
  const [subCategoryData, setSubCategoryData] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSubCategory(null)
    setSelectedSuperSubCategory(null)
    if (document.getElementById('sub_category_id')) {
      document.getElementById('sub_category_id').value = '';
    }
    if (document.getElementById('super_sub_category_id')) {
      document.getElementById('super_sub_category_id').value = '';
    }
    if (selectedCategory) {
      fetchSubCategoryData(selectedCategory);
    }
  }, [selectedCategory]);


  const fetchSubCategoryData = useCallback(
    (selectedCategory) => {
      axios.get(`/api/fetch-subcategories?category_id=${selectedCategory}`, {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )
  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------


  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])
  const [selectedSuperSubCategory, setSelectedSuperSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSuperSubCategory(null)
    if (document.getElementById('super_sub_category_id')) {
      document.getElementById('super_sub_category_id').value = ''
    }
    if (document.getElementById('edit_super_sub_category_id')) {
      document.getElementById('edit_super_sub_category_id').value = ''
    }
    if (selectedSubCategory) {
      fetchSuperSubCategoryData(selectedSubCategory);
    }
  }, [selectedSubCategory]);
  const fetchSuperSubCategoryData = useCallback(
    (selectedSubCategory) => {
      axios.get(`/api/fetch-supersubcategories?sub_category_id=${selectedSubCategory}`, {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSuperSubCategoryData(res.data.superSubcategories)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )
  // ----------------------------------------------Fetch Super Sub Category section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Product Brands section Starts-----------------------------------------------------
  const [productBrandData, setProductBrandData] = useState([])
  const fetchProductBrand = async () => {
    try {
      const getProductBrandsData = await getProductBrands();
      setProductBrandData(getProductBrandsData.brandNames);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  // ----------------------------------------------Fetch Product Brands section Ends-----------------------------------------------------


  // ----------------------------------------------Fetch Car Brands section Starts-----------------------------------------------------
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchBrandData()
    }

    return () => { unmounted = true };
  }, [])

  const [selectedBrand, setSelectedBrand] = useState('');
  useEffect(() => {
    if (selectedBrand) {
      fetchCarModelData(selectedBrand);
    }
  }, [selectedBrand]);

  const [brandData, setBrandData] = useState([])

  const fetchBrandData = useCallback(
    () => {
      axios.get(`/api/fetch-car-brands`)
        .then((res) => {
          if (res.data.code == 200) {
            setBrandData(res.data.brandName)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )

  const [carModels, setCarModels] = useState([]);
  const fetchCarModelData = useCallback((brandId) => {
    axios.get(`/api/fetch-car-models?brand_id=${brandId}`)
      .then((res) => {
        if (res.data.code == 200) {
          setCarModels(res.data.modelName);
        } else if (res.data.message === 'Session expired') {
          openSnackbar(res.data.message, 'error');
          router.push('/login');
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, 'error');
        }
      });
  }, []);

  const [selectedModel, setSelectedModel] = useState('');
  const [carYears, setCarYears] = useState([]);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const fetchCarYears = useCallback((modelId) => {
    axios.get(`/api/fetch-car-models?id=${modelId}`)
      .then((res) => {
        if (res.data.code === 200) {
          const modelData = res.data.modelName[0];
          const startYear = parseInt(modelData.start_year);
          const endYear = parseInt(modelData.end_year);
          const years = [];
          for (let year = startYear; year <= endYear; year++) {
            years.push(year);
          }
          setCarYears(years);
        } else if (res.data.message === 'Session expired') {
          openSnackbar(res.data.message, 'error');
          router.push('/login');
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, 'error');
        }
      });
  }, []);

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value;
    setSelectedBrand(selectedBrandId);
    setCarModels('')
    setCarYears([])
  };


  const handleModelChange = (e) => {
    const selectedModelId = e.target.value;
    setSelectedModel(selectedModelId);
    fetchCarYears(selectedModelId);
  };

  useEffect(() => {
    if (startYear !== '' && endYear !== '' && parseInt(endYear) < parseInt(startYear)) {
      openSnackbar('End year must be greater than or equal to start year', 'error');
      setEndYear('');
    }
  }, [startYear, endYear]);

  // product brand info section
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState('');
  const handleProductTypeChange = (event) => {
    const selectedValue = event.target.value;
    setShowSecondDiv(selectedValue === 'vehicle selection');
    setSelectedBrand('')
    setSelectedModel('')
    setStartYear('')
    setEndYear('')
    setSelectedProductType(selectedValue);
  };
  // ----------------------------------------------Fetch Car Brands section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Products section Starts-----------------------------------------------------
  const [productData, setProductData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchProductData()
      fetchProductAttribute()
    }

    return () => { unmounted = true };
  }, [])

  const fetchProductData = useCallback(
    () => {
      axios.get("/api/get-products", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.status === 'success') {
            setProductData(res.data.products)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Products section Ends-----------------------------------------------------


  // ----------------------------------------------Add Products section Starts-----------------------------------------------------
  const [getProductData, setGetProductData] = useState({
    product_name: '',
    product_desc: '',
    product_brand_id: '',
    category_id: '',
    sub_category_id: '',
    super_sub_category_id: '',
    minimum_order: '',
    weight: '',
    default_price: '',
    stock: '',
    discount_type: '',
    discount: '',
    tax_type: '',
    tax_rate: '',
    product_type: '',
    car_brand_id: '',
    car_model_id: '',
    has_exchange_policy: '',
    exchange_policy: '',
    has_cancellaton_policy: '',
    cancellation_policy: '',
    quantity: '',
    has_warranty: '',
    warranty: ''
  })

  const [editorData, setEditorData] = useState('');
  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const getData = (e) => {
    const { value, name } = e.target;

    setGetProductData(() => {
      return {
        ...getProductData,
        [name]: value
      }
    })
  }


  // Image upload function
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [images, setImages] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // const handleFileChange = (e) => {
  //   const selectedFiles = e.target.files;
  //   const newImages = [];

  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     const file = selectedFiles[i];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       newImages.push(file);
  //       setUploadedImages((prevImages) => [...prevImages, e.target.result]);
  //       setImages(newImages);
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const newImages = [...images];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        newImages.push(file);
        setUploadedImages((prevImages) => [...prevImages, e.target.result]);
        setImages(newImages);
      };

      reader.readAsDataURL(file);
    }
  };

  // const handleImageRemove = (index) => {
  //   const newImages = [...images];
  //   newImages.splice(index, 1);
  //   setImages(newImages);

  //   const newUploadedImages = [...uploadedImages];
  //   newUploadedImages.splice(index, 1);
  //   setUploadedImages(newUploadedImages);
  // };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newUploadedImages);
  };


  const reset = () => {
    setGetProductData({
      product_name: '',
      product_desc: '',
      product_brand_id: '',
      category_id: '',
      sub_category_id: '',
      super_sub_category_id: '',
      minimum_order: '',
      weight: '',
      default_price: '',
      stock: '',
      discount_type: '',
      discount: '',
      tax_type: '',
      tax_rate: '',
      product_type: '',
      car_brand_id: '',
      car_model_id: '',
      has_exchange_policy: '',
      exchange_policy: '',
      has_cancellaton_policy: '',
      cancellation_policy: '',
      quantity: '',
      has_warranty: '',
      warranty: ''
    })
    setSelectedCategory('')
    setSelectedSubCategory('')
    setSelectedSuperSubCategory('')
    setSelectedProductType('')
    setSelectedBrand('')
    setSelectedModel('')
    setStartYear('')
    setEndYear('')
    setData({});
    setSelectedProductAttribute([]);
    setSelectedAttribute([]);
  }

  const handleAddProduct = () => {
    if (getProductData.weight === '' || getProductData.weight === null) {
      openSnackbar('Enter Weight', 'error');
    }

    if (images.length === 0) {
      openSnackbar('Please add atleast one image', 'error');
      return
    }
    if (selectedProductType === 'Select Product Type' || selectedProductType === '') {
      openSnackbar('Choose Product Type', 'error');
    }
    else if (selectedProductType === 'vehicle selection' && (!selectedBrand || !selectedModel || !startYear || !endYear)) {
      openSnackbar('please select both car brand, car model and year.', 'error');
    } else {
      setIsLoading(true)
      const formData = new FormData();
      formData.append('product_name', getProductData.product_name)
      formData.append('product_desc', editorData)
      if (getProductData.product_brand_id) {
        formData.append('product_brand_id', getProductData.product_brand_id)
      }
      formData.append('category_id', selectedCategory)
      if (selectedSubCategory) {
        formData.append('sub_category_id', selectedSubCategory)
      }
      if (selectedSuperSubCategory) {
        formData.append('super_sub_category_id', selectedSuperSubCategory)
      }
      formData.append('weight', getProductData.weight)
      if (getProductData.minimum_order) {
        formData.append('minimum_order', getProductData.minimum_order)
      }
      formData.append('default_price', getProductData.default_price)
      formData.append('stock', getProductData.stock)
      formData.append('product_type', selectedProductType)

      if (getProductData.discount_type && getProductData.discount) {
        formData.append('discount_type', getProductData.discount_type)
        formData.append('discount', getProductData.discount)
      }

      if (getProductData.tax_type && getProductData.tax_rate) {
        formData.append('tax_type', getProductData.tax_type)
        formData.append('tax_rate', getProductData.tax_rate)
      }

      if (getProductData.quantity) {
        formData.append('quantity', getProductData.quantity)
      }

      if (getProductData.exchange_policy) {
        formData.append('exchange_policy', getProductData.exchange_policy)
      }

      if (getProductData.cancellation_policy) {
        formData.append('cancellation_policy', getProductData.cancellation_policy)
      }

      if (getProductData.warranty) {
        formData.append('warranty', getProductData.warranty)
      }

      formData.append('image_count', uploadedImages.length);

      if (selectedBrand && selectedModel && startYear && endYear) {
        formData.append('car_brand_id', selectedBrand)
        formData.append('car_model_id', selectedModel)
        formData.append('start_year', startYear)
        formData.append('end_year', endYear)
      };


      const combinationsDataString = JSON.stringify(addedAttributeData);
      formData.append('combinations', combinationsDataString);



      images.forEach((image, index) => {
        formData.append(`image_${index + 1}`, image);
      });

      axios({
        method: "POST",
        url: '/api/add-products',
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            openSnackbar(res.data.message, 'success');
            setIsClickedAddProduct(false)
            fetchProductData()
            reset()
            setImages([])
            setUploadedImages([])
          } else {
            openSnackbar(res.data.message, 'error');
            if (res.data.message === 'Session expired.') {
              router.push('/login')
            }
          }
        })
        .catch(err => {
          console.log(err)
          openSnackbar(err.response.data.message, 'error');
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

  }

  // ----------------------------------------------Add Products section Ends-----------------------------------------------------



  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = productData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryCategory, setSearchQueryCategory] = useState('');
  const [searchQuerySubCategory, setSearchQuerySubCategory] = useState('');
  const [searchQuerySuperSubCategory, setSearchQuerySuperSubCategory] = useState('');
  const [searchQueryBrand, setSearchQueryBrand] = useState('');

  const filteredRows = productData.filter((e) =>
    e.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    e.category.category_name.toLowerCase().includes(searchQueryCategory.toLowerCase()) &&
    (!searchQuerySubCategory || (e.sub_category && e.sub_category.sub_category_name?.toLowerCase().includes(searchQuerySubCategory.toLowerCase()))) &&
    (!searchQuerySuperSubCategory || (e.super_sub_category && e.super_sub_category.super_sub_category_name?.toLowerCase().includes(searchQuerySuperSubCategory.toLowerCase())))
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const handleExportToExcel = () => {
    Swal.fire({
      title: "Download",
      text: `Do you want to Download this?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Download it"
    }).then((result) => {
      if (result.isConfirmed) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredRows);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
        XLSX.writeFile(workbook, 'Kardify_Product_Data.xlsx');
        Swal.fire({
          title: "Downloaded!",
          text: "Your file has been successfully Downloaded.",
          icon: "success"
        });
      }
    });
  };



  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/status-change-product?product_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchProductData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------

  // ----------------------------------------------Delete car brands section Starts-----------------------------------------------------
  const deleteProduct = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.product_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-product?product_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.status === 'success') {
              fetchProductData()
              openSnackbar(res.data.message, 'success');
              if (page > 1 && paginatedRows.length === 1) {
                setPage(page - 1);
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  };

  // ----------------------------------------------Delete Car brands section Ends-----------------------------------------------------


  const [isClickedAddProduct, setIsClickedAddProduct] = useState(false)
  const handleAddNewProduct = () => {
    setIsClickedAddProduct(true)
  }

  const handleBack = () => {
    setIsClickedAddProduct(false)
    setIsEditable(false)
    setEditData({})
    setShowSecondDiv(false)
    setUploadedImages([])
  }


  // ----------------------product attribute combination section ------------------------------------

  const [getAllProductAttribute, setGetAllProductAttribute] = useState([])
  const fetchProductAttribute = async () => {
    try {
      const productAttributeData = await getProductAttributes();
      setGetAllProductAttribute(productAttributeData.attributes);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = getAllProductAttribute.filter(product => product.status === 1);
  const [selectedProductAttribute, setSelectedProductAttribute] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([])
  const [data, setData] = useState({});

  const handleProductChange = (event, value) => {
    setSelectedProductAttribute(value);
    setSelectedAttribute((prevData) => ({
      ...prevData,
      attributes: value.map((product) => ({ attribute_name: product.attribute_name, attribute_options: [] })),
    }));
  };


  const handleAttributeOptionChange = (attributeIndex, options) => {
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = options;
      return { ...prevData, attributes: updatedAttributes };
    });
  };

  const handleInputChange = (event, attributeIndex) => {
    const { value } = event.target;
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = value.split(',').map(option => option.trim());
      return { ...prevData, attributes: updatedAttributes };
    });
    event.target.value = '';
  };



  const handleDeleteOption = (attributeIndex, option) => {
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = updatedAttributes[attributeIndex].attribute_options.filter(item => item !== option);
      return { ...prevData, attributes: updatedAttributes };
    });
  };

  const generateCombinations = (attributes) => {
    const combinations = [];

    const attributeOptions = attributes ? attributes.map(attr => attr.attribute_options) : [];

    const generate = (index, combination) => {
      if (index === attributes?.length) {
        combinations.push(combination.join('-'));
        return;
      }
      if (Array.isArray(attributeOptions[index]) && attributeOptions[index].length > 0) {
        for (const option of attributeOptions[index]) {
          generate(index + 1, [...combination, option]);
        }
      }
    };

    generate(0, []);

    return combinations;
  };

  const generateFieldData = (combinations) => {
    return combinations.map((combination) => {
      const fields = [
        { label: 'price', name: `${combination}_price`, type: 'text' },
        { label: 'stock', name: `${combination}_stock`, type: 'text' }
      ];

      return { combination, fields };
    });
  };

  const onChange = (fieldName, value) => {
    setData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const combinations = generateCombinations(selectedAttribute.attributes);

  const fieldData = generateFieldData(combinations);

  const addedAttributeData = fieldData.map(combination => {
    const priceFieldName = `${combination.combination}_price`;
    const stockFieldName = `${combination.combination}_stock`;

    return {
      combinations: combination.combination.split('-').map((attribute, index) => {
        const attributeName = selectedAttribute.attributes.find(e => e.attribute_options.find(el => el == attribute))
        if (!attributeName) {
          return null;
        }
        const attributeId = selectedProductAttribute.find(e => e.attribute_name == attributeName.attribute_name)
        return {
          attribute_id: attributeId ? attributeId.id : null,
          attribute_value: attribute
        };
      }),
      combination_name: combination.combination,
      price: data[priceFieldName],
      stock: data[stockFieldName]
    };
  });


  // ---------------------------Edit Product-------------------------------
  const [editData, setEditData] = useState({})
  const [isEditable, setIsEditable] = useState(false);
  const handleEdit = (data) => {
    setEditData(data)
    setIsEditable(true)
  }



  return (
    <>
      <div className='px-[20px] py-[10px] space-y-5 container mx-auto w-[100%] overflow-y-scroll'>

        {!isClickedAddProduct && !isEditable && (
          <>
            <div className=' py-[10px] flex flex-col space-y-5'>
              <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Product List</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Simplify product management and presentation with Product Setup, ensuring a streamlined and visually compelling e-commerce storefront.</span>
              </div>
            </div>
            <div className='flex items-center justify-between gap-[10px]'>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by category</span>
                <input
                  type='text'
                  placeholder='Seach By Category'
                  className='inputText !text-[14px]'
                  value={searchQueryCategory}
                  onChange={(e) => setSearchQueryCategory(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by sub category</span>
                <input
                  type='text'
                  placeholder='Search By Sub Category'
                  className='inputText !text-[14px]'
                  value={searchQuerySubCategory}
                  onChange={(e) => setSearchQuerySubCategory(e.target.value)}
                />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by super sub category</span>
                <input
                  type='text'
                  placeholder='Search By Super Sub Category'
                  className='inputText !text-[14px]'
                  value={searchQuerySuperSubCategory}
                  onChange={(e) => setSearchQuerySuperSubCategory(e.target.value)}
                />
              </div>
              {/* <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by Brand</span>
                <input
                  type='text'
                  placeholder='Exterior'
                  className='inputText'
                  value={searchQueryBrand}
                  onChange={(e) => setSearchQueryBrand(e.target.value)}
                />
              </div> */}
            </div>

            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
              <div className='flex items-center px-3 justify-between'>
                <div className='flex space-x-2 items-center'>
                  <span className='text-[18px] font-[500] text-[#101828]'>Product List</span>
                  <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{productData.length} Products</span>
                </div>
                <div className='flex items-center space-x-3 inputText w-[50%]'>
                  <IoSearch className='text-[20px]' />
                  <input
                    type='text'
                    className='outline-none focus-none !text-[14px] w-full'
                    placeholder='Search By Product'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className='flex space-x-2'>
                  <div className='px-[16px] py-[10px] gap-[5px] flex items-center rounded-[8px] border border-[#D0D5DD] cursor-pointer hover:bg-[#cfaa4c] hover:text-[#fff] hover:border-none' onClick={handleExportToExcel}>
                    <MdOutlineFileDownload className='text-[20px] font-[600]' />
                    <span className=' text-[14px] font-[600]'>Export</span>
                  </div>
                  <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleAddNewProduct}>
                    <MdAdd className='text-[#fff] text-[20px] font-[600]' />
                    <span className=' text-[14px] text-[#fff] font-[600]'>Add New Product</span>
                  </div>
                </div>
              </div>

              {/* Table content here */}
              <Paper >
                <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow className='!bg-[#F9FAFB]'>
                        {/* Define your table header columns */}
                        <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                        <TableCell style={{ minWidth: 150 }}>Car Brand</TableCell>
                        <TableCell style={{ minWidth: 150 }}>Product Image</TableCell>
                        <TableCell style={{ minWidth: 300 }}>Product Name</TableCell>
                        <TableCell style={{ minWidth: 150 }}>Category Name</TableCell>
                        <TableCell style={{ minWidth: 50 }}>Stock</TableCell>
                        <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                        <TableCell style={{ minWidth: 100 }} align='center'>Change Status</TableCell>
                        <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                        <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    {filteredRows.length > 0 ?
                      <TableBody>
                        {paginatedRows.map((row, i) => (
                          <TableRow key={i} >
                            <TableCell>{startIndex + i + 1}</TableCell>
                            <TableCell>{row.car_brand.brand_name || 'N/A'}</TableCell>
                            <TableCell>
                              <Image src={row.images[0]?.image_url ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.images[0].image_url}` : '/images/logo.png'} width={70} height={50} alt={row.product_name} className='rounded-[8px] h-[50px] w-[50px]' />
                            </TableCell>
                            <TableCell>{row.product_name}</TableCell>
                            <TableCell>{row.category.category_name}</TableCell>
                            <TableCell>{row.stock}</TableCell>
                            <TableCell align='center'>
                              {row.status === 1 ?
                                <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                  <Image src="/images/active.svg" height={10} width={10} alt='active' />
                                  <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                                </div> :
                                <div className='flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center'>
                                  <Image src="/images/inactive.svg" height={10} width={10} alt='active' />
                                  <span className='text-red-500 text-[12px] font-[500]'>Inactive</span>
                                </div>
                              }
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={row.status === 1}
                                onChange={() => handleSwitchChange(row.id)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                sx={{
                                  '& .MuiSwitch-thumb': {
                                    backgroundColor: row.status === 1 ? '#CFAA4C' : '',
                                  },
                                  '& .Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#CFAA4C',
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteProduct(row)} /></TableCell>
                            <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      :
                      <TableRow>
                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
                      </TableRow>
                    }
                  </Table>
                </TableContainer>
              </Paper>

              {filteredRows.length > rowsPerPage && (
                <div className='flex justify-center mt-3'>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                  />
                </div>
              )}
            </div>
          </>
        )}


        {isClickedAddProduct && !isEditable ?
          <>
            <div className=' py-[10px] flex flex-col space-y-5'>
              <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Add New Product</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Introduce new items effortlessly with the Add New Product feature in the admin application for a dynamic and up-to-date online store.</span>
              </div>
            </div>

            <div className='flex items-center justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Add New Product</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Product Name</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' name='product_name' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  {/* <textarea className='outline-none focus-none inputText !text-[14px] h-[120px]' placeholder='Add product description' name='product_desc' onChange={getData} /> */}
                  <CustomEditor name='product_desc' onChange={handleEditorChange} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'> Product Brand Name</span>
                  <select className='!text-[14px]' name='product_brand_id' onChange={getData}>
                    <option >Choose Product Brand</option>
                    {productBrandData && productBrandData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.brand_name}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className='flex flex-col border space-y-3 border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Category</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Main Category</span>
                  <select className='!text-[14px]' id='category_id' name='category_id' onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="0">Choose Category</option>
                    {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
                  <select className='!text-[14px]' id='sub_category_id' name='sub_category_id' onChange={e => setSelectedSubCategory(e.target.value)}>
                    <option>Choose Sub Category</option>
                    {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
                  <select className='!text-[14px]' id='super_sub_category_id' name='super_sub_category_id' onChange={e => setSelectedSuperSubCategory(e.target.value)}>
                    <option>Choose Super Sub Category</option>
                    {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Maximum Order Quantity</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Ex: 05' name='minimum_order' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Product Weight  <span className='text-red-500 font-[400] text-[12px]'>(1.5kg = 1.5 & 1kg = 1 & 500gm = 0.5)</span> in this format</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Ex: 05' name='weight' onChange={getData} />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Product Image</span>
                <div className="flex flex-col items-center justify-center text-[16px]">
                  <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                    <div className="text-[40px]">
                      <FaCloudUploadAlt />
                    </div>
                    <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                    <span className="mt-2 text-[10px] font-bold">OR</span>
                    <button
                      className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                      onClick={handleButtonClick}
                    >
                      Click to Upload
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                  <div className="flex flex-wrap items-center mt-3">
                    {uploadedImages.map((imageDataUrl, index) => (
                      <div key={index} className="p-2 relative">
                        <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                        <button
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          onClick={() => handleImageRemove(index)}
                        >
                          <FaTimes className='text-[10px]' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Price Info</span>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Selling Price</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Price of product (in rupees)' name='default_price' onChange={getData} />
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Product Stock</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='stock' name='stock' onChange={getData} />
                  </div>
                </div>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Discount Type</span>
                    {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
                    <select className='!text-[14px] outline-none focus-none' name='discount_type' onChange={getData}>
                      <option value='0'>Select Discount Type</option>
                      <option value='percent'>Percent</option>
                      <option value='amount'>Amount</option>
                    </select>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Discount</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='0' name='discount' onChange={getData} />
                  </div>
                </div>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Tax Type</span>
                    {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
                    <select className='!text-[14px] outline-none focus-none' name='tax_type' onChange={getData}>
                      <option value='0'>Select Tax Type</option>
                      <option value='percent'>Percent</option>
                      {/* <option value='amount'>Amount</option> */}
                    </select>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Tax rate</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='0' onChange={getData} name='tax_rate' />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Product Brand Info</span>
                <div className='flex flex-col space-y-1 w-full'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Product Type</span>
                  <select className='!text-[14px] outline-none focus-none' onChange={handleProductTypeChange}>
                    <option>Select Product Type</option>
                    <option value='vehicle selection'>Vehicle Selection</option>
                    <option value='general'>General</option>
                  </select>
                  <div className={`flex flex-col space-y-1 w-full ${showSecondDiv ? '' : 'hidden'}`}>
                    <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Car Brand</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]' onChange={handleBrandChange}>
                          <option value='0'>Select Brand Here</option>
                          {brandData && brandData.map((e, i) =>
                            <option key={i} value={e.id}>{e.brand_name}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Car Model</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]' onChange={handleModelChange}>
                          <option value='0'>Select Car Model Here</option>
                          {carModels && carModels.filter(e => e.status).map((e, i) =>
                            <option key={i} value={e.id}>{e.model_name}</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Start Year</span>
                        <select className='text-[14px]' value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                          <option value='0'>Choose Start Year</option>
                          {carYears && carYears.map((e, i) =>
                            <option key={i} value={e}>{e}</option>
                          )}
                        </select>
                      </div>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>End Year</span>
                        <select className='text-[14px]' value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                          <option value='0'>Choose End Year</option>
                          {carYears && carYears.map((e, i) =>
                            <option key={i} value={e}>{e}</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Exchange Policy</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  <textarea className='outline-none focus-none inputText !text-[14px] h-[190px]' name='exchange_policy' placeholder='Add description' onChange={getData} />
                </div>
                {/* <div className='flex items-center gap-[20px] justify-between'>
                  <span className='px-[18px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                  <span className='px-[18px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                </div> */}
              </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Net Quantity and warranty info</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Net Quantity</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='06' name='quantity' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Warranty</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' name='warranty' placeholder='06' onChange={getData} />
                </div>
                <div className='flex items-end gap-[10px]'>
                  {/* <div className='flex items-center gap-[20px] justify-between w-full'>
                    <span className='px-[10px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                    <span className='px-[10px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                  </div> */}
                </div>
              </div>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Cancellation Policy</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  <textarea className='outline-none focus-none inputText !text-[14px] h-[190px]' name='cancellation_policy' placeholder='Add description' onChange={getData} />
                </div>
                {/* <div className='flex items-center gap-[20px] justify-between'>
                  <span className='px-[18px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                  <span className='px-[18px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                </div> */}
              </div>
            </div>

            <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
              <span className='text-[18px] font-[600]'>Attribute</span>
              <div className='flex flex-col space-y-3 w-full'>
                <span className='text-[14px] text-[#344054] font-[500]'>Attribute</span>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple

                    options={filteredProducts}
                    getOptionLabel={(option) => option.attribute_name}
                    value={selectedProductAttribute}
                    onChange={handleProductChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox color="primary" checked={selected} />
                        {option.attribute_name}
                      </li>
                    )}
                    style={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Attributes"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
                {selectedAttribute.attributes && Array.isArray(selectedAttribute.attributes) && selectedAttribute.attributes.map((attribute, attributeIndex) => (
                  <>
                    <div key={attributeIndex} className='flex items-end space-y-2 mt-2'>
                      <span className='text-[14px] text-[#344054] font-[500] w-[20%]'>
                        {attribute.attribute_name}
                      </span>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attribute.attribute_options.map((option, optionIndex) => (
                            <Chip
                              key={`${attributeIndex}-${option}`}
                              label={option}
                              onDelete={() => handleDeleteOption(attributeIndex, option)}
                              variant="outlined"
                              sx={{
                                backgroundColor: '#cfaa4d',
                                color: 'white',
                                borderColor: '#cfaa4d',
                                '&:hover': {
                                  backgroundColor: '#b9912d',
                                  color: 'white',
                                },
                                '& .MuiChip-deleteIcon': {
                                  color: 'white',
                                  '&:hover': {
                                    color: '#ffffffbf',
                                  },
                                },
                              }}
                            />
                          ))}
                        </div>
                        <FormControl fullWidth>
                          <span className='text-[10px] font-[500]'>Note: Enter <span className='text-red-700'>coma ( , )</span> to create new {attribute.attribute_name}</span>
                          <input
                            placeholder={`Enter ${attribute.attribute_name}`}
                            className='w-[100%] inputText focus-none outline-none !text-[14px] !text-[#354154]'
                            value={attribute.attribute_options.join(', ')}
                            // onChange={(event) => handleAttributeOptionChange(attributeIndex, event.target.value.split(',').map(option => option.trim()))}
                            onChange={(event) => handleInputChange(event, attributeIndex)}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                ))}
                {fieldData && fieldData.map((data) => (
                  <div key={data.combination} className='flex items-end text-[#354154] font-[500] text-[14px] space-x-3'>
                    {data.combination !== '' ?
                      <>
                        <h3 className='w-[30%] font-[600]'>{data.combination}</h3>
                        {data.fields.map((field, index) => (
                          <div key={index} className='flex flex-col w-[60%]'>
                            <label>{field.label}</label>
                            <input
                              className='inputText outline-none focus-none !text-[14px]'
                              placeholder={field.label === 'price' ? 'Enter Price' : field.label === 'stock' ? 'Enter Stock' : 'Enter Value'}
                              type={field.type}
                              name={field.name}
                              value={data[field.name]}
                              onChange={(e) => onChange(field.name, e.target.value)}
                            />
                          </div>
                        ))}
                      </>
                      : <span className='text-center text-[12px] font-[500] w-full' >Choose Attributes For The Combination</span>}
                  </div>
                ))}

                {/* ----------------2nd way--------------------------- */}
                {/* {selectedAttributes.length > 0 && (
                  <div className="flex flex-col items-left w-full">

                    {selectedAttributes.map((attribute, attrIndex) => (
                      <div key={attrIndex} className="flex items-center space-y-2 w-full selected_attribute_container">
                        <div className="w-[30%]">
                          <label className="input-label">{attribute.attribute_name} </label>
                        </div>
                        <div className='flex flex-wrap mb-2 gap-2 w-full'>
                          {Array.isArray(attribute.attributes) && attribute.attributes.map((selectedData, dataIndex) => (
                            <Chip
                                key={dataIndex}
                                label={selectedData}
                                onDelete={() => removeAttribute(attrIndex, dataIndex)}
                                color="primary"
                                variant="outlined"
                                sx={{
                                backgroundColor: '#cfaa4d',
                                color: 'white',
                                borderColor: '#cfaa4d',
                                '&:hover': {
                                  backgroundColor: '#b9912d',
                                  color: 'white',
                                },
                                '& .MuiChip-deleteIcon': {
                                  color: 'white',
                                  '&:hover': {
                                    color: '#ffffffbf',
                                  },
                                },
                              }}
                              />
                          ))}
                          <input className="w-full inputText" placeholder={attribute.attribute_name} value={attribute.attribute} onChange={(event) => inputAttribute(event, attrIndex)} />
                        </div>
                      </div>
                    ))}
                    {attributeValues.length > 0 && (
                      <div className="w-full">
                        <div className="w-full">
                          <label className="input-label">Combinations: </label>
                        </div>
                        {attributeValues.map((attributeValue, attrValIndex) => (
                          <div key={attrValIndex} className="py-2 flex items-center">
                            <span className='w-[30%]'>{Object.keys(attributeValue).filter(e => !['price', 'stock'].includes(e)).map(e => attributeValue[e]).join('-')}</span>
                            <div className="flex gap-[20px] w-[70%]">
                              <input className="w-full inputText" type="number" placeholder="Price" value={attributeValue.price} onChange={(event) => handlePriceChange(event, attrValIndex)} />
                              <input className="w-full inputText" type="number" placeholder="Stock" value={attributeValue.stock} onChange={(event) => handleStockChange(event, attrValIndex)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            </div>


            <div className='flex items-center gap-[30px] justify-end'>
              <span className='px-[38px] py-[10px] rounded-[8px] border border-[#D0D5DD] text-[16px] text-[#344054] font-[600] cursor-pointer' onClick={handleBack}>Back</span>
              {/* <span className='px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer' onClick={handleAddProduct}>Submit</span> */}
              <span className={`px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleAddProduct} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </span>
            </div>
          </>
          : null}


        {isEditable && (
          <ProductEdit editData={editData} setEditData={setEditData} setIsEditable={setIsEditable} productBrandData={productBrandData} categoryData={categoryData} subCategoryData={subCategoryData} superSubCategoryData={superSubCategoryData} getAllProductAttribute={getAllProductAttribute} fetchProduct={fetchProductData} />
        )}
      </div>
    </>
  )
}

export default ProductList
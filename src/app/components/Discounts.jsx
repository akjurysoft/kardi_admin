import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField } from '@mui/material';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from 'react-icons/md';
import axios from '../../../axios';
import { getCategories, getProductBrands, getProducts, getSubCategories, getSuperSubCategories } from '../api';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'

const Discounts = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategory()
      fetchProductBrands()
      fetchProducts()
      fetchDiscountsData()
    }

    return () => { unmounted = true };
  }, [])

  const [getAllCategories, setGetAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const fetchCategory = async () => {
    try {
      const categoryData = await getCategories();
      setGetAllCategories(categoryData.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  // ------------------------ Sub Category Data ----------------------------
  const [subCategoryData, setSubCategoryData] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSubCategory(null)
    document.getElementById('sub_category_id').value = ''
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

  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])
  const [selectedSuperSubCategory, setSelectedSuperSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSuperSubCategory(null)
    document.getElementById('super_sub_category_id').value = ''
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
  const [getAllProductBrands, setGetAllProductBrands] = useState([])
  const [selectedProductBrand, setSelectedProductBrand] = useState(null)
  const fetchProductBrands = async () => {
    try {
      const productBrandData = await getProductBrands();
      setGetAllProductBrands(productBrandData.brandNames);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllProducts, setGetAllProducts1] = useState([])
  useEffect(() => {
    fetchProducts(selectedProductBrand, selectedCategory, selectedSubCategory, selectedSuperSubCategory);
  }, [selectedProductBrand, selectedCategory, selectedSubCategory, selectedSuperSubCategory]);

  const fetchProducts = useCallback(
    (brand, category, subcategory, superSubcategory) => {
      let queryParams = '';

      if (brand) {
        queryParams += `product_brand_id=${brand}&`;
      }
      if (category) {
        queryParams += `category_id=${category}&`;
      }
      if (subcategory) {
        queryParams += `sub_category_id=${subcategory}&`;
      }
      if (superSubcategory) {
        queryParams += `super_sub_category_id=${superSubcategory}&`;
      }

      axios.get(`/api/get-products?${queryParams}`, {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res.data.products)
            setGetAllProducts1(res.data.products)
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

  const filteredProducts = getAllProducts.filter(product => product.status === 1);

  // ----------------------------------------------Fetch discount data section Starts-----------------------------------------------------
  const [discountData, setDiscountData] = useState([])
  const fetchDiscountsData = useCallback(
    () => {
      axios.get('/api/get-all-discounts-admin', {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.status === 'success') {
            setDiscountData(res.data.discounts)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch discount data section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = discountData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = discountData.filter((e) =>
    e.discount_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);


  // -------------------multiple product choose------------------------
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log(selectedProducts)

  const handleProductChange = (event, value) => {
    setSelectedProducts(value);
    setDiscountDataInput((prevData) => ({
      ...prevData,
      products: value.map((product) => ({ product_id: product.id })),
    }));
  };
  // -------------------multiple product choose------------------------


  //--------------------------add discounts section starts--------------------------------

  const [discountDataInput, setDiscountDataInput] = useState({
    discount_name: '',
    product_brand_id: 0,
    category_id: 0,
    sub_category_id: 0,
    super_sub_category_id: 0,
    products: [],
    discount_type: '',
    discount: 0,
    min_amount: 0,
    max_amount: 0,
    start_date: '',
    expiry_date: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDiscountDataInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reset = () => {
    setDiscountDataInput({
      discount_name: '',
      product_brand_id: 0,
      category_id: 0,
      sub_category_id: 0,
      super_sub_category_id: 0,
      products: [],
      discount_type: '',
      discount: 0,
      min_amount: 0,
      max_amount: 0,
      start_date: '',
      expiry_date: '',
    })

    document.getElementById('discount_name').value = ''
    document.getElementById('product_brand_id').value = ''
    document.getElementById('category_id').value = ''
    document.getElementById('sub_category_id').value = ''
    document.getElementById('super_sub_category_id').value = ''
    document.getElementById('discount').value = ''
    document.getElementById('min_amount').value = ''
    document.getElementById('max_amount').value = ''
    document.getElementById('start_date').value = ''
    document.getElementById('expiry_date').value = ''
    setImage(null);
    setShowImage(null)
    document.getElementById('image').value = ''
  }

  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(file);
        setShowImage(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setShowImage(null)
    document.getElementById('image').value = ''
  };


  const addDiscount = () => {
    if (!discountDataInput.discount_name) {
      openSnackbar('Please Enter Discount Name', 'error');
      return
    }
    if (!image) {
      openSnackbar('Please Select Image', 'error');
      return
    }

    const formdata = new FormData()
    if (selectedProductBrand) {
      formdata.append('product_brand_id', selectedProductBrand)
    }

    if (selectedCategory) {
      formdata.append('category_id', selectedCategory)
    }

    if (selectedSubCategory) {
      formdata.append('sub_category_id', selectedSubCategory)
    }

    if (selectedSuperSubCategory) {
      formdata.append('super_sub_category_id', selectedSuperSubCategory)
    }

    if (selectedProducts.length > 0) {
      formdata.append('products', JSON.stringify(discountDataInput.products));
    }

    if (image) {
      formdata.append('image', image)
    }
    formdata.append('discount_name', discountDataInput.discount_name)
    formdata.append('discount_type', discountDataInput.discount_type)
    formdata.append('discount', discountDataInput.discount)
    formdata.append('min_amount', discountDataInput.min_amount)
    formdata.append('max_amount', discountDataInput.max_amount)
    formdata.append('start_date', discountDataInput.start_date)
    formdata.append('expiry_date', discountDataInput.expiry_date)


    axios.post('/api/add-discounts', formdata, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchDiscountsData()
          reset()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  //--------------------------add discounts section ends--------------------------------

  // -------------------------- status change section starts--------------------------------

  const handleSwitchChange = (id) => {
    axios.post(`/api/update-discount-status?discount_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchDiscountsData()
        }else{
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // -------------------------- status change section ends--------------------------------


  // --------------------------delete discounts section starts--------------------------------
  const deleteDiscount = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.discount_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-discount?discount_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.status === 'success') {
              openSnackbar(res.data.message, 'success');
              fetchDiscountsData()
            }else{
              openSnackbar(res.data.message, 'error');
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  };
  // --------------------------delete discounts section ends--------------------------------


  // --------------------------edit discounts section starts--------------------------------
  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})

  const handleEdit = (data) => {
    setEditData(data)
    setIsEditable(true)
  }

  const resetButton = () => {
    setIsEditable(false)
  }

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      {!isEditable ?
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Offers Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Offer Name </span>
              <input type='text' placeholder='Discount title' id='discount_name' className='inputText' name='discount_name' value={discountData.discount_name}
                onChange={handleInputChange} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product Brands </span>
              <select name='product_brand_id' id='product_brand_id' onChange={e => setSelectedProductBrand(e.target.value)}>
                <option value=''>Select Product brand Here</option>
                {getAllProductBrands && getAllProductBrands.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.brand_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Category </span>
              <select name='category_id' id='category_id' onChange={e => setSelectedCategory(e.target.value)}>
                <option value=''>Select category  Here</option>
                {getAllCategories && getAllCategories.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category </span>
              <select name='sub_category_id' id='sub_category_id' onChange={e => setSelectedSubCategory(e.target.value)}>
                <option value=''>Select Sub category Type Here</option>
                {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category </span>
              <select name='super_sub_category_id' id='super_sub_category_id' onChange={e => setSelectedSuperSubCategory(e.target.value)}>
                <option value=''>Select Super sub category Here</option>
                {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product </span>
              {/* <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select> */}
              <FormControl fullWidth>
                <Autocomplete
                  multiple

                  options={filteredProducts}
                  getOptionLabel={(option) => option.product_name}
                  value={selectedProducts}
                  onChange={handleProductChange}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox color="primary" checked={selected} />
                      {option.product_name}
                    </li>
                  )}
                  style={{ width: '100%' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Products"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Type </span>
              <select name='discount_type' id='discount_type' onChange={handleInputChange} value={discountData.discount_type}>
                <option>Select Coupon Type Here</option>
                <option>Amount</option>
                <option>Percent</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Amount </span>
              <input type='text' placeholder='Horn' className='inputText' id='discount' name='discount' onChange={handleInputChange} value={discountData.discount} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Minimum Purchase </span>
              <input type='text' placeholder='Horn' className='inputText' id='min_amount' name='min_amount' onChange={handleInputChange} value={discountData.min_amount} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Discount </span>
              <input type='text' placeholder='Horn' className='inputText' id='max_amount' name='max_amount' onChange={handleInputChange} value={discountData.max_amount} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Start Date </span>
              <input type='Date' placeholder='Horn' className='inputText' id='start_date' name='start_date' onChange={handleInputChange} value={discountData.start_date} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Expiry Date </span>
              <input type='Date' placeholder='Horn' className='inputText' id='expiry_date' name='expiry_date' onChange={handleInputChange} value={discountData.expiry_date} />
            </div>

          </div>
          <div className='flex items-end gap-[10px]'>
            <div className='flex flex-col space-y-1 '>
              <span>Offer Image</span>
              <input type='file' accept='image/*' id='image' onChange={handleImageChange} />
            </div>

            {showImage && (
              <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width={100} className='rounded-[8px] h-[60px] !w-[60px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={reset}>Reset</span>
            <span className='submitButton' onClick={addDiscount}>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Offers</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{discountData.length} Offers</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table content here */}
            <Paper >
              <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* Define your table header columns */}
                      <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Title</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Offer Image</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Product Brand</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Category Name</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Discount Type</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Discount</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Maximum</TableCell>
                      <TableCell style={{ minWidth: 250 }}>Duration</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Status</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row, i) => (
                        <TableRow key={row.id} >
                          <TableCell>{startIndex + i + 1}</TableCell>
                          <TableCell>
                            {row.discount_name}
                          </TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image}`} width={50} height={50} alt={row.category?.category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>
                            {row.product_brand?.brand_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {row.category?.category_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {row.discount_type}
                          </TableCell>
                          <TableCell>
                            {row.discount}
                          </TableCell>
                          <TableCell>
                            {row.max_amount}
                          </TableCell>
                          <TableCell>
                            {row.start_date && row.expiry_date ? (
                              `${formatDate(row.start_date)} - ${formatDate(row.expiry_date)}`
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell >
                            {row.status === true ?
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
                              checked={row.status === true}
                              onChange={() => handleSwitchChange(row.id)}
                              inputProps={{ 'aria-label': 'controlled' }}
                              sx={{
                                '& .MuiSwitch-thumb': {
                                  backgroundColor: row.status === true ? '#CFAA4C' : '',
                                },
                                '& .Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#CFAA4C',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteDiscount(row)} /></TableCell>
                          <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    :
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Discounts found</TableCell>
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

        </div>
        :
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Discount Edit</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Name </span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Brands </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Category </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Type </span>
              <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Amount </span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Minimum Purchase </span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Discount </span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Start Date </span>
              <input type='Date' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Expiry Date </span>
              <input type='Date' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={resetButton}>Reset</span>
            <span className='submitButton'>Submit</span>
          </div>
        </div>
      }
    </div>
  )
}

export default Discounts
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

const Discounts = () => {
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategory()
      fetchSubCategory()
      fetchSuperSubCategory()
      fetchProductBrands()
      fetchProducts()
      fetchDiscountsData()
    }

    return () => { unmounted = true };
  }, [])

  const [getAllCategories, setGetAllCategories] = useState([])
  const fetchCategory = async () => {
    try {
      const categoryData = await getCategories();
      setGetAllCategories(categoryData.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllSubCategories, setGetAllSubCategories] = useState([])
  const fetchSubCategory = async () => {
    try {
      const subCatgeoryData = await getSubCategories();
      setGetAllSubCategories(subCatgeoryData.subcategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllSuperSubCategories, setGetAllSuperSubCategories] = useState([])
  const fetchSuperSubCategory = async () => {
    try {
      const superSubCategoryData = await getSuperSubCategories();
      setGetAllSuperSubCategories(superSubCategoryData.superSubcategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllProductBrands, setGetAllProductBrands] = useState([])
  const fetchProductBrands = async () => {
    try {
      const productBrandData = await getProductBrands();
      setGetAllProductBrands(productBrandData.brandName);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllProducts, setGetAllProducts1] = useState([])
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setGetAllProducts1(productsData.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = getAllProducts.filter(product => product.status === 1);

  // ----------------------------------------------Fetch discount data section Starts-----------------------------------------------------
  const [discountData, setDiscountData] = useState([])
  const fetchDiscountsData = useCallback(
    () => {
      axios.get('/api/get-all-discounts-admin')
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
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);


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
    document.getElementById('products').value = ''
    document.getElementById('discount').value = ''
    document.getElementById('min_amount').value = ''
    document.getElementById('max_amount').value = ''
    document.getElementById('start_date').value = ''
    document.getElementById('expiry_date').value = ''
  }

  const addDiscount = () => {
    axios.post('/api/add-discounts', {
      discount_name: discountDataInput.discount_name,
      product_brand_id: discountDataInput.product_brand_id,
      category_id: discountDataInput.category_id,
      sub_category_id: discountDataInput.sub_category_id,
      super_sub_category_id: discountDataInput.super_sub_category_id,
      products: discountDataInput.products,
      discount_type: discountDataInput.discount_type,
      discount: discountDataInput.discount,
      min_amount: discountDataInput.min_amount,
      max_amount: discountDataInput.max_amount,
      start_date: discountDataInput.start_date,
      expiry_date: discountDataInput.expiry_date
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success'){
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
            <span className='text-[30px] text-[#101828] font-[500]'>Discounts Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Name </span>
              <input type='text' placeholder='Discount title' id='discount_name' className='inputText' name='discount_name' value={discountData.discount_name}
                onChange={handleInputChange} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product Brands </span>
              <select name='product_brand_id' id='product_brand_id' onChange={handleInputChange} value={discountData.product_brand_id}>
                <option>Select Product brand Here</option>
                {getAllProductBrands && getAllProductBrands.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.brand_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Category </span>
              <select name='category_id' id='category_id' onChange={handleInputChange} value={discountData.category_id}>
                <option>Select category  Here</option>
                {getAllCategories && getAllCategories.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category </span>
              <select name='sub_category_id' id='sub_category_id' onChange={handleInputChange} value={discountData.sub_category_id}>
                <option>Select Sub category Type Here</option>
                {getAllSubCategories && getAllSubCategories.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category </span>
              <select name='super_sub_category_id' id='super_sub_category_id' onChange={handleInputChange} value={discountData.super_sub_category_id}>
                <option>Select Super sub category Here</option>
                {getAllSuperSubCategories && getAllSuperSubCategories.filter(e => e.status).map((e, i) =>
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

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton'>Reset</span>
            <span className='submitButton' onClick={addDiscount}>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Discounts</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{discountData.length} Discounts</span>
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
                      <TableCell style={{ minWidth: 150 }}>Title</TableCell>
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
                      {paginatedRows.map((row) => (
                        <TableRow key={row.id} >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>
                            {row.discount_name}
                          </TableCell>
                          <TableCell>
                            {row.product_brand_id}
                          </TableCell>
                          <TableCell>
                            {row.category_id}
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
                          <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteCategory(row)} /></TableCell>
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
import React, { useEffect, useState } from 'react'
import { getCategories, getSubCategories, getSuperSubCategories } from '../api';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Avatar, Chip, CircularProgress, Grid, IconButton, LinearProgress } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { Close, InsertDriveFile } from '@mui/icons-material';
import { FaFileCsv } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import axios from '../../../axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';

const BulkImport = () => {

  const {openSnackbar} = useSnackbar()




  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategory()
      fetchSubCategory()
      fetchSuperSubCategory()
    }

    return () => { unmounted = true };
  }, [])


  const [categoryData, setCategoryData] = useState([])
  const fetchCategory = async () => {
    try {
      const getAllcategoryData = await getCategories();
      setCategoryData(getAllcategoryData.categories);
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



// For selection of subcategories and supersub categories based on category
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const filteredSubCategories = getAllSubCategories.filter(subCat => subCat.category_id === parseInt(selectedCategory));
  const filteredSuperSubCategories = getAllSuperSubCategories.filter(superSubCat => superSubCat.sub_category_id === parseInt(selectedSubCategory));
  

  // -------------------------------- creating CSV Files------------------------------------------
  const [productFields, setProductFields] = useState([{ categoryId: '', subCategoryId: '', superSubCategoryId: '', totalProducts: '' }]);

  const handleAddNew = () => {
    setProductFields(prevFields => [...prevFields, { categoryId: '', subCategoryId: '', superSubCategoryId: '', totalProducts: '' }]);
  };

  const handleRemove = (index) => {
    setProductFields(prevFields => prevFields.filter((_, i) => i !== index));
  };

  // const handleFieldChange = (index, fieldName, value) => {
  //   if (value === "Choose Category") {
  //     alert("Please select a valid category");
  //     return;
  //   }
  //   const updatedFields = [...productFields];
  //   updatedFields[index][fieldName] = value;
  //   setProductFields(updatedFields);
  // };

  const handleFieldChange = (index, fieldName, value) => {
    if (value === "Choose Category") {
      alert("Please select a valid category");
      return;
    }
    const updatedFields = [...productFields];
    updatedFields[index][fieldName] = value;
  
    if (fieldName === 'categoryId') {
      setSelectedCategory(value);
      setSelectedSubCategory('');
    } else if (fieldName === 'subCategoryId') {
      setSelectedSubCategory(value);
    }
  
    setProductFields(updatedFields);
  };
  

  const fetchCategoryName = (categoryId) => {
    const category = categoryData && categoryData.find(cat => cat.id === categoryId);
    console.log(category)
    return category ? category.category_name : '';
  };
  const fetchSubCategoryName = (subCategoryId) => {
    const subCategory = getAllSubCategories.find(subCat => subCat.id === subCategoryId);
    return subCategory ? subCategory.sub_category_name : '';
  };

  const fetchSuperSubCategoryName = (superSubCategoryId) => {
    const superSubCategory = getAllSuperSubCategories.find(superSubCat => superSubCat.id === superSubCategoryId);
    return superSubCategory ? superSubCategory.super_sub_category_name : '';
  };
  const generateCSV =async () => {
    for (const field of productFields) {
      if (!field.categoryId) {
        alert('Please select a category');
        return;
      }

      if (!field.subCategoryId || field.subCategoryId === 'Choose Sub Category') {
        field.subCategoryId = 0;
      }

      if (!field.superSubCategoryId || field.superSubCategoryId === 'Choose Super Sub Category') {
        field.superSubCategoryId = 0;
      }
    }

    let csv = "category_id,category_name,sub_category_id,sub_category_name,super_sub_category_id,super_sub_category_name,product_name,product_desc,default_price,stock,discount_type,dicount,tax_type,tax_rate,product_type,car_brand_id,car_model_id,start_year,end_year,exchange_policy,cancellation_policy,weight,warranty\n";

    for (const field of productFields) {
      const categoryName =  fetchCategoryName(parseInt(field.categoryId));
      const subCategoryName =  fetchSubCategoryName(parseInt(field.subCategoryId));
      const superSubCategoryName =  fetchSuperSubCategoryName(parseInt(field.superSubCategoryId));
      await Promise.all([categoryName, subCategoryName, superSubCategoryName]);
      for (let i = 0; i < parseInt(field.totalProducts); i++) {
        csv += `${field.categoryId},${categoryName},${field.subCategoryId},${subCategoryName},${field.superSubCategoryId},${superSubCategoryName}\n`;
      }
    }

    // console.log(csv)
    downloadCSV(csv);

    setProductFields([{ categoryId: '', subCategoryId: '', superSubCategoryId: '', totalProducts: '' }]);
  };

  const downloadCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_upload.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const hasEmptyTotalProduct = productFields.some(field => field.totalProducts === '');
  const allTotalProductsValid = productFields.every(field => parseInt(field.totalProducts) > 0);

  // -------------------------Ends------------------------------



  // -------------------Upload CSV Data-------------------------------
  const [csvData, setCsvData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [totalLines, setTotalLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [parsedCsvData, setParsedCsvData] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadingError, setUploadingError] = useState(false);
  const [existUploadError, setExistUploadError] = useState(false);
  const [errorTagline, setErrorTagline] = useState('');
  const [existingProductData, setExistingProductData] = useState([])
  const [showAddButton, setShowAddButton] = useState(true)


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadedFile(file)
      setProgress(0);
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          const csvContent = reader.result;
          setCsvData(csvContent);
          setUploading(false);
          const trimmedCsvContent = csvContent.trim();
          const lines = trimmedCsvContent.split('\n');
          const linesCount = lines.length - 1;
          setTotalLines(linesCount);

          // Parse CSV data into an array of objects
          const headers = lines[0].split(',').map(header => header.trim());
          const parsedData = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
          setParsedCsvData(parsedData);
        }, 2000);
      };
      reader.readAsText(file);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById('csv-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    setParsedCsvData(null);
    setUploadingError(false)
    setUploadingProgress(0)
    setErrorTagline('')
    setShowProgress(false)
    setExistingProductData([])
    setShowAddButton(true)
  };

  const progressTaglines = [
    { percentage: 0, tagline: "Getting started..." },
    { percentage: 25, tagline: "Making progress..." },
    { percentage: 50, tagline: "Almost there!" },
    { percentage: 100, tagline: "Completed!" }
  ];


  const addProductToProductList = async () => {
    if (!parsedCsvData) {
      alert('No parsed CSV data available.');
      return;
    }

    setShowAddButton(false)
    setShowProgress(true);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setUploadingProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 1000);


    try {

      await new Promise(resolve => setTimeout(resolve, 10000));

      const cleanedData = parsedCsvData.map(({ category_name, sub_category_name, super_sub_category_name, ...rest }) => rest);
      console.log('cleanedData', cleanedData);

       // Filter out empty fields from each product object
        const filteredData = cleanedData.map(product => {
          const filteredProduct = {};
          for (const key in product) {
            if (product[key] !== "") {
              filteredProduct[key] = product[key];
            }
          }
          return filteredProduct;
        });

        console.log('filteredData', filteredData);

    

      const res = await axios.post('/api/add-bulk-product', {
        product_data: filteredData,
      }, {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      });

      console.log('res.data', res.data);
      if (res.data.status === 'success') {
        openSnackbar(res.data.message, 'success');
        clearInterval(interval);
        setUploadingProgress(100);
        resetData()
      } else {
        openSnackbar(res.data.message, 'error');
        clearInterval(interval);
        setUploadingProgress(0);
        setUploadingError(true);
        setExistUploadError(true); 
        setExistingProductData(res.data.existingProducts)
        setErrorTagline(res.data.message);
      }
    } catch (err) {
      console.log(err);
      console.log('error is in the catch block');
        console.log(err?.response?.data?.message);
        openSnackbar(err?.errponse?.data?.message, 'error');
        clearInterval(interval);
        setUploadingProgress(0);
        setUploadingError(true);
        setErrorTagline(err?.response?.data?.message);
    }
  }

  // ------------------ends-----------------------------


  const resetData = () => {
    setProductFields([{ categoryId: '', subCategoryId: '', superSubCategoryId: '', totalProducts: '' }]);

    setCsvData(null);
    setUploadedFile(null);
    setProgress(0);
    const fileInput = document.getElementById('csv-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    setParsedCsvData(null);
    setUploadingProgress(0)
    setShowProgress(false)
    setErrorTagline('')
    setShowProgress(false)
    setUploadingError(false)
    setExistingProductData([])
    setShowAddButton(true)
  };

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      <div className=' py-[10px] flex flex-col space-y-5'>
        <div className='flex flex-col space-y-1'>
          <span className='text-[30px] text-[#101828] font-[500]'>Bulk Imports</span>
          <span className='text-[#667085] font-[400] text-[16px] capitalize'>Effortless Data Onboarding for seamless administrative mastery.</span>
        </div>

        <div className='p-[1.5rem] rounded-[0.75rem]' style={{ boxShadow: '0 6px 24px 0 rgba(140, 152, 164, 0.125)' }}>
          <span className='text-[16px] font-[700]'>Instruction:</span>
          <p className='text-[14px] py-2 text-[#677788] font-[400]'>1. Download the format file and fill it with proper data.</p>
          <p className='text-[14px] py-2 text-[#677788] font-[400]'>2. You can download the example file to understand how the data must be filled.</p>
          <p className='text-[14px] py-2 text-[#677788] font-[400]'>3. Once you have downloaded and filled the format file upload it in the form below and submit.</p>
          <p className='text-[14px] py-2 text-[#677788] font-[400]'>4. After uploading products you need to edit them and set product s images and choices.</p>
          <p className='text-[14px] py-2 text-[#677788] font-[400]'>5. You can get category and sub-category id from their list please input the right ids.</p>
        </div>

        <div className='p-[1.5rem] rounded-[0.75rem] space-y-3' style={{ boxShadow: '0 6px 24px 0 rgba(140, 152, 164, 0.125)' }}>
          <div className='flex items-center justify-between'>

            <div class="relative inline-flex items-center px-12 py-[8px] overflow-hidden text-lg font-medium text-gray-600 border-2 border-gray-600 rounded-[8px] hover:text-white group hover:bg-gray-50 cursor-pointer" onClick={resetData}>
              <span class="absolute left-0 block w-full h-0 transition-all bg-gray-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </span>
              <span class="relative text-[17px]">Reset</span>
            </div>

            <div className='flex items-center gap-[10px]'>
              {allTotalProductsValid && !hasEmptyTotalProduct && (
                <span className='px-[40px] py-[10px] text-[#fff] text-[14px] bg-[#cfaa4c] hover:opacity-70 cursor-pointer rounded-[8px]' onClick={generateCSV}>Download CSV</span>
              )}
              <span className='px-[40px] py-[10px] text-[#fff] text-[14px] bg-[#cfaa4c] hover:opacity-70 cursor-pointer rounded-[8px]' onClick={handleAddNew}>Add New</span>
            </div>
          </div>
          {/* {productFields.map((field, index) => (
            <div key={index} className='grid grid-cols-4 gap-4 p-[10px]'>
              <div className='flex flex-col space-y-1'>
                <span className='text-[14px] text-[#344054] font-[500]'>Select Category</span>
                <select className='!text-[14px]' name='category_id' value={field.categoryId} onChange={(e) => handleFieldChange(index, 'categoryId', e.target.value)}>
                  <option>Choose Category</option>
                  {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1'>
                <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
                <select className='!text-[14px]' name='category_id' value={field.subCategoryId} onChange={(e) => handleFieldChange(index, 'subCategoryId', e.target.value)}>
                  <option>Choose Sub Category</option>
                  {getAllSubCategories && getAllSubCategories.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.sub_category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1'>
                <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
                <select className='!text-[14px]' name='category_id' value={field.superSubCategoryId} onChange={(e) => handleFieldChange(index, 'superSubCategoryId', e.target.value)}>
                  <option>Choose Super Sub Category</option>
                  {getAllSuperSubCategories && getAllSuperSubCategories.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex gap-[5px] items-center'>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Total Products (in number)</span>
                  <input type='number' placeholder='Ex: 40' className='inputText !text-[14px] outline-[#cfaa4c] focus-[#cfaa4c]' value={field.totalProducts} onChange={(e) => handleFieldChange(index, 'totalProducts', e.target.value)} />
                </div>
                {index > 0 && (
                  <span className='cursor-pointer' onClick={() => handleRemove(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.293 5.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 011.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))} */}
          {productFields.map((field, index) => (
  <div key={index} className='grid grid-cols-4 gap-4 p-[10px]'>
    <div className='flex flex-col space-y-1'>
      <span className='text-[14px] text-[#344054] font-[500]'>Select Category</span>
      <select className='!text-[14px]' name='category_id' value={field.categoryId} onChange={(e) => handleFieldChange(index, 'categoryId', e.target.value)}>
        <option>Choose Category</option>
        {categoryData && categoryData.filter(e => e.status).map((e, i) =>
          <option key={i} value={e.id}>{e.category_name}</option>
        )}
      </select>
    </div>
    <div className='flex flex-col space-y-1'>
      <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
      <select className='!text-[14px]' name='category_id' value={field.subCategoryId} onChange={(e) => handleFieldChange(index, 'subCategoryId', e.target.value)}>
        <option>Choose Sub Category</option>
        {filteredSubCategories && filteredSubCategories.filter(e => e.status).map((e, i) =>
          <option key={i} value={e.id}>{e.sub_category_name}</option>
        )}
      </select>
    </div>
    <div className='flex flex-col space-y-1'>
      <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
      <select className='!text-[14px]' name='category_id' value={field.superSubCategoryId} onChange={(e) => handleFieldChange(index, 'superSubCategoryId', e.target.value)}>
        <option>Choose Super Sub Category</option>
        {filteredSuperSubCategories && filteredSuperSubCategories.filter(e => e.status).map((e, i) =>
          <option key={i} value={e.id}>{e.super_sub_category_name}</option>
        )}
      </select>
    </div>
    <div className='flex gap-[5px] items-center'>
      <div className='flex flex-col space-y-1'>
        <span className='text-[14px] text-[#344054] font-[500]'>Total Products (in number)</span>
        <input type='number' placeholder='Ex: 40' className='inputText !text-[14px] outline-[#cfaa4c] focus-[#cfaa4c]' value={field.totalProducts} onChange={(e) => handleFieldChange(index, 'totalProducts', e.target.value)} />
      </div>
      {index > 0 && (
        <span className='cursor-pointer' onClick={() => handleRemove(index)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.293 5.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 011.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  </div>
))}



          <div className='flex flex-col space-y-3 p-[16px] w-[100%]'>
            <div className="flex flex-col items-center justify-center text-[16px]">
              <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                <div className="text-[40px]">
                  <FaCloudUploadAlt />
                </div>
                <header className="text-[10px] font-semibold">Drag & Drop to Upload CSV File</header>
                <span className="mt-2 text-[10px] font-bold">OR</span>
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <CircularProgressWithLabel value={progress} />
                    <p className="text-[12px] mt-2">Uploading...</p>
                  </div>
                ) : (
                  <label htmlFor="csv-upload" className="text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300 cursor-pointer">
                    Click to Upload
                  </label>
                )}
                <input
                  id="csv-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv"
                />

                {progress === 100 && uploadedFile && (
                  <div className='py-[20px]'>
                    <Chip
                      label={
                        <div className='flex items-center'>
                          <FaFileCsv style={{ marginRight: '5px' }} className='text-[18px] ' />
                          {uploadedFile.name}
                        </div>
                      }
                      onDelete={handleRemoveFile}
                      className='py-[17px]'
                      style={{ backgroundColor: '#008629', color: '#fff', fontWeight: 'bold' }}
                      sx={{
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
                  </div>
                )}
              </div>
            </div>
          </div>
          {progress === 100 && uploadedFile && showAddButton && (
            <div className='flex justify-center'>
              <div className='flex items-center gap-[10px] bg-[#cfaa4c] px-[30px] py-[8px] rounded-[8px] cursor-pointer text-[#fff] text-[14px] hover:opacity-90'>
                <FaUpload />
                <span onClick={addProductToProductList}>Add {totalLines} Products to Product List</span>
              </div>
            </div>
          )}

          {showProgress && (
            <div className='py-[10px] flex flex-col space-y-1'>
              <LinearProgress
                variant="determinate"
                value={uploadingProgress}
                sx={uploadingError ? { backgroundColor: 'red' } : {}}
              />
              <span className='text-[#ff0000] text-[14px] font-[600]'>{errorTagline}</span>
              {(uploadingError && existUploadError) ? (
                <div className='text-center space-y-1'>
                  
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Existing Product Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Subcategory</TableCell>
                          <TableCell>Super Subcategory</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {existingProductData && existingProductData.map(product => (
                          <TableRow key={product.id}>
                            <TableCell>{product.product_name}</TableCell>
                            <TableCell>{product.category.category_name}</TableCell>
                            <TableCell>{product.sub_category.sub_category_name || 'N/A'}</TableCell>
                            <TableCell>{product.super_sub_category.super_sub_category_name || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

              ) : (
                progressTaglines.map(item => (
                  uploadingProgress >= item.percentage && (
                    <div key={item.percentage}>
                      <span className='text-slate-400 text-[14px] font-[600]'>{item.tagline}</span>
                    </div>
                  )
                )).reverse().find(tagline => tagline)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BulkImport
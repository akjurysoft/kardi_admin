import { Autocomplete, Checkbox, Chip, FormControl, TextField } from '@mui/material'
import axios from '../../../axios';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import { useSnackbar } from '../SnackbarProvider';


const CustomEditor = dynamic(() => import('../custom-editor'), { ssr: false });


const ProductEdit = ({ editData, setEditData, setIsEditable, productBrandData, fetchProduct}) => {
    const { openSnackbar } = useSnackbar();
    console.log(editData, 'edit data')
   // console.log(fieldData, 'fieldData', 'selected product attributes', selectedProductAttribute)
    const [categoryData, setCategoryData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [superSubCategoryData, setSuperSubCategoryData] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedSuperSubCategory, setSelectedSuperSubCategory] = useState(null);

    const [brandId, setBrandId] = useState(null)
    const [brandData, setBrandData] = useState([])
    const [carModels, setCarModels] = useState([]);
    const [modelsId, setModelsId] = useState(null);
    const [carYears, setCarYears] = useState([]);
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');



    const [selectedAttribute, setSelectedAttribute] = useState([])
    const [selectedProductAttribute, setSelectedProductAttribute] = useState([]);
    const [fieldData, setFieldData] = useState([]);
    const [combination, setCombination] = useState({
        colors: [],
        heights: [],

    })



    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        if (editData.category_id) {
            setSelectedCategory(editData.category_id);
            fetchSubCategoryData(editData.category_id);
        }
    }, [editData.category_id]);

    useEffect(() => {
        if (editData.sub_category_id) {
            setSelectedSubCategory(editData.sub_category_id);
            fetchSuperSubCategoryData(editData.sub_category_id);
        }
    }, [editData.sub_category_id]);

    useEffect(() => {
        if (editData.super_sub_category_id) {
            setSelectedSuperSubCategory(editData.super_sub_category_id);
        }
    }, [editData.super_sub_category_id]);

    useEffect(() => {
        if(editData.product_type) {
            setBrandId(editData.car_brand_id)
            fetchBrandData()
           
        }
        if(editData.car_brand_id) {
            setModelsId(editData.car_model_id)

            fetchCarModelData(editData.car_brand_id)
        }
        if(editData.car_model_id) {
            setStartYear(editData.start_year);
            setEndYear(editData.end_year)
            fetchCarYears(editData.car_model_id)
        }
 
    },[editData.product_type, editData.car_brand_id, editData.car_model_id])

   

    useEffect(() => {
        if(editData.atributes) {
            setSelectedAttribute(() => [...editData.atributes])
        }
    },[editData.atributes])

 

   

    const fetchCategory = async () => {
        try {
            const response = await axios.get('/api/fetch-categories', {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            });
            setCategoryData(response.data.categories);

            fetchSubCategoryData(editData.category_id);
            fetchSuperSubCategoryData(editData.sub_category_id);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubCategoryData = useCallback(async (categoryId) => {
        try {
            const response = await axios.get(`/api/fetch-subcategories?category_id=${categoryId}`, {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            });
            setSubCategoryData(response.data.subcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    }, []);

    const fetchSuperSubCategoryData = useCallback(async (subCategoryId) => {
        try {
            const response = await axios.get(`/api/fetch-supersubcategories?sub_category_id=${subCategoryId}`, {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            });
            setSuperSubCategoryData(response.data.superSubcategories);
        } catch (error) {
            console.error('Error fetching super subcategories:', error);
        }
    }, []);


    const fetchBrandData = useCallback(
        () => {
          axios.get(`/api/fetch-car-brands`)
            .then((res) => {
              if (res.data.code == 200) {
                console.log(res.data.brandName, 'brandData')
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

      const fetchCarYears = useCallback((modelId) => {
        console.log('Fetching car years for model ID:', modelId);
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
        //const selectedBrandId = e.target.value;
        const {name, value} = e.target
        setBrandId(value)

        setModelsId(null)
        setCarYears([])
        
      };

      const handleModelChange = (e) => {
        const {name, value} = e.target
        setModelsId(value)
        setCarYears([])
      };

      useEffect(() => {
        if (modelsId) {
          fetchCarYears(modelsId);

        }
      }, [modelsId]);

      useEffect(() => {
        if (brandId) {
          fetchCarModelData(brandId)
        }
      }, [brandId]);

      useEffect(() => {
        if (startYear !== '' && endYear !== '' && parseInt(endYear) < parseInt(startYear)) {
          openSnackbar('End year must be greater than or equal to start year', 'error');
          setEndYear('');
        }
      }, [startYear, endYear]);



    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubCategory('');
        setSelectedSuperSubCategory('');
        fetchSubCategoryData(e.target.value);
    };

    const handleSubCategoryChange = (e) => {
        console.log(e.target.value, 'sub-category')
        setSelectedSubCategory(e.target.value);
        setSelectedSuperSubCategory('');
        fetchSuperSubCategoryData(e.target.value);
    };

   

    //-------------------------------------------- image section -----------------------------------------
    const [newImages, setNewImages] = useState([]);
    console.log(newImages)
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        const imageDataUrls = files.map((file) => URL.createObjectURL(file));

        setNewImages((prevImages) => [...prevImages, ...imageDataUrls]);
    };

    const handleImageRemove = (index) => {
        setEditData(prevData => {
            const updatedImages = prevData.images.filter((_, i) => i !== index);
            return { ...prevData, images: updatedImages };
        });
    };

    //--------------------------------------------- image section ends here -----------------------------------------

    const [getEditProductData, setGetEditProductData] = useState({
        product_name: '',
        product_desc: '',
        product_brand_id: '',
        category_id: '',
        sub_category_id: '',
        super_sub_category_id: '',
        minimum_order: '',
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

    const [editEditorData, setEditEditorData] = useState('');
    console.log(editEditorData)
    const handleEditEditorChange = (data) => {
        console.log('description-data', data)
        setEditEditorData(data);
    };

    useEffect(() => {
        setGetEditProductData({
            product_name: editData.product_name,
            product_desc: editData.product_desc,
            product_brand_id: editData.product_brand_id,
            category_id: '',
            sub_category_id: '',
            super_sub_category_id: '',
            minimum_order: editData.minimum_order,
            default_price: editData.default_price,
            stock: editData.stock,
            discount_type: editData.discount_type,
            discount: editData.discount,
            tax_type: editData.tax_type,
            tax_rate: editData.tax_rate,
            product_type: editData.product_type,
            car_brand_id: editData.car_brand_id,
            car_model_id: editData.car_model_id,
            has_exchange_policy: editData.has_exchange_policy,
            exchange_policy: editData.exchange_policy,
            has_cancellaton_policy: editData.has_cancellaton_policy,
            cancellation_policy: editData.cancellation_policy,
            quantity: editData.quantity,
            has_warranty: editData.has_warranty,
            weight: editData.weight,
            warranty: editData.warranty
        })
    },[])

    const getData = (e) => {
        const { value, name } = e.target;

        console.log(`Name-${name} - Value=${value}`)

        setGetEditProductData(() => {
            return {
                ...getEditProductData,
                [name]: value
            }
        })
       console.log({...getEditProductData})
    }

    const updateProduct = () => {
        const formData = new FormData();

        formData.append('product_id', editData.id)
        formData.append('product_name', getEditProductData.product_name ? getEditProductData.product_name : editData.product_name)
        if (editEditorData) {
            formData.append('product_desc', editEditorData)
        }
        console.log(editEditorData, 'proudct-desc---------')

        formData.append('product_brand_id', getEditProductData.product_brand_id ? getEditProductData.product_brand_id : editData.product_brand_id)

        console.log(getEditProductData.product_brand_id, 'product-brand-id')

        formData.append('category_id', selectedCategory ? selectedCategory : editData.category_id)
        if (selectedSubCategory) {
            formData.append('sub_category_id', selectedSubCategory ? selectedSubCategory : editData.sub_category_id)
        }
        console.log(selectedSubCategory, 'sub-cat------')
        if(newImages){
            formData.append('images', newImages)
        }
        if (selectedSuperSubCategory) {
            formData.append('super_sub_category_id', selectedSuperSubCategory ? selectedSuperSubCategory : editData.super_sub_category_id)
        }
        console.log(selectedSuperSubCategory, 'super-sub-cat-------')
        if (getEditProductData.minimum_order) {
            formData.append('minimum_order', getEditProductData.minimum_order ? getEditProductData.minimum_order : editData.minimum_order)

           
        }
        formData.append('default_price', getEditProductData.default_price ? getEditProductData.default_price : editData.default_price)

        formData.append('stock', getEditProductData.stock ? getEditProductData.stock : editData.stock)

        if (getEditProductData.discount_type && getEditProductData.discount) {
            formData.append('discount_type', getEditProductData.discount_type ? getEditProductData.discount_type : editData.discount_type)
            formData.append('discount', getEditProductData.discount ? getEditProductData.discount : editData.discount)
        }

        if (getEditProductData.tax_type && getEditProductData.tax_rate) {
            formData.append('tax_type', getEditProductData.tax_type ? getEditProductData.tax_type : editData.tax_type)
            formData.append('tax_rate', getEditProductData.tax_rate ? getEditProductData.tax_rate : editData.tax_rate)
        }
        console.log(getEditProductData.tax_type,getEditProductData.tax_rate,'tax-type-----')

        formData.append('product_type', getEditProductData.product_type ? getEditProductData.product_type : editData.product_type)
        
            formData.append('car_brand_id', brandId ? brandId : editData.car_brand_id)
            formData.append('car_model_id', modelsId ? modelsId : editData.car_model_id)
            formData.append('start_year', startYear ? startYear : editData.car_model_id)
            formData.append('end_year', endYear ? endYear : editData.car_model_id)
        

        formData.append('exchange_policy', getEditProductData.exchange_policy ? getEditProductData.exchange_policy : editData.exchange_policy)

        console.log(getEditProductData.exchange_policy,'exchange-policy-----')

        formData.append('cancellation_policy', getEditProductData.cancellation_policy ? getEditProductData.cancellation_policy : editData.cancellation_policy)

        console.log(getEditProductData.cancellation_policy, 'cancel-policy-----')
        
        if (getEditProductData.quantity) {
            formData.append('quantity', getEditProductData.quantity ? getEditProductData.quantity : editData.quantity)
        }
        formData.append('warranty', getEditProductData.warranty ? getEditProductData.warranty : editData.warranty)
        formData.append('weight', getEditProductData.weight ? getEditProductData.weight : editData.weight)

        console.log(getEditProductData.warranty, 'warranty')

       console.log('sending form data', formData)

        axios.post('/api/edit-product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                //console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    setIsEditable(false)
                    fetchProduct();
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    const handleBack = () => {
        setEditData({})
        setIsEditable(false)
    }

    return (
        <>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Edit Product</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Introduce new items effortlessly with the Add New Product feature in the admin application for a dynamic and up-to-date online store.</span>
                </div>
            </div>

            <div className='flex items-center justify-between gap-[30px]'>
                <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                    <span className='text-[18px] font-[600]'>Edit Product</span>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Product Name</span>
                        <input type='text' className='outline-none focus-none inputText !text-[14px]' value={getEditProductData.product_name} placeholder='Add new product name' name='product_name' onChange={getData} />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                        <CustomEditor initialData={editData.product_desc} name='product_desc' onChange={handleEditEditorChange} />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'> Product Brand Name</span>
                        <select className='!text-[14px]' name='product_brand_id' value={getEditProductData.product_brand_id} onChange={getData}>
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
                        <select className='!text-[14px]' id='edit_category_id' name='edit_category_id' value={selectedCategory} onChange={handleCategoryChange}>
                            <option value=''>Choose Category</option>
                            {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.category_name}</option>
                            )}
                        </select>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
                        <select className='!text-[14px]' id='edit_sub_category_id' name='edit_sub_category_id' value={selectedSubCategory} onChange={handleSubCategoryChange}>
                            {/* <option value=''>Choose Sub Category</option> */}
                            {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.sub_category_name}</option>
                            )}
                        </select>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
                        <select className='!text-[14px]' id='edit_super_sub_category_id' name='super_sub_category_id' value={selectedSuperSubCategory} onChange={(e) => setSelectedSuperSubCategory(e.target.value)} >
                            <option value=''>Choose Super Sub Category</option>
                            {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                            )}
                        </select>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Maximum Order Quantity</span>
                        <input type='text' className='outline-none focus-none inputText !text-[14px]' value={getEditProductData.minimum_order} placeholder='Ex: 05' name='minimum_order' onChange={getData} />
                        {/* <input className='text-[14px] text-[#344054] font-[500]' value={editData.minimum_order}/> */}
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Product Weight  <span className='text-red-500 font-[400] text-[12px]'>(1.5kg = 1.5 & 1kg = 1 & 500gm = 0.5)</span> in this format</span>
                        <input type='text' className='outline-none focus-none inputText !text-[14px]' value={getEditProductData.weight} placeholder='Ex: 05' name='weight' onChange={getData} />
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
                                className="text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                                onClick={() => fileInputRef.current.click()}
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
                            {/* Render existing images */}
                            {editData.images.map((imageDataUrl, index) => (
                                <div key={index} className="p-2 relative">
                                    <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${imageDataUrl.image_url}`} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                                    <button
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        <FaTimes className='text-[10px]' />
                                    </button>
                                </div>
                            ))}
                            {/* Render newly added images */}
                            {newImages.map((imageDataUrl, index) => (
                                <div key={index} className="p-2 relative">
                                    <img src={imageDataUrl} alt={`Newly Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                                    <button
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        onClick={() => setNewImages((prevImages) => prevImages.filter((_, i) => i !== index))}
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
                            <span className='text-[14px] text-[#344054] font-[500]'>Default Unit Price</span>
                            <input type='text' className='outline-none focus-none inputText !text-[14px]' value={getEditProductData.default_price} placeholder='Price of product (in rupees)' name='default_price' onChange={getData} />
                        </div>
                        <div className='flex flex-col space-y-1 w-full'>
                            <span className='text-[14px] text-[#344054] font-[500]'>Product Stock</span>
                            <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='stock' value={getEditProductData.stock} name='stock' onChange={getData} />
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-[10px]'>
                        <div className='flex flex-col space-y-1 w-full'>
                            <span className='text-[14px] text-[#344054] font-[500]'>Discount Type</span>
                            <select className='!text-[14px] outline-none focus-none' name='discount_type' value={getEditProductData.discount_type} onChange={getData}>
                                <option value='0'>Select Discount Type</option>
                                <option value='percent'>Percent</option>
                                <option value='amount'>Amount</option>
                            </select>
                        </div>
                        <div className='flex flex-col space-y-1 w-full'>
                            <span className='text-[14px] text-[#344054] font-[500]'>Discount</span>
                            <input type='text' className='outline-none focus-none inputText !text-[14px]' value={getEditProductData.discount} placeholder='0' name='discount' onChange={getData} />
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-[10px]'>
                        <div className='flex flex-col space-y-1 w-full'>
                            <span className='text-[14px] text-[#344054] font-[500]'>Tax Type</span>
                            {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
                            <select className='!text-[14px] outline-none focus-none' name='tax_type' value={getEditProductData.tax_type} onChange={getData}>
                                <option value='0'>Select Tax Type</option>
                                <option value='percent'>Percent</option>
                                {/* <option value='amount'>Amount</option> */}
                            </select>
                        </div>
                        <div className='flex flex-col space-y-1 w-full'>
                            <span className='text-[14px] text-[#344054] font-[500]'>Tax rate</span>
                            <input type='text' className='outline-none focus-none inputText !text-[14px]'  placeholder='0' value={getEditProductData.tax_rate} onChange={getData} name='tax_rate' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
                <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                    {/* Not working-------------- */}
                    <span className='text-[18px] font-[600]'>Product Brand Info</span>
                    <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Product Type</span>
                        <select className='!text-[14px] outline-none focus-none' value={getEditProductData.product_type} name='product_type' onChange={getData}>
                            <option>Select Product Type</option>
                            <option value='vehicle selection'>Vehicle Selection</option>
                            <option value='general'>General</option>
                        </select>
                        {getEditProductData.product_type === 'vehicle selection' &&(
                        <div className={`flex flex-col space-y-1 w-full`}>
                            <div className='flex items-end gap-[10px]'>
                                <div className='flex flex-col space-y-1 w-full'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Car Brand</span>
                                    <select onChange={handleBrandChange} value={brandId} className='!text-[14px] outline-none focus-none w-[100%]' >
                                        <option  >Select Brand Here</option>
                                        {brandData && brandData.map((e, i) =>
                                            <option key={`${i}`} value={e.id}>{e.brand_name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className='flex items-end gap-[10px]'>
                                <div className='flex flex-col space-y-1 w-full'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Car Model</span>
                                    <select onChange={handleModelChange}  value={modelsId} className='!text-[14px] outline-none focus-none w-[100%]' >
                                        <option >Select Car Model Here</option>
                                        {carModels && carModels.filter(e => e.status).map((e, i) =>
                                            <option key={i} value={e.id}>{e.model_name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className='flex items-end gap-[10px]'>
                                <div className='flex flex-col space-y-1 w-full'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Start Year</span>
                                    <select onChange={(e) => setStartYear(() => e.target.value)} value={startYear} className='text-[14px]' >
                                        <option >Choose Start Year</option>
                                        {carYears && carYears.map((e, i) =>
                                            <option key={i} value={e}>{e}</option>
                                        )}
                                    </select>
                                </div>
                                <div className='flex flex-col space-y-1 w-full'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>End Year</span>
                                    <select  onChange={(e) => setEndYear(() => e.target.value)} value={endYear} className='text-[14px]'>
                                        <option >Choose End Year</option>
                                        {carYears && carYears.map((e, i) =>
                                            <option key={i} value={e}>{e}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                    <span className='text-[18px] font-[600]'>Exchange Policy</span>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                        <textarea name='exchange_policy' className='outline-none focus-none inputText !text-[14px] h-[190px]'  value={getEditProductData.exchange_policy} placeholder='Add description' onChange={getData} />
                    </div>
                </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
                <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                    <span className='text-[18px] font-[600]'>Net Quantity and warranty info</span>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Net Quantity</span>
                        <input type='text' className='outline-none focus-none inputText !text-[14px]'  value={getEditProductData.quantity} placeholder='06' name='quantity' onChange={getData} />
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Warranty</span>
                        <input type='text' name='warranty' className='outline-none focus-none inputText !text-[14px]'  placeholder='06' value={getEditProductData.warranty} onChange={getData} />
                    </div>
                </div>
                <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                    <span className='text-[18px] font-[600]'>Cancellation Policy</span>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                        <textarea name='cancellation_policy' className='outline-none focus-none inputText !text-[14px] h-[190px]'  value={getEditProductData.cancellation_policy} placeholder='Add description' onChange={getData} />
                    </div>
                </div>
            </div>

            {/* <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
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
                </div>
            </div> */}
            
            {/* <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
              <span className='text-[18px] font-[600]'>Attribute</span>
              <div className='flex flex-col space-y-3 w-full'>
                <span className='text-[14px] text-[#344054] font-[500]'>Attribute</span>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple

                    options={selectedAttribute}
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
                {selectedAttribute && Array.isArray(selectedAttribute) && selectedAttribute.map((attribute, attributeIndex) => (
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
              </div>
            </div> */}


            <div className='flex items-center gap-[30px] justify-end'>
                <span className='px-[38px] py-[10px] rounded-[8px] border border-[#D0D5DD] text-[16px] text-[#344054] font-[600] cursor-pointer' onClick={handleBack}>Back to product list</span>
                <span className='px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer' onClick={updateProduct}>Update Product</span>
            </div>
        </>
    )
}

export default ProductEdit

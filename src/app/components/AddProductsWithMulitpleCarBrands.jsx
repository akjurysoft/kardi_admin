import { Button, Step, StepLabel, Stepper } from '@mui/material';
import axios from '../../../axios';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'

const CustomEditor = dynamic(() => import('../custom-editor'), { ssr: false });
const AddProductsWithMulitpleCarBrands = () => {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = ['Add New Product', 'Select Multiple Car Makes & Models'];

    // product type section
    const [productType, setProductType] = useState('');

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
        console.log(selectedBrandId)
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



    const getPageContent = (step) => {
        switch (step) {
            case 0:
                return (
                    // First page content
                    <div className='py-[10px]'>
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
                                    <select className='!text-[14px]' name='product_brand_id'>
                                        <option >Choose Product Brand</option>
                                        {/* {productBrandData && productBrandData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.brand_name}</option>
                            )} */}
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-col border space-y-3 border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                                <span className='text-[18px] font-[600]'>Category</span>
                                <div className='flex flex-col space-y-1'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Select Main Category</span>
                                    <select className='!text-[14px]' name='category_id'>
                                        <option value="0">Choose Category</option>
                                        {/* {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.category_name}</option>
                            )} */}
                                    </select>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
                                    <select className='!text-[14px]' name='sub_category_id' >
                                        <option>Choose Sub Category</option>
                                        {/* {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.sub_category_name}</option>
                            )} */}
                                    </select>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
                                    <select className='!text-[14px]' name='super_sub_category_id' >
                                        <option>Choose Super Sub Category</option>
                                        {/* {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                                <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                            )} */}
                                    </select>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Maximum Order Quantity</span>
                                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Ex: 05' name='minimum_order' onChange={getData} />
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
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                                <span className='text-[18px] font-[600]'>Cancellation Policy</span>
                                <div className='flex flex-col space-y-1'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                                    <textarea className='outline-none focus-none inputText !text-[14px] h-[190px]' name='cancellation_policy' placeholder='Add description' onChange={getData} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    // Second page content
                    <>
                        <div className=' py-[10px] flex flex-col space-y-5'>
                            <div className='flex flex-col space-y-1'>
                                <span className='text-[30px] text-[#101828] font-[500]'>Select Multiple Car Makes & Models</span>
                                <span className='text-[#667085] font-[400] text-[16px]'>Select multiple car makes and models to add them to the product.</span>
                            </div>


                            <div className="flex flex-col space-y-2">
                                {brandData && brandData.map((brand) => (
                                    <label key={brand.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={brand.id}
                                            onChange={handleBrandChange}
                                            defaultChecked={selectedBrand === brand.id}
                                        />
                                        <span className="ml-2">{brand.brand_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* <div className='flex flex-col space-y-3  rounded-[16px] p-[16px] w-[100%]'>
                                <span className='text-[18px] font-[600]'>Product Brand Info</span>
                                <div className='flex flex-col space-y-1 w-full'>
                                    <span className='text-[14px] text-[#344054] font-[500]'>Product Type</span>
                                    <select className='!text-[14px] outline-none focus-none'
                                        value={productType}
                                        onChange={(e) => setProductType(e.target.value)}
                                    >
                                        <option value=''>Select Product Type</option>
                                        <option value='vehicle selection'>Vehicle Selection</option>
                                        <option value='general'>General</option>
                                    </select>

                                    {productType === 'vehicle selection' && (
                                        <div>
                                            vehicle selection
                                        </div>
                                    )}
                                </div>
                            </div> */}
                    </>
                );
            default:
                return null;
        }
    };

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
    console.log(images)
    console.log(uploadedImages)

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
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

    const handleImageRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newUploadedImages);
    };


    return (
        <>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {getPageContent(activeStep)}
                <div className='flex items-center gap-[30px] justify-end py-[20px]'>
                    <Button disabled={activeStep === 0} onClick={handleBack} className='px-[38px] py-[10px] rounded-[8px] border border-[#D0D5DD] text-[16px] text-[#344054] font-[600] cursor-pointer'>Back</Button>
                    {activeStep === steps.length - 1 ? (
                        <Button className='px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] !hover:opacity-80 cursor-pointer' variant="contained" color="primary" onClick={handleNext}>Finish</Button>
                    ) : (
                        <Button className='px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] !hover:opacity-80 cursor-pointer' variant="contained" color="primary" onClick={handleNext}>Next</Button>
                    )}
                </div>
            </div>
        </>
    )
}

export default AddProductsWithMulitpleCarBrands

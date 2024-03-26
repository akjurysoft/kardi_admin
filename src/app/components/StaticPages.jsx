import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import axios from '../../../axios';
// import CustomEditor from '../custom-editor';
import { useSnackbar } from '../SnackbarProvider';
import { Switch } from '@mui/material';

const CustomEditor = dynamic(() => import('../custom-editor'), { ssr: false });


const StaticPages = () => {
    const { openSnackbar } = useSnackbar();
    const tabNames = ["About Us", "Contact Us", "Privacy Policy", "Cancellation Policy", "Refund Policy", "Return Policy", "Shipping Policy"];
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
        setImage(null)
        setShowImage(null)
        if (index === 0) {
            setEditorData(staticData.about_us);
        } else if (index === 1) {
            setEditorData(staticData.contact_us);
        } else if (index === 2) {
            setEditorData(staticData.privacy_policy);
        } else if (index === 3) {
            setEditorData(staticData.cancellation_policy);
        } else if (index === 4) {
            setEditorData(staticData.refund_policy);
        } else if (index === 5) {
            setEditorData(staticData.return_policy);
        } else if (index === 6) {
            setEditorData(staticData.shipping_policy);
        }
    };

    // ----------------------------------------------Fetch Static Data section Starts-----------------------------------------------------
    const [staticData, setStaticData] = useState({})

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchStaticData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchStaticData = useCallback(
        () => {
            axios.get('/api/fetch-static-data')
                .then((res) => {
                    if (res.data.status === 'success') {
                        setStaticData(res.data.data)
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )


    // ----------------------------------------------Fetch Static Data section Ends-----------------------------------------------------


    const handleSwitchChange = (type) => {
        axios.post(`/api/update-static-status?static_type=${type}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        }).then(res => {
            if (res.data.status === 'success') {
                openSnackbar(res.data.message, 'success');
                fetchStaticData()
            }
        })
            .catch(err => {
                console.log(err)
            })
    };

    // Image upload function
    const [image, setImage] = useState(null);
    const [showImage, setShowImage] = useState(null)

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

    const handleButtonClick = () => {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        setShowImage(null)
    };

    const [editorData, setEditorData] = useState('');
    const handleEditorChange = (data) => {
        setEditorData(data);
    };


    const handleAddAboutus = () => {
        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('about_us', editorData);
        axios.post('/api/add-aboutus', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                    setImage(null)
                    setShowImage(null)
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleAddContactus = () => {
        axios.post('/api/add-contact-us', {
            contact_us: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleAddPrivacy = () => {
        axios.post('/api/add-privacy-policy', {
            privacy_policy: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleAddCancellation = () => {
        axios.post('/api/add-cancellation-policy', {
            cancellation_policy: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleRefund = () => {
        axios.post('/api/add-refund-policy', {
            refund_policy: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleReturn = () => {
        axios.post('/api/add-return-policy', {
            return_policy: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleShipping = () => {
        axios.post('/api/add-shipping-policy', {
            shipping_policy: editorData
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStaticData()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='px-[20px] space-y-3 container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Static pages</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                </div>
            </div>

            <div className="flex">
                {tabNames.map((tabName, index) => (
                    <button
                        key={index}
                        style={{ whiteSpace: 'nowrap' }}
                        className={`px-[30px] py-[8px] w-full tab-btn text-[14px]  border-r-2 border-[#CFAA4C] font-[500] ${activeTab === index ? 'active bg-[#CFAA4C] text-[#fff]' : 'bg-[#FCF8EE]'}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tabName}
                    </button>
                ))}
            </div>
            <div className="tab-content py-3">
                {tabNames.map((tabName, index) => (
                    <div key={index} className={`tab-pane ${activeTab === index ? 'active' : 'hidden'}`}>
                        {activeTab === index && (
                            <>
                                {tabName === "About Us" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.about_status === 1}
                                                onChange={() => handleSwitchChange('ABOUT')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.about_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.about_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
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
                                                    id="file-input"
                                                    accept='image/*'
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center mt-3">
                                                {staticData.image_url && (
                                                    <div key={index} className="p-2 relative">
                                                        <img src={showImage ? showImage : `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${staticData.image_url}`} alt={`Uploaded ${index + 1}`} className="max-w-[200px] max-h-[200px]" />
                                                        {showImage && (
                                                            <button
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                                onClick={handleRemoveImage}
                                                            >
                                                                <FaTimes className='text-[10px]' />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <CustomEditor initialData={staticData.about_us} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleAddAboutus}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Contact Us" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.contact_status === 1}
                                                onChange={() => handleSwitchChange('CONTACT')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.contact_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.contact_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.contact_us} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleAddContactus}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Privacy Policy" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.privacy_status === 1}
                                                onChange={() => handleSwitchChange('PRIVACY')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.privacy_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.privacy_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.privacy_policy} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleAddPrivacy}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Cancellation Policy" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.cancellation_status === 1}
                                                onChange={() => handleSwitchChange('CANCELLATION')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.cancellation_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.cancellation_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.cancellation_policy} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleAddCancellation}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Refund Policy" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.refund_status === 1}
                                                onChange={() => handleSwitchChange('REFUND')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.refund_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.refund_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.refund_policy} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleRefund}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Return Policy" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.return_status === 1}
                                                onChange={() => handleSwitchChange('RETURN')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.return_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.return_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.return_policy} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleReturn}>Submit</span>
                                        </div>
                                    </div>
                                )}

                                {tabName === "Shipping Policy" && (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex justify-end'>
                                            <Switch
                                                checked={staticData.shipping_status === 1}
                                                onChange={() => handleSwitchChange('SHIPPING')}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: staticData.shipping_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                    '& .MuiSwitch-thumb': {
                                                        backgroundColor: staticData.shipping_status === 1 ? '#CFAA4C' : '',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <CustomEditor initialData={staticData.shipping_policy} onChange={handleEditorChange} />

                                        <div className='flex items-center gap-[24px] justify-end'>
                                            <span className='resetButton'>Reset</span>
                                            <span className='submitButton' onClick={handleShipping}>Submit</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StaticPages
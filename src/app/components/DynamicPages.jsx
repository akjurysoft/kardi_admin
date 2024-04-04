import React, { useCallback, useEffect, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, Switch, Rating, MenuItem, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions, DialogTitle } from '@mui/material';
import { FiPrinter } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import axios from '../../../axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../SnackbarProvider';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles';
import DescriptionCell from './DescriptionCell';
import { IoSearch } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { FaRegEdit } from "react-icons/fa";
import { getAllCustomerData, getAllStoreData, getAllTestimonialsData } from '../api';
import { format } from 'date-fns';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const DynamicPages = () => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter()

    const tabNames = ["Testimonials", "Store info"];
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchCustomerData()
            fetchStoreData()
            fetchTestimonailsData()
        }

        return () => { unmounted = true };
    }, [])

    // --------------------------------Store Info Starts------------------------------------

    const [getStoreData, setGetStoreData] = useState([])
    const [getEmail1, setGetEmail1] = useState({})
    const [getEmail2, setGetEmail2] = useState({})
    const [getNumber1, setGetNumber1] = useState({})
    const [getNumber2, setGetNumber2] = useState({})
    const [getWhatsapp1, setGetWhatsapp1] = useState({})
    const [getWhatsapp2, setGetWhatsapp2] = useState({})
    const [getAddress1, setGetAddress1] = useState({})
    const [getAddress2, setGetAddress2] = useState({})
    const [getLinkedin, setGetLinkedin] = useState({})
    const [getInstagram, setGetInstagram] = useState({})
    const [getFacebook, setGetFacebook] = useState({})
    const [getTwitter, setGetTwitter] = useState({})
    const [getWebsite, setGetWebsite] = useState({})
    const [getYoutube, setGetYoutube] = useState({})
    const [getAmazon, setGetAmazon] = useState({})
    const [getGpay, setGetGpay] = useState({})
    const [getMasterCard, setGetMasterCard] = useState({})
    const [getVisa, setGetVisa] = useState({})
    const [getPhonePe, setGetPhonePe] = useState({})

    const fetchStoreData = async () => {
        try {
            const storeData = await getAllStoreData();
            setGetStoreData(storeData.storeInfo);
            setGetEmail1(storeData.storeInfo.find(item => item.contact_name === 'email_1'))
            setGetEmail2(storeData.storeInfo.find(item => item.contact_name === 'email_2'))
            setGetNumber1(storeData.storeInfo.find(item => item.contact_name === 'number_1'))
            setGetNumber2(storeData.storeInfo.find(item => item.contact_name === 'number_2'))
            setGetWhatsapp1(storeData.storeInfo.find(item => item.contact_name === 'whatsapp_1'))
            setGetWhatsapp2(storeData.storeInfo.find(item => item.contact_name === 'whatsapp_2'))
            setGetAddress1(storeData.storeInfo.find(item => item.contact_name === 'address_1'))
            setGetAddress2(storeData.storeInfo.find(item => item.contact_name === 'address_2'))
            setGetLinkedin(storeData.storeInfo.find(item => item.contact_name === 'linkedin'))
            setGetInstagram(storeData.storeInfo.find(item => item.contact_name === 'instagram'))
            setGetFacebook(storeData.storeInfo.find(item => item.contact_name === 'facebook'))
            setGetTwitter(storeData.storeInfo.find(item => item.contact_name === 'twitter'))
            setGetWebsite(storeData.storeInfo.find(item => item.contact_name === 'website'))
            setGetYoutube(storeData.storeInfo.find(item => item.contact_name === 'youtube'))
            setGetAmazon(storeData.storeInfo.find(item => item.contact_name === 'Amazonpay'))
            setGetGpay(storeData.storeInfo.find(item => item.contact_name === 'Gpay'))
            setGetMasterCard(storeData.storeInfo.find(item => item.contact_name === 'MasterCard'))
            setGetVisa(storeData.storeInfo.find(item => item.contact_name === 'VISA'))
            setGetPhonePe(storeData.storeInfo.find(item => item.contact_name === 'Phonepe'))
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const [getStoreInfoDetails, setGetStoreInfoDetails] = useState({
        email_1: '',
        email_2: '',
        number_1: '',
        number_2: '',
        whatsapp_1: '',
        whatsapp_2: '',
        address_1: '',
        address_2: '',
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
        website: '',
        youtube: ''
    })

    const getData = (e) => {
        const { value, name } = e.target;

        setGetStoreInfoDetails(() => {
            return {
                ...getStoreInfoDetails,
                [name]: value
            }
        })
    }

    const handleAddStoreData = () => {
        axios.post('/api/add-store-info-admin', {
            email_1: getStoreInfoDetails.email_1 || getEmail1.value,
            email_2: getStoreInfoDetails.email_2 || getEmail2.value,
            number_1: getStoreInfoDetails.number_1 || getNumber1.value,
            number_2: getStoreInfoDetails.number_2 || getNumber2.value,
            whatsapp_1: getStoreInfoDetails.whatsapp_1 || getWhatsapp1.value,
            whatsapp_2: getStoreInfoDetails.whatsapp_2 || getWhatsapp2.value,
            address_1: getStoreInfoDetails.address_1 || getAddress1.value,
            address_2: getStoreInfoDetails.address_2 || getAddress2.value,
            linkedin: getStoreInfoDetails.linkedin || getLinkedin.value,
            instagram: getStoreInfoDetails.instagram || getInstagram.value,
            facebook: getStoreInfoDetails.facebook || getFacebook.value,
            twitter: getStoreInfoDetails.twitter || getTwitter.value,
            website: getStoreInfoDetails.website || getWebsite.value,
            youtube: getStoreInfoDetails.youtube || getYoutube.value
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStoreData()
                    handleBack()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    const [editMode, setEditMode] = useState(false);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleBack = () => {
        setEditMode(false)
        setGetStoreInfoDetails({})
    }


    const handleSwitchChange = (type) => {
        Swal.fire({
            title: "Update",
            text: `Do you want to Update the status of ${type}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Update it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/toggle-status-store-info-admin?store_data_type=${type}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            openSnackbar(res.data.message, 'success');
                            fetchStoreData()
                        } else {
                            openSnackbar(res.data.message, 'error');
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        });
    };

    // -----------------------Store Info Ends ---------------------------------------------


    const [rating, setRating] = useState(0);

    const handleRatingChange = (event, newRating) => {
        setRating(newRating);
    };

    const [getTestimonailsData, setGetTestimonailsData] = useState([])
    const fetchTestimonailsData = async () => {
        try {
            const testimonialsData = await getAllTestimonialsData();
            setGetTestimonailsData(testimonialsData.testimonials);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    // ------------pagination-----------------
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = getTestimonailsData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = getTestimonailsData.filter((e) =>
        e.heading.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    // ------------pagination-----------------

    const [getCustomerData, setGetCustomerData] = useState([])
    const fetchCustomerData = async () => {
        try {
            const customerData = await getAllCustomerData();
            setGetCustomerData(customerData.customers);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const [selectedCustomer, setSelectedCustomer] = useState({});
    const handleCustomerChange = (event) => {
        const customerId = parseInt(event.target.value, 10);
        if (getCustomerData.length > 0) {
            const selectedCustomerdata = getCustomerData.find(customer => customer.id === customerId);

            if (selectedCustomerdata) {
                setSelectedCustomer(selectedCustomerdata);
            } else {
                setSelectedCustomer({})
                openSnackbar(`Customer with id ${customerId} not found`, 'error');
            }
        } else {
            console.log('getCustomerData is empty or not loaded yet');
        }
    };

    const [getAddTestimonialsData, setGetAddTestimonialsData] = useState({
        heading: '',
        description: ''
    })
    const getDataTestimonials = (e) => {
        const { value, name } = e.target
        setGetAddTestimonialsData(() => {
            return {
                ...getAddTestimonialsData,
                [name]: value
            }
        })

    }

    const resetTestimonials = () => {
        setGetAddTestimonialsData({
            heading: '',
            description: ''
        })
        setRating(0)
        setSelectedCustomer({})
    }

    const handleAddTestimonials = () => {
        if (getAddTestimonialsData.heading === "") {
            openSnackbar('Please Fill the heading', 'error')
            return;
        }
        if (getAddTestimonialsData.description === "") {
            openSnackbar('Please Fill the Description', 'error')
            return;
        }
        if (rating == 0 || rating == null) {
            openSnackbar('Rating Atleast have 1 or more', 'error')
            return;
        }
        axios.post('/api/add-testimonial-admin', {
            customer_id: selectedCustomer.id,
            rating: rating,
            heading: getAddTestimonialsData.heading,
            description: getAddTestimonialsData.description
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success')
                    fetchTestimonailsData()
                    handleClose()
                } else {
                    openSnackbar(res.data.message, 'error')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // -----------------Add Testimonial dialog open------------------------------
    const [open, setOpen] = useState(false);

    const handleOpen = (data) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetTestimonials()
    };

    // ----------------------image stories----------------------------------









    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange1 = (data) => {
        axios.post(`/api/update-testimonial-status?testimonial_id=${data.id}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchTestimonailsData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------

    // ----------------------------------------------Delete Testimonial section Starts-----------------------------------------------------
    const deleteTestimony = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.heading}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-testimonial?testimonial_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            fetchTestimonailsData()
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

    // ----------------------------------------------Delete Testimonial section Ends-----------------------------------------------------




    return (
        <div className='px-[20px] space-y-5 container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                {activeTab == 0 && (
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>Testimonials</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                    </div>
                )}
                {activeTab == 1 && (
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>Store Info</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                    </div>
                )}
            </div>

            <div className="flex">
                {tabNames.map((tabName, index) => (
                    <button
                        key={index}
                        style={{ whiteSpace: 'nowrap' }}
                        className={`px-[30px] py-[8px] w-full tab-btn text-[14px]  border-r-2 border-l-2 border-[#CFAA4C] font-[500] ${activeTab === index ? 'active bg-[#CFAA4C] text-[#fff]' : 'bg-[#FCF8EE]'}`}
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
                                {tabName === "Testimonials" && (
                                    <>
                                        <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex space-x-2 items-center'>
                                                    <span className='text-[18px] font-[500] text-[#101828]'>All Testimonial</span>
                                                    <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{getTestimonailsData.length} Testimonials</span>
                                                </div>
                                                <div className='flex items-center space-x-3 inputText  w-[50%]'>
                                                    <IoSearch className='text-[20px]' />
                                                    <input
                                                        type='text'
                                                        className='outline-none focus-none w-full !text-[14px]'
                                                        placeholder='Search By Name here'
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleOpen}>
                                                    <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                                                    <span className=' text-[16px] text-[#fff] font-[600]' >Add New Testimonial</span>
                                                </div>
                                            </div>
                                            <Paper >
                                                <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow className='!bg-[#F9FAFB]'>
                                                                {/* Define your table header columns */}
                                                                <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                                                                <TableCell style={{ minWidth: 200 }}>Customer Name</TableCell>
                                                                <TableCell style={{ minWidth: 150 }}>Customer Info</TableCell>
                                                                <TableCell style={{ minWidth: 150 }}>Created Date</TableCell>
                                                                <TableCell style={{ minWidth: 200 }}>Ratings</TableCell>
                                                                <TableCell style={{ minWidth: 250 }}>Heading</TableCell>
                                                                <TableCell style={{ minWidth: 400 }}>Testimonial Description</TableCell>
                                                                <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                                <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                                <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                                <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {filteredRows.length > 0 ?
                                                            <TableBody>
                                                                {paginatedRows.map((row, i) => (
                                                                    <TableRow key={i} >
                                                                        <TableCell>{i + 1}</TableCell>
                                                                        <TableCell>
                                                                            {row.customer ? row.customer.fullname || 'N/A' : 'N/A'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                                <span className='text-[14px] font-[400]'>{row.customer ? row.customer.phone || 'N/A' : 'N/A'}</span>
                                                                                <span className='text-[14px] font-[400]'>{row.customer ? row.customer.email || 'N/A' : 'N/A'}</span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {format(new Date(row.createdAt), "do MMM yyyy")}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Rating name="read-only" precision={0.5} value={row.rating} readOnly />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {row.heading}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {row.description}
                                                                        </TableCell>
                                                                        <TableCell>
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
                                                                                checked={row.status}
                                                                                onChange={() => handleSwitchChange1(row)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                sx={{
                                                                                    '& .MuiSwitch-thumb': {
                                                                                        backgroundColor: row.status ? '#CFAA4C' : '',
                                                                                    },
                                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                                        backgroundColor: '#CFAA4C',
                                                                                    },
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteTestimony(row)} /></TableCell>
                                                                        <TableCell><FaRegEdit className='text-[20px] cursor-pointer text-slate-500' /></TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                            :
                                                            <TableRow>
                                                                <TableCell colSpan={7} align="center" className='text-center text-[15px] font-[600]'>No Stories Found</TableCell>
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

                                {tabName === "Store info" && (
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col space-y-2 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                            <span className='text-[18px] font-[600]'>Contact Information</span>

                                            <div className='grid grid-cols-2 gap-2'>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Email 1</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getEmail1.status == 1}
                                                                onChange={() => handleSwitchChange('email_1')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getEmail1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getEmail1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getEmail1.value} disabled={editMode ? false : true} className='inputText' name='email_1' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Email 2</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getEmail2.status == 1}
                                                                onChange={() => handleSwitchChange('email_2')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getEmail2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getEmail2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getEmail2.value} disabled={editMode ? false : true} className='inputText' name='email_2' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Contact Phone Number 1</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getNumber1.status == 1}
                                                                onChange={() => handleSwitchChange('number_1')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getNumber1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getNumber1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getNumber1.value} disabled={editMode ? false : true} className='inputText' name='number_1' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Contact Phone Number 2</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getNumber2.status == 1}
                                                                onChange={() => handleSwitchChange('number_2')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getNumber2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getNumber2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getNumber2.value} disabled={editMode ? false : true} className='inputText' name='number_2' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Whatsapp Number 1</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getWhatsapp1.status == 1}
                                                                onChange={() => handleSwitchChange('whatsapp_1')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getWhatsapp1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getWhatsapp1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getWhatsapp1.value} disabled={editMode ? false : true} className='inputText' name='whatsapp_1' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Whatsapp Number 2</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getWhatsapp2.status == 1}
                                                                onChange={() => handleSwitchChange('whatsapp_2')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getWhatsapp2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getWhatsapp2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <input type='text' defaultValue={getWhatsapp2.value} disabled={editMode ? false : true} className='inputText' name='whatsapp_2' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Address 1</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getAddress1.status == 1}
                                                                onChange={() => handleSwitchChange('address_1')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getAddress1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getAddress1.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <textarea type='text' defaultValue={getAddress1.value} disabled={editMode ? false : true} className='inputText' name='address_1' onChange={getData} />
                                                </div>
                                                <div className='flex flex-col space-y-1'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className=' font-[600] text-[16px]'>Address 2</span>
                                                        {editMode && (
                                                            <Switch
                                                                checked={getAddress2.status == 1}
                                                                onChange={() => handleSwitchChange('address_2')}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                sx={{
                                                                    '& .Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: getAddress2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                    '& .MuiSwitch-thumb': {
                                                                        backgroundColor: getAddress2.status == 1 ? '#CFAA4C' : '',
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <textarea type='text' defaultValue={getAddress2.value} disabled={editMode ? false : true} className='inputText' name='address_2' onChange={getData} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                            <span className='text-[18px] font-[600]'>Social media information</span>

                                            <div className='flex flex-col space-y-2'>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/linkedin.svg' alt='Linkedin' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Linkedin</span>
                                                    <input type='text' defaultValue={getLinkedin.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]' name='linkedin' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getLinkedin.status == 1}
                                                            onChange={() => handleSwitchChange('linkedin')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getLinkedin.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getLinkedin.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/instagram.svg' alt='instagram' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Instagram</span>
                                                    <input type='text' defaultValue={getInstagram.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]' name='instagram' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getInstagram.status == 1}
                                                            onChange={() => handleSwitchChange('instagram')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getInstagram.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getInstagram.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/facebook.svg' alt='facebook' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Facebook</span>
                                                    <input type='text' defaultValue={getFacebook.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]' name='facebook' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getFacebook.status == 1}
                                                            onChange={() => handleSwitchChange('facebook')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getFacebook.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getFacebook.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/twitter.svg' alt='twitter' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Twitter</span>
                                                    <input type='text' defaultValue={getTwitter.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]onChange={getData}' name='twitter' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getTwitter.status == 1}
                                                            onChange={() => handleSwitchChange('twitter')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getTwitter.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getTwitter.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/website.svg' alt='website' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Website</span>
                                                    <input type='text' defaultValue={getWebsite.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]' name='website' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getWebsite.status == 1}
                                                            onChange={() => handleSwitchChange('website')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getWebsite.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getWebsite.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-3 justify-between'>
                                                    <Image src='/images/youtube.svg' alt='Youtube' height={50} width={50} />
                                                    <span className='w-[10%] font-[600] text-[16px]'>Youtube</span>
                                                    <input type='text' defaultValue={getYoutube.value} disabled={editMode ? false : true} placeholder='Enter URL' className='inputText w-[90%] !text-[14px]' name='youtube' onChange={getData} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getYoutube.status == 1}
                                                            onChange={() => handleSwitchChange('youtube')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getYoutube.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getYoutube.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                            <span className='text-[18px] font-[600]'>Payment Information</span>
                                            <div className='grid grid-cols-6 gap-4'>
                                                <div className='flex items-center space-x-2'>
                                                    <Image src='/images/amazon.svg' alt='amazon' height={50} width={50} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getAmazon.status == 1}
                                                            onChange={() => handleSwitchChange('amazon')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getAmazon.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getAmazon.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <Image src='/images/gpay.svg' alt='gpay' height={50} width={50} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getGpay.status == 1}
                                                            onChange={() => handleSwitchChange('gpay')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getGpay.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getGpay.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <Image src='/images/mastercard.svg' alt='mastercard' height={50} width={50} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getMasterCard.status == 1}
                                                            onChange={() => handleSwitchChange('mastercard')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getMasterCard.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getMasterCard.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <Image src='/images/visa.svg' alt='visa' height={50} width={50} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getVisa.status == 1}
                                                            onChange={() => handleSwitchChange('visa')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getVisa.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getVisa.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <Image src='/images/phonepe.svg' alt='Youtube' height={50} width={50} />
                                                    {editMode && (
                                                        <Switch
                                                            checked={getPhonePe.status == 1}
                                                            onChange={() => handleSwitchChange('phonepe')}
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                            sx={{
                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: getPhonePe.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                                '& .MuiSwitch-thumb': {
                                                                    backgroundColor: getPhonePe.status == 1 ? '#CFAA4C' : '',
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-[24px] justify-center'>
                                            {!editMode && (
                                                <span className='resetButton' onClick={handleEditClick}>Edit</span>
                                            )}
                                            {editMode && (
                                                <>
                                                    <span className='resetButton' onClick={handleBack}>Back</span>
                                                    <span className='submitButton' onClick={handleAddStoreData}>Submit</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* <Dialog open={open} fullWidth onClose={handleClose}>
                <DialogContent>
                    <IconButton onClick={handleClose} style={{ position: 'absolute', top: 0, right: 5, zIndex: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <video width='100%' height='100%' controls className='p-[10px]'>
                        <source src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${selectedVideo.image_url}`} type="video/mp4" className='rounded-[8px]' />
                        Your browser does not support the video tag.
                    </video>
                </DialogContent>
            </Dialog> */}


            {/*---------------------- Add Testimonial dialog ------------------------*/}
            <Dialog open={open} fullWidth onClose={handleClose}>
                <DialogTitle className='flex justify-between items-center'>
                    Add New Testimonial
                    <CloseIcon />
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col space-y-3'>
                        <div className='flex flex-col space-y-1'>
                            <span className='font-[600] text-[16px]'>Select Customer</span>
                            <select id='selectcustomer' onChange={handleCustomerChange}>
                                <option value='0'>Select Customer</option>
                                {getCustomerData && getCustomerData.map((e, i) =>
                                    <option key={i} value={e.id}>{e.fullname}</option>
                                )}
                            </select>
                        </div>
                        {Object.keys(selectedCustomer).length > 0 && (
                            <>
                                <div className='border rounded-[8px] p-[10px] flex flex-col space-y-2'>
                                    <span className='font-[600] text-[16px]'>Customer Information</span>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.fullname}</span>
                                        <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.email}</span>
                                        <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.phone}</span>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='font-[600] text-[16px]'>Label/Heading</span>
                                        <input className='inputText !text-[14px]' type='text' name='heading' id='heading' onChange={getDataTestimonials} />
                                    </div>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='font-[600] text-[16px]'>Rating</span>
                                        <Rating
                                            name="rating"
                                            className='flex justify-between'
                                            value={rating}
                                            onChange={handleRatingChange}
                                            precision={0.5}
                                            size='large'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col space-y-1'>
                                    <span className='font-[600] text-[16px]'>Testimonial Description</span>
                                    <textarea className='inputText !text-[14px]' type='text' name='description' id='description' onChange={getDataTestimonials} />
                                </div>

                                <div className='flex items-center gap-[24px] justify-center'>
                                    <span className='resetButton' onClick={resetTestimonials}>Reset</span>
                                    <span className='submitButton' onClick={handleAddTestimonials}>Submit</span>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DynamicPages
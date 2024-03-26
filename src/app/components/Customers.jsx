import React, { useCallback, useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import { IoSearch } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import Image from 'next/image';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import axios from '../../../axios';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'
import { FaRegEye } from "react-icons/fa";
import { CiCalendarDate, CiMail } from 'react-icons/ci';
import { FiPhoneCall, FiPrinter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Customers = () => {

    const router = useRouter()

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen1 = () => {
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };


    // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
    const [customerData, setCustomerData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchCustomerData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchCustomerData = useCallback(
        () => {
            axios.get('/api/fetch-customers',{
                headers:{
                    Authorization: localStorage.getItem('kardifyAdminToken') 
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setCustomerData(res.data.customers)
                    } else if(res.data.message === 'Session expired'){
                        router.push('/')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        [],
    )

    // ----------------------------------------------Fetch Attribute section Ends-----------------------------------------------------

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const totalRows = customerData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = customerData.filter((e) =>
        e.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // ----------------------------------------------Add Attribute section Starts-----------------------------------------------------

    const [getAttributeName, setGetAttributeName] = useState({
        attribute_name: ''
    })

    const getData = (e) => {
        const { value, name } = e.target;

        setGetAttributeName(() => {
            return {
                ...getAttributeName,
                [name]: value
            }
        })
    }

    const handleAddAttribute = () => {
        const formData = new FormData();
        formData.append('attribute_name', getAttributeName.attribute_name);

        axios.post('/api/add-attributes', formData)
            .then(res => {
                if (res.data.status === 'success') {
                    fetchAttributeData()
                    openSnackbar(res.data.message, 'success');
                    handleClose()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
                openSnackbar(err.response.data.message, 'error');
            })
    }

    // ----------------------------------------------Add Attribute section Ends-------------------------------------------------------


    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (id) => {
        axios.post(`/api/update-attribute-status?attribute_id=${id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchAttributeData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------
    // ----------------------------------------------Delete Attribute section Starts-----------------------------------------------------
    const deleteCategory = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.attribute_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-attributes?attribute_id=${data.id}`)
                    .then(res => {
                        if (res.data.code == 200) {
                            fetchAttributeData()
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

    // ----------------------------------------------Delete Attribute section Ends-----------------------------------------------------

    const [isEditable, setIsEditable] = useState(false)
    const [editData, setEditData] = useState({})
    const handleEdit = (data) => {
        setEditData(data)
        handleClickOpen1()
        setIsEditable(true)
    }

    const [getEditedAttributeName, setGetEditedAttributeName] = useState({
        attribute_name_edit: ''
    })

    const getDataEdit = (e) => {
        const { value, name } = e.target;

        setGetEditedAttributeName(() => {
            return {
                ...getEditedAttributeName,
                [name]: value
            }
        })
    }

    const handleUpdateAttribute = () => {
        axios.post('/api/edit-attributes', {
            attribute_id: editData.id,
            attribute_name: getEditedAttributeName.attribute_name_edit ? getEditedAttributeName.attribute_name_edit : editData.attribute_name
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchAttributeData()
                    setGetEditedAttributeName({})
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const returnMain = () => {
        setIsEditable(false)
        setEditData({})
    }

    const [orderDetailData, setOrderDetailData] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const handleViewDetails = data => {
        setSelectedOrderId(data.id);
        setOrderDetailData(data)
    };



    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>


            {!selectedOrderId ?
                <>
                    <div className=' py-[10px] flex flex-col space-y-5'>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-[30px] text-[#101828] font-[500]'>Customers List</span>
                            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                        </div>
                    </div>
                    <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                        <div className='flex items-center px-3 justify-between'>
                            <div className='flex space-x-2 items-center'>
                                <span className='text-[18px] font-[500] text-[#101828]'>Customers List</span>
                                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{customerData.length} Customers</span>
                            </div>
                            <div className='flex items-center space-x-3 inputText w-[50%]'>
                                <IoSearch className='text-[20px]' />
                                <input
                                    type='text'
                                    className='outline-none focus-none w-full'
                                    placeholder='Search by Name/Email/Phone'
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
                                            <TableCell style={{ minWidth: 150 }}>Customer ID</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Customer Name</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Gender</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Customer DOB</TableCell>
                                            <TableCell style={{ minWidth: 200 }}>Customer Email</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Customer Phone</TableCell>
                                            {/* <TableCell style={{ minWidth: 150 }}>City</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Pincode</TableCell> */}
                                            <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>View</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {filteredRows.length > 0 ?
                                        <TableBody>
                                            {paginatedRows.map((row , i) => (
                                                <TableRow key={row.id} >
                                                    <TableCell>{i+1}</TableCell>
                                                    <TableCell className='text-[#667085]'>
                                                        {row.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center space-x-2 text-[#667085]' >
                                                            {/* <Image src='/images/logo.svg' alt='installer' width={30} height={50} className='rounded-[50%] object-cover h-[40px] w-[40px]' /> */}
                                                            <span>{row.fullname}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-[#667085]'>
                                                        Male
                                                    </TableCell>
                                                    <TableCell className='text-[#667085]'>
                                                        {row.dob || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                           {row.email || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className='text-[#667085]'>
                                                    {row.phone || 'N/A'}
                                                    </TableCell>
                                                    {/* <TableCell className='text-[#667085]'>
                                                        Bengaluru
                                                    </TableCell>
                                                    <TableCell className='text-[#667085]'>
                                                        754029
                                                    </TableCell> */}
                                                    <TableCell ><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteCategory(row)} /></TableCell>
                                                    <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleViewDetails(row)} /></TableCell>
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
                :

                <div className=' py-[10px] flex flex-col space-y-5'>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>Customer Details</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Efficient Order Management: Navigate and control your e-commerce operations effortlessly with the All Orders feature in the admin application, ensuring a smooth fulfillment process.</span>
                    </div>
                    <span className=' bg-[#CFAA4C] hover:opacity-80 rounded-[8px] px-[18px] py-[10px] text-[#fff] text-center cursor-pointer' onClick={() => setSelectedOrderId(null)}>Back</span>
                    <div className='flex items-end gap-[20px]'>
                        <div className='flex flex-col space-y-3 border border-slate-200 rounded-[16px] p-[16px] w-[50%]'>
                            <span className='text-[18px] font-[600] text-[#101828]'>Customer Information</span>
                            <div className='flex flex-col space-y-1'>
                                <span>Olivia</span>
                                <span>01 Order</span>
                                <span>Joined @ 23 Sep 2024</span>
                                <span className='flex items-center gap-[10px]'>
                                    <CiMail />
                                    olivia@untitledui.com
                                </span>
                                <span className='flex items-center gap-[10px]'>
                                    <FiPhoneCall />
                                    +91 98655 64895
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-3 border border-slate-200 rounded-[16px] p-[16px] w-[50%]'>
                            <span className='text-[18px] font-[600] text-[#101828]'>Orders Information</span>
                            <div className='flex items-start justify-between gap-[40px] text-[14px] text-[#667085]'>
                                <div className='flex flex-col space-y-2 w-[50%]'>
                                    <div className="billing-item flex justify-between">
                                        <span >Total Order :</span>
                                        <span className='value'>85</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Pending Orders :</span>
                                        <span className='value'>0</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Packaging Orders :</span>
                                        <span className='value'>8</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Confirmed Orders :</span>
                                        <span className='value'>9</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Out For Delivery :</span>
                                        <span className='value'>6</span>
                                    </div>
                                </div>

                                <div className='flex flex-col jutify-between space-y-3 w-[50%]'>
                                    <div className='flex flex-col space-y-2'>
                                        <div className="billing-item flex justify-between">
                                            <span >Delivered Orders :</span>
                                            <span className='value'>10</span>
                                        </div>
                                        <div className="billing-item flex justify-between">
                                            <span className='label'>Returned Orders :</span>
                                            <span className='value'>10</span>
                                        </div>
                                        <div className="billing-item flex justify-between">
                                            <span className='label'>Cancelled Order :</span>
                                            <span className='value'>26</span>
                                        </div>
                                    </div>

                                    <div className="billing-item flex justify-between">
                                        <span className='label font-[600]'>Amount Paid :</span>
                                        <span className='value font-[600]'>₹ 26,00,000</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='border border-slate-200 h-[100%] p-[16px] rounded-[16px] w-full'>


                        <Paper className='w-full'>
                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow className='!bg-[#F9FAFB]'>
                                            <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Product Image</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Product Name</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Quantity</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>Price</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Discount</TableCell>
                                            <TableCell style={{ minWidth: 100 }}>Total Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderDetailData.order_details && orderDetailData.order_details.map((e, i) => (
                                            <TableRow key={e.id} >
                                                <TableCell>{e.id}</TableCell>
                                                <TableCell>
                                                    <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${e.product_images[0]?.image_url}`} width={50} height={40} alt={e.product.product_name} />
                                                </TableCell>
                                                <TableCell>
                                                    {e.product.product_name}
                                                </TableCell>
                                                <TableCell >
                                                    {e.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    {e.sub_total}
                                                </TableCell>
                                                <TableCell>₹ </TableCell>
                                                <TableCell>{e.total_amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
            }

            {/*---------------------- add  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add New Installer
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[#344054] text-[14px] font-[500]'>Attribute Name</span>
                        <input type='text' className='inputText' placeholder='Ex: Colour' name='attribute_name' onChange={getData} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleAddAttribute} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Submit
                    </span>
                </DialogActions>
            </BootstrapDialog>

            {/*---------------------- Edit  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose1}
                aria-labelledby="customized-dialog-title"
                open={open1}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Product Attributes
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose1}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[#344054] text-[14px] font-[500]'>Attribute Name</span>
                        <input type='text' className='inputText' defaultValue={editData.attribute_name} placeholder='Ex: Colour' name='attribute_name_edit' onChange={getDataEdit} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleUpdateAttribute} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Save Changes
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default Customers
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
import { useSnackbar } from '../SnackbarProvider';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Dealers = () => {
    const { openSnackbar } = useSnackbar();

    const router = useRouter()

    const [rejectedData, setRejectedData] = useState({})
    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen1 = (data) => {
        setOpen1(true);
        setRejectedData(data)
    };
    const handleClose1 = () => {
        setOpen1(false);
        setRejectedData({})
    };



    // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
    const [dealersData, setDealersData] = useState([])
    const [activeTab, setActiveTab] = useState('pending');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchDealerData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchDealerData = useCallback(() => {
        axios.get(`/api/fetch-dealers`, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then((res) => {
                if (res.data.status === 'success') {
                    setDealersData(res.data.dealers)
                } else if (res.data.message === 'Session expired') {
                    openSnackbar(res.data.message, 'error');
                    router.push('/login')
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
        [],
    )

    const pendingData = dealersData && dealersData.filter(e => e.approved == null)
    const approveData = dealersData && dealersData.filter(e => e.approved == true)
    const rejectData = dealersData && dealersData.filter(e => e.approved == false)

    // ----------------------------------------------Fetch Attribute section Ends-----------------------------------------------------

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const totalRows = dealersData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = dealersData.filter((e) => {
        const nameMatches = e.fullname.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === 'pending') {
            return e.approved === null && nameMatches;
        } else if (activeTab === 'approved') {
            return e.approved === true && nameMatches;
        } else if (activeTab === 'rejected') {
            return e.approved === false && nameMatches;
        }
        return nameMatches;
    });


    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
    const paginatedRows = filteredRows.slice(startIndex, endIndex);


    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (data) => {
        Swal.fire({
            title: "Status?",
            text: `Do you want to change the status to ${data.is_active == false ? 'Active' : 'Inactive'}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Change it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/active-inactive-dealer?dealer_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            openSnackbar(res.data.message, 'success');
                            fetchDealerData()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------



    const [orderDetailData, setOrderDetailData] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const handleViewDetails = data => {
        setSelectedOrderId(data.id);
        setOrderDetailData(data)
    };


    const handleApproveDealer = (data) => {
        Swal.fire({
            title: "Approve?",
            text: `Do you want to Approve Dealer named ${data.fullname}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Approve it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/approve-dealer?dealer_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        console.log(res)
                        if (res.data.status === 'success') {
                            openSnackbar(res.data.message, 'success');
                            fetchDealerData()
                        } else {
                            openSnackbar(res.data.message, 'error');
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    }

    const [getRejectedReason, setGetRejectedReason] = useState({
        rejected_reason_dealer: ''
    })

    const getDataReject = (e) => {
        const { value, name } = e.target;

        setGetRejectedReason(() => {
            return {
                ...getRejectedReason,
                [name]: value
            }
        })
    }

    const handleRejectDealer = () => {
        if (getRejectedReason.rejected_reason_dealer === '') {
            openSnackbar('Enter rejected reason to Reject', 'error');
            return
        }
        axios.post('/api/reject-dealer', {
            dealer_id: rejectedData.id,
            rejected_reason: getRejectedReason.rejected_reason_dealer
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        }).
            then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchDealerData()
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }



    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>


            {!selectedOrderId ?
                <>
                    <div className=' py-[10px] flex flex-col space-y-5'>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-[30px] text-[#101828] font-[500]'>Dealers List</span>
                            <span className='text-[#667085] font-[400] text-[16px]'>Dealer-Centric Control: Explore and manage your customer base seamlessly with the Customers List feature in the admin application, empowering personalized interactions and satisfaction.</span>
                        </div>

                        <div className='grid grid-cols-3 gap-4 py-[20px]'>
                            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'pending' ? 'bg-[#CFAA4C] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('pending')}>
                                <div className='flex justify-between items-center'>
                                    <span>Pending</span>
                                    <span>{pendingData.length}</span>
                                </div>
                            </div>
                            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'approved' ? 'bg-[#CFAA4C] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('approved')}>
                                <div className='flex justify-between items-center'>
                                    <span>Approved</span>
                                    <span>{approveData.length}</span>
                                </div>
                            </div>
                            <div className={`px-[24px] py-[12px] rounded-[8px]  text-[14px] cursor-pointer ${activeTab === 'rejected' ? 'bg-[#CFAA4C] text-[#fff]' : 'bg-[#f9fafb]'}`} onClick={() => handleTabChange('rejected')}>
                                <div className='flex justify-between items-center'>
                                    <span>Rejected Dealer</span>
                                    <span>{rejectData.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-5   p-[10px] border border-[#EAECF0] rounded-[8px]'>
                            <div className='flex items-center px-3 justify-between '>
                                <div className='flex space-x-2 items-center'>
                                    <span className='text-[18px] font-[500] text-[#101828]'>Dealers List</span>
                                    <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{filteredRows.length} Dealers</span>
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
                                                <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Delar ID</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Delar Name</TableCell>
                                                <TableCell style={{ minWidth: 100 }}>Gender</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Delar info</TableCell>
                                                <TableCell style={{ minWidth: 250 }}>Address</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>City</TableCell>
                                                <TableCell style={{ minWidth: 100 }}>Pincode</TableCell>
                                                {activeTab === 'pending' && (
                                                    <TableCell style={{ minWidth: 100 }}>Action</TableCell>
                                                )}
                                                {activeTab === 'approved' && (
                                                    <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                )}
                                                {activeTab === 'rejected' && (
                                                    <TableCell style={{ minWidth: 250 }}>Rejected Reason</TableCell>
                                                )}
                                                <TableCell style={{ minWidth: 100 }}>View</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {filteredRows.length > 0 ?
                                            <TableBody>
                                                {paginatedRows.map((row, i) => (
                                                    <TableRow key={row.id} >
                                                        <TableCell>{startIndex + i + 1}</TableCell>
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
                                                            {row.gender || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                <span className='text-[14px] font-[400]'>+ 91 97575 87868</span>
                                                                <span className='text-[14px] font-[400]'>olivia@untitledui.com</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='text-[#667085]'>
                                                            {row.add1 || 'N/A'}
                                                        </TableCell>
                                                        <TableCell className='text-[#667085]'>
                                                            {row.city || 'N/A'}
                                                        </TableCell>
                                                        <TableCell className='text-[#667085]'>
                                                            {row.pincode || 'N/A'}
                                                        </TableCell>
                                                        {activeTab === 'pending' && (
                                                            <TableCell className='text-[#667085]'>
                                                                <div className='flex items-center gap-[15px]'>
                                                                    <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApproveDealer(row)}>
                                                                        <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                    </div>
                                                                    <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleClickOpen1(row)}>
                                                                        <span className='text-red-500 text-[12px] font-[500]'>Reject</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                        {activeTab === 'approved' && (
                                                            <TableCell className='text-[#667085]'>
                                                                <Switch
                                                                    checked={row.is_active}
                                                                    onChange={() => handleSwitchChange(row)}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                    sx={{
                                                                        '& .MuiSwitch-thumb': {
                                                                            backgroundColor: row.is_active ? '#CFAA4C' : '',
                                                                        },
                                                                        '& .Mui-checked + .MuiSwitch-track': {
                                                                            backgroundColor: '#CFAA4C',
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        )}
                                                        {activeTab === 'rejected' && (
                                                            <TableCell className='text-[#667085]'>
                                                                {row.rejected_reason || 'N/A'}
                                                            </TableCell>
                                                        )}
                                                        <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleViewDetails(row)} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            :
                                            <TableRow>
                                                <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Dealers found</TableCell>
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
                </>
                :

                <div className=' py-[10px] flex flex-col space-y-5'>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>Dealer Details</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Efficient Order Management: Navigate and control your e-commerce operations effortlessly with the All Orders feature in the admin application, ensuring a smooth fulfillment process.</span>
                    </div>
                    <span className=' bg-[#CFAA4C] hover:opacity-80 rounded-[8px] px-[18px] py-[10px] text-[#fff] text-center cursor-pointer' onClick={() => setSelectedOrderId(null)}>Back</span>
                    <div className='flex items-end gap-[20px]'>
                        <div className='flex flex-col space-y-3 border border-slate-200 rounded-[16px] p-[16px] w-[50%]'>
                            <span className='text-[18px] font-[600] text-[#101828]'>Dealer Information</span>
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
                                            <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
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

            {/*---------------------- Edit  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose1}
                aria-labelledby="customized-dialog-title"
                open={open1}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Cancel Order Reason
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
                        <span className='text-[#344054] text-[14px] font-[500]'>Reason to cancel</span>
                        <textarea className='inputText' placeholder='cancel' name='rejected_reason_dealer' onChange={getDataReject} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Close
                    </span>
                    <span autoFocus className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70' onClick={handleRejectDealer}>
                        Reject Dealer
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>

    )
}

export default Dealers
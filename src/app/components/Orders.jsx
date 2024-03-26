import React, { useCallback, useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { MdAdd } from 'react-icons/md'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, Switch, MenuItem, RadioGroup, FormControl, FormControlLabel, Radio } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import axios from '../../../axios';
import Image from 'next/image';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { FiPrinter } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { FiPhoneCall } from "react-icons/fi";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { IoIosClose } from "react-icons/io";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Orders = () => {
    const { openSnackbar } = useSnackbar();

    function formatDate(apiTimestamp) {
        const date = new Date(apiTimestamp);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const [orderStatus, setOrderStatus] = useState('All Orders'); // Default to 'All Orders'
    const handleOrderStatusChange = newOrderStatus => {
        setOrderStatus(newOrderStatus);
        setPage(1);
    };

    const [orderDetailData, setOrderDetailData] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const handleViewDetails = data => {
        setSelectedOrderId(data.id);
        setOrderDetailData(data)
    };

    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen1 = () => {
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };



    // ----------------------------------------------Fetch Car Brands Starts-----------------------------------------------------
    const [allOrdersData, setAllOrdersData] = useState([])
    const [ordersByStatus, setOrdersByStatus] = useState([])

    console.log(ordersByStatus)
    useEffect(() => {
        const filterData = () => {
            if (orderStatus === 'Pendings') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name === 'Pending'));
            } else if (orderStatus === 'Packaging') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name === 'Packaging'));
            } else if (orderStatus === 'Confirmed') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name === 'Confirmed'));
            } else if (orderStatus === 'Out For Delivery') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name === 'Out For Delivery'));
            } else if (orderStatus === 'Delivered') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name === 'Delivered'));
            } else if (orderStatus === 'Cancelled') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name.includes('Cancelled By Customer') || row.order_status.status_name.includes('Cancelled By Kardify')));
            } else if (orderStatus === 'Returned') {
                setOrdersByStatus(allOrdersData.filter(row => row.order_status.status_name.includes('Return Initiated') || row.order_status.status_name.includes('Return Approved By Vendor') || row.order_status.status_name.includes('Return Completed')));
            } else {
                setOrdersByStatus(allOrdersData);
            }
        };

        filterData();
    }, [orderStatus, allOrdersData]);

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchAllOrderData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchAllOrderData = useCallback(
        () => {
            axios.get('/api/fetch-orders-admin',{
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setAllOrdersData(res.data.orders)
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )

    // ----------------------------------------------Fetch car brands Ends-----------------------------------------------------
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = ordersByStatus.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = ordersByStatus.filter((e) =>
        e.order_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);


    // --------------------------------------------approved by vendor starts------------------------------------
    const handleApprove = (id) => {
        axios.post('/api/approve-order', {
            order_id: id
        })
            .then(res => {
                console.log(res)
                fetchAllOrderData()
            })
            .catch(err => {
                console.log(err)
            })
    }
    // --------------------------------------------approved by vendor Ends------------------------------------

    // --------------------------------------------fetch all status and update status starts------------------------------------
    const [allStatus, setAllStatus] = useState([])
    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchAllStatusData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchAllStatusData = useCallback(
        () => {
            axios.get('/api/get-all-status')
                .then((res) => {
                    console.log(res)
                    if (res.data.status === 'success') {
                        setAllStatus(res.data.orderStatuses)
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )

    const [statusChange, setStatusChange] = useState({
        change_order: ''
    })

    const getStatusData = (e) => {
        const { value, name } = e.target;

        setStatusChange(() => {
            return {
                ...statusChange,
                [name]: value
            }
        })

        updateStatusByAdmin(value);
    }

    const updateStatusByAdmin = (status_id) => {
        Swal.fire({
            title: "Update Status",
            text: `Do you want to Update the status?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Update it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/order-status-update', {
                    order_id: orderDetailData.id,
                    order_status_id: status_id
                })
                    .then(res => {
                        console.log(res)
                        openSnackbar(res.data.message, 'success');
                        fetchAllOrderData()
                        setSelectedOrderId(null)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        });
    };

    const getStatusColor = (statusName) => {
        switch (statusName) {
            case 'Pendings':
                return 'bg-red-400 text-[#027A48]';
            case 'Confirmed':
                return 'bg-[#ECFDF3] text-[#027A48]';
            case 'Packaging':
                return 'bg-[#ECFDF3] text-[#027A48]';
            case 'Cancelled By Kardify':
                return 'bg-red-200 text-red-600';
            case 'Cancelled By Customer':
                return 'bg-red-200 text-red-600';
            default:
                return 'bg-[#ECFDF3] text-[#027A48]';
        }
    };

    // --------------------------------------------fetch all status and update ends------------------------------------


    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [selectedCourier, setSelectedCourier] = useState('');
    const [courierError, setCourierError] = useState('');
    const [dimensionsError, setDimensionsError] = useState('');
    const [dimensions, setDimensions] = useState({
        length: '',
        breadth: '',
        height: '',
    });

    console.log(selectedCourier)

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setActiveStep(0);
        setSelectedCourier('')
        setDimensions({
            length: '',
            breadth: '',
            height: '',
        })
        setCourierError('');
        setDimensionsError('');
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!selectedCourier) {
                setCourierError('Please choose a courier service.');
                return;
            } else {
                setCourierError('');
                setActiveStep((prevStep) => prevStep + 1);
            }
        } else if (activeStep === 1) {
            const { length, breadth, height } = dimensions;
            if (!length || !breadth || !height || isNaN(length) || isNaN(breadth) || isNaN(height)) {
                setDimensionsError('Please enter valid numerical values for length, breadth, and height.');
                return;
            } else {
                setDimensionsError('');
            }

            console.log('api called successfully')
            handleDialogClose()
        }


    };

    const handleDimensionsChange = (dimension, value) => {
        setDimensions((prevDimensions) => ({
            ...prevDimensions,
            [dimension]: parseFloat(value) || 0,
        }));
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
        }
    };

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <div className='flex flex-col space-y-3 '>
                        <span className='text-[15px] text-black font-[600]'>Choose Courier Service</span>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="CourierService"
                                name="courierService"
                                value={selectedCourier}
                                onChange={(e) => setSelectedCourier(e.target.value)}
                            >
                                <FormControlLabel value="shiprocket" control={<Radio />} label="Shiprocket" />
                                {/* <FormControlLabel value="roadrunner" control={<Radio />} label="Road Runner" /> */}
                            </RadioGroup>
                        </FormControl>
                        {courierError && <span className="text-red-500">{courierError}</span>}
                    </div>
                );
            case 1:
                return (
                    <div className='flex flex-col space-y-4'>
                        <span className='text-[15px] text-black font-[600]'>Enter Length, Breadth, and Height (in cm)</span>
                        <TextField
                            label="Length (in cm)"
                            fullWidth
                            onChange={(e) => handleDimensionsChange('length', e.target.value)}
                        />
                        <TextField
                            label="Breadth (in cm)"
                            fullWidth
                            onChange={(e) => handleDimensionsChange('breadth', e.target.value)}
                        />
                        <TextField
                            label="Height (in cm)"
                            fullWidth
                            onChange={(e) => handleDimensionsChange('height', e.target.value)}
                        />
                        {dimensionsError && <span className="text-red-500 text-[15px]">{dimensionsError}</span>}
                    </div>

                );
            default:
                return 'Unknown stepIndex';
        }
    };


    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>
            {!selectedOrderId ?
                <div className=' py-[10px] flex flex-col space-y-5'>
                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>{orderStatus}</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Efficient Order Management: Navigate and control your e-commerce operations effortlessly with the All Orders feature in the admin application, ensuring a smooth fulfillment process.</span>
                    </div>
                    <div className='grid grid-cols-4 gap-4 text-center'>
                        {/* Order status tabs */}
                        {['All Orders', 'Pendings', 'Confirmed', 'Packaging', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned'].map(status => {
                            const filteredOrders = (() => {
                                if (status === 'All Orders') {
                                    return allOrdersData;
                                } else if (status === 'Pendings') {
                                    return allOrdersData.filter(row => row.order_status.status_name === 'Pending')
                                } else if (status === 'Confirmed') {
                                    return allOrdersData.filter(row => row.order_status.status_name === 'Confirmed')
                                } else if (status === 'Packaging') {
                                    return allOrdersData.filter(row => row.order_status.status_name === 'Packaging')
                                } else if (status === 'Out For Delivery') {
                                    return allOrdersData.filter(row => row.order_status.status_name === 'Out For Delivery')
                                } else if (status === 'Cancelled') {
                                    return allOrdersData.filter(row => row.order_status.status_name.includes('Cancelled By Customer') || row.order_status.status_name.includes('Cancelled By Kardify'));
                                } else if (status === 'Returned') {
                                    return allOrdersData.filter(row => row.order_status.status_name.includes('Return Initiated') || row.order_status.status_name.includes('Return Approved By Vendor') || row.order_status.status_name.includes('Return Completed'));
                                } else {
                                    return allOrdersData.filter(row => row.order_status.status_name === status);
                                }
                            })();

                            return (
                                <div
                                    key={status}
                                    className={`px-[24px] py-[12px] rounded-[8px] ${orderStatus === status ? 'bg-[#CFAA4C]' : 'bg-[#F9FAFB]'}  text-[${orderStatus === status ? '#fff' : 'black'}] text-[14px] cursor-pointer`}
                                    onClick={() => handleOrderStatusChange(status)}
                                >

                                    <div className='flex justify-between items-center'>
                                        <span>{status}</span>
                                        <span>{filteredOrders.length}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                        <div className='flex items-center px-3 justify-between'>
                            <div className='flex space-x-2 items-center'>
                                <span className='text-[18px] font-[500] text-[#101828]'>{orderStatus}</span>
                                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{ordersByStatus.length} {orderStatus}</span>
                            </div>
                            <div className='flex items-center space-x-3 inputText w-[50%]'>
                                <IoSearch className='text-[20px]' />
                                <input
                                    type='text'
                                    className='outline-none focus-none w-full'
                                    placeholder='Search By Order ID/Name'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <Paper >
                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow className='!bg-[#F9FAFB]'>
                                            {/* Define your table header columns */}
                                            <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Order ID</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Order Date</TableCell>
                                            {/* <TableCell style={{ minWidth: 150 }}>Delivery Date</TableCell> */}
                                            {/* <TableCell style={{ minWidth: 150 }}>Time Slot(Hr)</TableCell> */}
                                            <TableCell style={{ minWidth: 150 }}>Total Amount</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Delivery Type</TableCell>
                                            <TableCell style={{ minWidth: 150 }}>Order Status</TableCell>
                                            {orderStatus === 'Pendings' && (
                                                <TableCell style={{ minWidth: 200 }}>Order Action</TableCell>
                                            )}
                                            {orderStatus === 'Packaging' && (
                                                <TableCell style={{ minWidth: 200 }}>Delivery</TableCell>
                                            )}
                                            <TableCell style={{ minWidth: 50 }}>Print</TableCell>
                                            <TableCell style={{ minWidth: 50 }}>View</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {filteredRows.length > 0 ?
                                        <TableBody>
                                            {paginatedRows.map((row) => (
                                                <TableRow key={row.id} >
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell>{row.order_id}</TableCell>
                                                    <TableCell>
                                                        {formatDate(row.createdAt)}
                                                    </TableCell>
                                                    {/* <TableCell >
                                                        Date
                                                    </TableCell>
                                                    <TableCell>
                                                        50
                                                    </TableCell> */}
                                                    <TableCell>₹ {row.total_paid_amount}</TableCell>
                                                    <TableCell>{row.delivery_type.delivery_type_name}</TableCell>
                                                    <TableCell>
                                                        <div className={`flex items-center gap-[5px] py-[5px] rounded-[16px] justify-center ${getStatusColor(row.order_status.status_name)}`}>
                                                            <span className='text-[12px] font-[500]'>{row.order_status.status_name}</span>
                                                        </div>
                                                    </TableCell>
                                                    {orderStatus === 'Pendings' && (
                                                        <TableCell>
                                                            <div className='flex items-center gap-[15px]'>
                                                                <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row.id)}>
                                                                    <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                </div>
                                                                <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={handleClickOpen1}>
                                                                    <span className='text-red-500 text-[12px] font-[500]'>Cancel</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                    {orderStatus === 'Packaging' && (
                                                        <>
                                                            <TableCell>
                                                                <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={handleDialogOpen}>
                                                                    <span className='text-[#027A48] text-[12px] font-[500]'>Assign to Delivery</span>
                                                                </div>
                                                            </TableCell>


                                                        </>
                                                    )}
                                                    <TableCell><FiPrinter className='text-[20px] cursor-pointer text-slate-500' /></TableCell>
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
                </div>
                :
                <div className=' py-[10px] flex flex-col space-y-5'>

                    <div className='flex flex-col space-y-1'>
                        <span className='text-[30px] text-[#101828] font-[500]'>Order Details</span>
                        <span className='text-[#667085] font-[400] text-[16px]'>Efficient Order Management: Navigate and control your e-commerce operations effortlessly with the All Orders feature in the admin application, ensuring a smooth fulfillment process.</span>
                    </div>

                    <span className=' bg-[#CFAA4C] hover:opacity-80 rounded-[8px] px-[18px] py-[10px] text-[#fff] text-center cursor-pointer' onClick={() => setSelectedOrderId(null)}>Back</span>
                    <div className='flex items-end gap-[20px]'>
                        <div className='flex flex-col space-y-3 border border-slate-200 rounded-[16px] p-[16px] w-[50%]'>
                            <span className='text-[18px] font-[600] text-[#101828]'>Order Setup</span>
                            <div className='flex flex-col space-y-1'>
                                <span className='text-[14px] text-[#344054] font-[500]'>Change order status</span>
                                <select value={orderDetailData.order_status.id} name='change_order' onChange={getStatusData}>
                                    {allStatus && allStatus.map((e, i) =>
                                        <option key={i} value={e.id} disabled={e.id < orderDetailData.order_status.id}>{e.status_name}</option>
                                    )}
                                </select>
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <span className='text-[14px] text-[#344054] font-[500]'>Delivery Date & Time:</span>
                                <input type='datetime-local' className='inputText' />
                            </div>
                        </div>
                        <div className='flex flex-col space-y-3 border border-slate-200 rounded-[16px] p-[16px] w-[50%]'>
                            <span className='text-[18px] font-[600] text-[#101828]'>Customer Information</span>
                            <div className='flex flex-col space-y-1'>
                                <span>Olivia</span>
                                <span>01 Order</span>
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
                    </div>

                    <div className='border border-slate-200 h-[100%] p-[16px] rounded-[16px] w-full'>
                        <div className='grid grid-cols-3 gap-10 w-[100%] pb-[20px]'>
                            <div className='flex flex-col space-y-4'>
                                <span className='text-[#101828] text-[20px] font-[600]'>Order ID #100001</span>
                                <div className='flex gap-[10px] items-center text-[14px] text-[#667085] font-[400]'>
                                    <CiCalendarDate className='text-[20px]' />
                                    <span>27 sep 2023</span>
                                </div>

                                <div className='flex gap-[5px] items-center bg-[#CFAA4C] hover:opacity-80 rounded-[8px] px-[18px] py-[10px] text-[#fff] justify-center cursor-pointer'>
                                    <FiPrinter />
                                    <span>Print Invoice</span>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <span className='text-[#667085] text-[14px] font-[700]'>Billing Info</span>
                                <div className='flex flex-col space-y-3 text-[14px] text-[#667085]'>
                                    <div className="billing-item flex justify-between">
                                        <span >Items Price :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Item Discount :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Sub Total :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>TAX / VAT :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Coupon Discount :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Delivery Fee :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between font-[700]">
                                        <span className='label'>Total :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-col space-y-3 text-[14px] text-[#667085]'>
                                    <div className="billing-item flex items-center justify-between">
                                        <span >Status :</span>
                                        <div className={`flex items-center gap-[5px] py-[5px] px-[10px] rounded-[16px] justify-center ${getStatusColor(orderDetailData.order_status.status_name)}`}>
                                            <span className='text-[12px] font-[500]'>{orderDetailData.order_status.status_name}</span>
                                        </div>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Payment Method :</span>
                                        <span className='value'>Online Payment</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Payment ID :</span>
                                        <span className='value'>e1455dgsg</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Reference Code :</span>
                                        <span className='value'>HhagQ62652</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Payment Status :</span>
                                        <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                            <span className='text-[#027A48] text-[12px] font-[500]'>Paid</span>
                                        </div>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Delivery Type :</span>
                                        <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                            <span className='text-[#027A48] text-[12px] font-[500]'>{orderDetailData.delivery_type.delivery_type_name}</span>
                                        </div>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Order date :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                    <div className="billing-item flex justify-between">
                                        <span className='label'>Delivered date :</span>
                                        <span className='value'>₹ 456</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Paper className='w-full'>
                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow className='!bg-[#F9FAFB]'>
                                            {/* Define your table header columns */}
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


                    <div className='flex gap-[10px] justify-center  bg-[#fff]'>
                        <span>Approve</span>
                        <span>Approve</span>
                        <span>Approve</span>
                    </div>
                </div>
            }

            {/* Assign to delivery dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
                <DialogTitle className='bg-[#CFAA4C] flex justify-between items-center text-white font-bold py-2'>
                    Assign to Delivery
                    <IoIosClose className='text-[30px] font-[600] cursor-pointer' onClick={handleDialogClose} />
                </DialogTitle>
                <Stepper activeStep={activeStep} className='!p-[10px] '>
                    <Step>
                        <StepLabel >Choose Courier Service</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Enter Length, Breadth, and Height</StepLabel>
                    </Step>
                </Stepper>
                <div className='flex flex-col space-y-3 p-[10px]'>
                    <div>{getStepContent(activeStep)}</div>
                    <div className='flex justify-between'>
                        <span className='px-[35px] py-[10px] font-[600] border border-slate-200 rounded-[8px] cursor-pointer' disabled={activeStep === 0} onClick={handleBack}>Back</span>
                        <span className='bg-[#CFAA4C] hover:opacity-80 text-[#fff] font-[600] px-[35px] py-[10px] rounded-[8px] cursor-pointer' onClick={handleNext}>{activeStep === 1 ? 'Assign' : 'Next'}</span>
                    </div>
                </div>
            </Dialog>

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
                        <textarea className='inputText' placeholder='cancel' name='attribute_name_edit' />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Close
                    </span>
                    <span autoFocus className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Cancel Order
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default Orders
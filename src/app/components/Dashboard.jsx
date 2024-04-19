'use client'
import React, { useCallback, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LineChart1 from './LineChart';
import PieChart1 from './PieChart';
import { getAllCustomerData, getAllDealerData, getProducts } from '../api';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from '../../../axios';

const options = [
    'Total',
    'This Month',
    'This Year'
];

const ITEM_HEIGHT = 48;

const Dashboard = () => {
    const router = useRouter()

    if(typeof localStorage !== 'undefined' && !localStorage.getItem('kardifyAdminToken')){
        router.push('/login');
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [selectedFilter, setSelectedFilter] = useState('Total');
    const [filteredData, setFilteredData] = useState([]);
    const [percentageChange, setPercentageChange] = useState(0);
    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchCustomerData()
            fetchDealerData()
            fetchAllOrderData()
            fetchAllProducts()
        }

        return () => { unmounted = true };
    }, [])



    const [getCustomerData, setGetCustomerData] = useState([])
    const fetchCustomerData = async () => {
        try {
            const customerData = await getAllCustomerData();
            if (customerData.status === 'success') {
                setGetCustomerData(customerData.customers);
            } else if (customerData.message === 'Session expired') {
                router.push('/login')
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const [getDealerData, setGetDealerData] = useState([])
    const fetchDealerData = async () => {
        try {
            const dealerData = await getAllDealerData();
            if (dealerData.status === 'success') {
                setGetDealerData(dealerData.dealers);
            } else if (dealerData.message === 'Session expired') {
                router.push('/login')
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const [getAllProducts, setGetAllProducts] = useState([])
    const fetchAllProducts = async () => {
        try {
            const productData = await getProducts();
            if (productData.status === 'success') {
                setGetAllProducts(productData.products);
            } else if (productData.message === 'Session expired') {
                router.push('/login')
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const [allOrdersData, setAllOrdersData] = useState([])
    const [statusColors, setStatusColors] = useState({});
    const fetchAllOrderData = useCallback(
        () => {
            axios.get('/api/fetch-orders-admin',{
                headers : {
                    Authorization : localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setAllOrdersData(res.data.orders)
                        generateStatusColors(res.data.orders.map(order => order.order_status.status_name));
                    } else if (res.data.message === 'Session expired') {
                        router.push('/login')
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )

    const generateStatusColors = (statuses) => {
        const uniqueStatuses = [...new Set(statuses)];
        const colors = {};
        uniqueStatuses.forEach((status, index) => {
            colors[status] = getRandomColor(index);
        });
        setStatusColors(colors);
    };
    const getRandomColor = (index) => {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF0000', '#00FF00', '#FF5733', '#36A2EB', '#FFC300'];
        return COLORS[index % COLORS.length];
    };

    useEffect(() => {
        const filtered = getCustomerData.filter(customer => {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const customerCreatedAt = new Date(customer.createdAt);

            if (selectedFilter === 'Total') {
                return true;
            } else if (selectedFilter === 'This Month') {
                return customerCreatedAt.getMonth() === currentMonth;
            } else if (selectedFilter === 'This Year') {
                return customerCreatedAt.getFullYear() === currentYear;
            }
        });

        setFilteredData(filtered);

        const totalCustomers = getCustomerData.length;
        const filteredCustomers = filtered.length;

        let previousFilteredCustomers = 0;
        if (selectedFilter === 'This Month') {
            const previousMonth = (new Date().getMonth() + 11) % 12;
            previousFilteredCustomers = getCustomerData.filter(customer => {
                const customerCreatedAt = new Date(customer.createdAt);
                return customerCreatedAt.getMonth() === previousMonth;
            }).length;
        } else if (selectedFilter === 'This Year') {
            const previousYear = new Date().getFullYear() - 1;
            previousFilteredCustomers = getCustomerData.filter(customer => {
                const customerCreatedAt = new Date(customer.createdAt);
                return customerCreatedAt.getFullYear() === previousYear;
            }).length;
        }

        const denominator = selectedFilter === 'Total' ? totalCustomers :
            selectedFilter === 'This Year' ?
                previousFilteredCustomers > 0 ? previousFilteredCustomers : 1 :
                previousFilteredCustomers;

        const percentageChange = ((filteredCustomers - previousFilteredCustomers) / denominator) * 100;
        // const clampedPercentageChange = isFinite(percentageChange) ? Math.min(Math.max(percentageChange, -100), 100) : 0;
        setPercentageChange(percentageChange);

    }, [getCustomerData, selectedFilter]);

    return (
        <div className='p-[10px] flex flex-col space-y-10 container mx-auto'>
            <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Welcome back!</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Track, manage and forecast your customers and orders.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[18px] font-[500]'>Total Customers</span>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === selectedFilter} onClick={() => {
                                    setSelectedFilter(option);
                                    handleClose();
                                }}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-[600]">{filteredData.length}</h2>
                        <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                            {percentageChange !== 0 ? (
                                <>
                                    {percentageChange > 0 ? (
                                        <span className='text-[#027A48] text-[14px] font-[500]' style={{ color: '#027A48' }}>
                                            <span className="arrow-up">&#8593;</span>
                                            {Math.abs(percentageChange).toFixed(2)}%
                                        </span>
                                    ) : (
                                        <span className='text-[#DB4437] text-[14px] font-[500]' style={{ color: '#DB4437' }}>
                                            <span className="arrow-down">&#8595;</span>
                                            {Math.abs(percentageChange).toFixed(2)}%
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className='text-[14px] text-[#027A48] font-[500]'>
                                    No change
                                </span>
                            )}
                            <span className='font-[500]'>vs {selectedFilter}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[18px] font-[500]'>Total Dealers</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{getDealerData.length}</h2>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[18px] font-[500]'>Total Products</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{getAllProducts.length}</h2>
                    </div>
                </div>
                <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
                    <div className='flex justify-between items-center'>
                        <span className='text-[18px] font-[500]'>Total Orders</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold">{allOrdersData.length}</h2>
                    </div>
                </div>
                
                {/* <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
            <div className='flex justify-between items-center'>
                <span className='text-[16px]'>Total Customers</span>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold">2,420</h2>
                <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                    <span className='text-[#027A48] text-[14px] font-[500]'>40% </span>

                    <span>vs last month</span>
                </div>
            </div>
        </div>
        <div className="bg-[#fcf8ee] flex flex-col justify-between shadow-md rounded-lg overflow-hidden w-full p-[24px]">
            <div className='flex justify-between items-center'>
                <span className='text-[16px]'>Total Customers</span>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            <div className="flex flex-col">
                <h2 className="text-xl font-semibold">2,420</h2>
                <div className='flex items-center text-[#667085] text-[14px] gap-[10px]'>
                    <span className='text-[#027A48] text-[14px] font-[500]'>40% </span>

                    <span>vs last month</span>
                </div>
            </div>
        </div> */}
            </div>

            <div className='flex items-center w-full gap-[10px] justify-between'>
                <LineChart1 getCustomerData={getCustomerData} />
                <PieChart1 allOrdersData={allOrdersData} statusColors={statusColors}/>
            </div>

        </div>
    )
}

export default Dashboard
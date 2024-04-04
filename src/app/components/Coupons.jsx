import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from 'react-icons/md';
import axios from '../../../axios';
import Swal from 'sweetalert2'
import { useSnackbar } from '../SnackbarProvider';

const Coupons = () => {
  const { openSnackbar } = useSnackbar();

  const [couponType, setCouponType] = useState('Default');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState();
  const [maxDiscount, setMaxDiscount] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discount, setDiscount] = useState();
  const [maxUsePerUser, setMaxUsePerUser] = useState();
  const [maxUse, setMaxUse] = useState();
  const [customer, setCustomer] = useState(null);
  const [dealer, setDealer] = useState(null)
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [specificCouponTitle, setSpecificCouponTitle] = useState('');
  const [specificCouponCode, setSpecificCouponCode] = useState('');
  const [limitForSameUser, setLimitPerSameUser] = useState();
  const [specificMinOrderAmount, setSpecificMinOrderAmount] = useState();
  const [specificDiscountType, setSpecificDiscountType] = useState('');
  const [specificDiscount, setSpecificDiscount] = useState();
  const [specificStartDate, setSpecificStartDate] = useState('')
  const [specificExpiryDate, setSpecificExpiryDate] = useState('');
  const [specificCustomer, setSpecificCustomer] = useState(null);
  const [specificDealer, setSpecificDealer] = useState(null);
  const [specificMaxDiscount, setSpecificMaxDiscount] = useState('');

  const resetSpecificCouponFields = () => {
    setSpecificCouponTitle('');
    setSpecificCouponCode('');
    setLimitPerSameUser('');
    setSpecificMinOrderAmount('');
    setSpecificDiscountType('');
    setSpecificDiscount('');
    setSpecificStartDate('');
    setSpecificExpiryDate('');
    setSpecificCustomer('');
    setSpecificDealer('');
    setSpecificMaxDiscount('');
  };

  const handleCouponTypeChange = (e) => {
    setCouponType(e.target.value);
    resetSpecificCouponFields()
  };

  // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
  const [couponData, setCouponData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCouponData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchCouponData = useCallback(
    () => {
      axios.get('/api/get-all-coupons-admin')
        .then((res) => {
          if (res.data.status === 'success') {
            setCouponData(res.data.coupons)
            resetSpecificCouponFields()
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Attribute section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = couponData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = couponData.filter((e) =>
    e.coupon_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.coupon_type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-coupon-status?coupon_id=${id}`)
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchCouponData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------

  // ----------------------------------------------Delete car brands section Starts-----------------------------------------------------
  const deleteCoupon = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.coupon_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-coupon?coupon_id=${data.id}`)
          .then(res => {
            if (res.data.code == 200) {
              fetchCouponData()
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

  // ----------------------------------------------Delete Car brands section Ends-----------------------------------------------------



  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})



  const addCoupon = () => {
    const commonData = {
      coupon_type: couponType,
      coupon_title: couponTitle,
      coupon_name: couponCode,
      min_order_amount: minOrderAmount,
      max_discount: maxDiscount,
      discount_type: discountType,
      discount: discount,
      max_use_per_user: maxUsePerUser,
      max_use: maxUse,
      user_id: customer,
      dealer_id: dealer,
      start_date: startDate,
      expiry_date: expiryDate,
    };

    let specificData = {};

    if (couponType === 'Default') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        start_date: specificStartDate,
        expiry_date: specificExpiryDate,
      };
    }

    if (couponType === 'First Order') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        start_date: null,
        expiry_date: null,
      };
    }

    if (couponType === 'Free Delivery') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        start_date: specificStartDate,
        expiry_date: specificExpiryDate,
      };
    }

    if (couponType === 'Customer wise') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        user_id: specificCustomer,
        start_date: specificStartDate,
        expiry_date: specificExpiryDate,
      };
    }

    if (couponType === 'Subscribed Customer') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        start_date: specificStartDate,
        expiry_date: specificExpiryDate,
      };
    }

    if (couponType === 'Dealer Wise') {
      specificData = {
        coupon_title: specificCouponTitle,
        coupon_name: specificCouponCode,
        max_use_per_user: limitForSameUser,
        min_order_amount: specificMinOrderAmount,
        discount_type: specificDiscountType,
        discount: specificDiscount,
        max_discount: specificMaxDiscount,
        dealer_id: specificDealer,
        start_date: specificStartDate,
        expiry_date: specificExpiryDate,
      };
    }

    const postData = { ...commonData, ...specificData };

    axios.post('/api/add-coupons', postData)
      .then(res => {
        console.log(res);
        if (res.data.status === 'success') {
          fetchCouponData()
          openSnackbar(res.data.message, 'success');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }


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
            <span className='text-[30px] text-[#101828] font-[500]'>Coupons Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Type</span>
              <select name='category_id' onChange={handleCouponTypeChange} value={couponType}>
                <option>Select Coupon Type Here</option>
                <option>Default</option>
                <option>First Order</option>
                <option>Free Delivery</option>
                <option>Customer wise</option>
                <option>Subscribed Customer</option>
                <option>Dealer Wise</option>
              </select>
            </div>

            {couponType === 'Default' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='sub_category_name' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div>
              </>
            )}

            {couponType === 'First Order' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                {/* <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='sub_category_name' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div> */}
              </>
            )}

            {couponType === 'Free Delivery' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='sub_category_name' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div>
              </>
            )}

            {couponType === 'Customer wise' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='max_discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='startDate' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' name='expiryDate' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Customer</span>
                  <select name='selectCustomer' value={specificCustomer} onChange={(e) => setSpecificCustomer(e.target.value)} >
                    <option value=''>Select customer</option>
                    <option value='1'>subham</option>
                    <option value='2'>dibanjan</option>
                  </select>
                </div>
              </>
            )}

            {couponType === 'Subscribed Customer' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='max_discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='startDate' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' name='expiryDate' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div>
              </>
            )}

            {couponType === 'Dealer Wise' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Title</span>
                  <input type='text' placeholder='Coupon Title' className='inputText' name='coupon_title' value={specificCouponTitle} onChange={(e) => setSpecificCouponTitle(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Coupon Code</span>
                  <input type='text' placeholder='Coupon name' className='inputText' name='coupon_name' value={specificCouponCode} onChange={(e) => setSpecificCouponCode(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Limit for Same User</span>
                  <input type='text' placeholder='05' className='inputText' name='max_use_per_user' value={limitForSameUser} onChange={(e) => setLimitPerSameUser(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Minimum Purchase</span>
                  <input type='text' placeholder='minimum' className='inputText' name='min_order_amount' value={specificMinOrderAmount} onChange={(e) => setSpecificMinOrderAmount(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Discount Type</span>
                  <select name='category_id' value={specificDiscountType} onChange={(e) => setSpecificDiscountType(e.target.value)} >
                    <option value=''>Select Discount Type Here</option>
                    <option>Percent</option>
                    <option>Amount</option>
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  {specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? (
                    <span>{specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount</span>
                  ) : <span>Discount</span>}
                  <input
                    type='text'
                    placeholder={specificDiscountType === 'Percent' || specificDiscountType === 'Amount' ? `Enter ${specificDiscountType === 'Percent' ? 'Percentage' : 'Amount'} Discount` : 'Choose Discount type'}
                    className='inputText'
                    name='discount'
                    value={specificDiscount}
                    onChange={(e) => {
                      setSpecificDiscount(e.target.value);
                      if (specificDiscountType === 'Amount') {
                        setSpecificMaxDiscount(e.target.value);
                        setSpecificDiscount(e.target.value)
                      }
                    }}
                  />
                </div>
                {specificDiscountType === 'Percent' && (
                  <div className='flex flex-col space-y-1 w-full'>
                    <span>Maximum Discount</span>
                    <input type='text' placeholder='Enter Maximum discount' className='inputText' name='max_discount' value={specificMaxDiscount} onChange={(e) => setSpecificMaxDiscount(e.target.value)} />
                  </div>
                )}
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Start Date</span>
                  <input type='Date' className='inputText' name='startDate' value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Expiry Date</span>
                  <input type='Date' className='inputText' name='expiryDate' value={specificExpiryDate} onChange={(e) => setSpecificExpiryDate(e.target.value)} />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Dealer</span>
                  <select name='selectCustomer' value={specificDealer} onChange={(e) => setSpecificDealer(e.target.value)} >
                    <option value=''>Select Dealer</option>
                    <option value='1'>subham</option>
                    <option value='2'>dibanjan</option>
                  </select>
                </div>
              </>
            )}
            {/* <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Title</span>
              <input type='text' placeholder='Coupon Title' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Code</span>
              <input type='text' placeholder='Coupon name' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Limit for Same User</span>
              <input type='text' placeholder='05' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Use</span>
              <input type='text' placeholder='Max use of this coupon' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Type</span>
              <select name='category_id' >
                <option>Select Discount Type Here</option>
                <option>Percent</option>
                <option>Amount</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Amount</span>
              <input type='text' placeholder='505' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Minimum Purchase</span>
              <input type='text' placeholder='minimum' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Discount</span>
              <input type='text' placeholder='maximum' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Start Date</span>
              <input type='Date' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Expiry Date</span>
              <input type='Date' className='inputText' name='sub_category_name' />
            </div> */}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton'>Reset</span>
            <span className='submitButton' onClick={addCoupon}>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Coupons</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{couponData.length} Coupons</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px] ' />
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
                      <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Coupons</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Coupon Type</TableCell>
                      <TableCell style={{ minWidth: 250 }}>Duration</TableCell>
                      <TableCell style={{ minWidth: 100 }}>User Limit</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Status</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row, i) => (
                        <TableRow key={row.id} >
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            {row.coupon_name}
                          </TableCell>
                          <TableCell>
                            {row.coupon_type}
                          </TableCell>
                          <TableCell>
                            {row.start_date && row.expiry_date ? (
                              `${formatDate(row.start_date)} - ${formatDate(row.expiry_date)}`
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            {row.max_use_per_user}
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
                          <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteCoupon(row)} /></TableCell>
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
            <span className='text-[30px] text-[#101828] font-[500]'>Coupons Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Type </span>
              <select name='category_id' defaultValue={editData.coupon_type}>
                <option>Select Coupon Type Here</option>
                <option>Default</option>
                <option>First Order</option>
                <option>Free Delivery</option>
                <option>Customer wise</option>
                <option>Subscribed Customer</option>
                <option>Dealer Wise</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Title </span>
              <input type='text' placeholder='Horn' defaultValue={editData.coupon_title} className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Coupon Code </span>
              <input type='text' placeholder='Horn' defaultValue={editData.coupon_name} className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Limit for Same User </span>
              <input type='text' placeholder='Horn' className='inputText' defaultValue={editData.max_use_per_user} name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Minimum Purchase </span>
              <input type='text' placeholder='Horn' defaultValue={editData.min_order_amount} className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Start Date </span>
              <input type='Date' placeholder='Horn' defaultValue={new Date(editData.start_date).toISOString()} className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Expiry Date </span>
              <input type='Date' placeholder='Horn' defaultValue={editData.expiry_date} className='inputText' name='sub_category_name' />
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

export default Coupons
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import kingLogo from '../../../public/images/onlineKingLogo.svg'
import logo from '../../../public/images/logo.svg'
import dashboard from '../../../public/images/dashboard.svg'
import category from '../../../public/images/category.svg'
import product from '../../../public/images/product.svg'
import banner from '../../../public/images/banner.svg'
import { MdLogin, MdLogout } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from 'react-icons/fa6';
import RightSide from './RightSide';
import Dashboard from './Dashboard';
import Category from './Category';
import SubCategory from './SubCategory';
import SuperSubCategory from './SuperSubCategory';
import ProductAttribute from './ProductAttribute';
import ProductList from './ProductList';
import BulkImport from './BulkImport';
import CarList from './CarList';
import CarBrands from './CarBrands';
import CarModels from './CarModels';
import Orders from './Orders';
import Banners from './Banners';
import Coupons from './Coupons';
import Discounts from './Discounts';
import Installer from './Installer';
import Customers from './Customers';
import Dealers from './Dealers';
import Subscribed from './Subscribed';
import ProductBrands from './ProductBrands';
import StaticPages from './StaticPages';
import Stories from './Stories';
import DynamicPages from './DynamicPages';
import ProductReview from './ProductReview';
import ProductWithMulitpleCarBrands from './ProductWithMulitpleCarBrands';

const Sidebar = () => {

    const [activeComponent, setActiveComponent] = useState('dashboard'); // Initially set to 'dashboard'

    const handleMenuItemClick = (component) => {
        setActiveComponent(component);
    };



    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isCarOpen, setIsCarOpen] = useState(false);
    const [adminLogin, setAdminLogin] = useState(true)

   // let adminToken = localStorage.getItem('madhuitAdminToken');

   

    const toggleCategoryDropdown = () => {
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleProductDropdown = () => {
        setIsProductOpen(!isProductOpen);
    };

    const toggleCarBrandDropdown = () => {
        setIsCarOpen(!isCarOpen);
    };

    return (
        <div className='flex h-screen'>

            {/*------------------------------- Lest side Menu -------------------------------------*/}
            <div className="flex flex-col w-1/4 p-4 bg-[#fcf8ee] justify-between h-full text-white">
                <div className='flex items-center space-x-3 py-2'>
                    <Image src={kingLogo} width={50} height={50} alt='onlinKingLogo' />
                    <span className='text-black font-bold'>OnlineKing</span>
                </div>

                <ul className="space-y-3 text-black h-[100%] overflow-y-scroll">
                    <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'dashboard' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('dashboard')}>
                        <div className='flex items-center gap-[10px] '>
                            <Image src={dashboard} height={20} width={20} />
                            Dashboard
                        </div>
                    </li>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Product Management</span>
                        <li className='leftMenuHover p-[10px] rounded-[8px] cursor-pointer' onClick={toggleCategoryDropdown}>
                            <div className='flex items-center justify-between gap-[10px] ' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={category} height={20} width={20} />
                                    Category Setup
                                </div>
                                {isCategoryOpen ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                        </li>
                        {isCategoryOpen && (
                            <div className='flex flex-col space-y-1 py-2'>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'category' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('category')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Categories</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'subcategory' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('subcategory')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Sub Categories</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'supersubcategory' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('supersubcategory')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Super Sub Categories</span>
                                </div>
                            </div>
                        )}
                        
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px] cursor-pointer' onClick={toggleProductDropdown}>
                            <div className='flex items-center justify-between gap-[10px]' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={product} height={20} width={20} />
                                    Product Setup
                                </div>
                                {isProductOpen ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                        </li>
                        {isProductOpen && (
                            <div className='flex flex-col space-y-1 py-2'>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'productattribute' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('productattribute')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Product Attribute</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'productlist' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('productlist')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Product List</span>
                                </div>
                                {/* <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'multipleproduct' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('multipleproduct')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Multiple Products</span>
                                </div> */}
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'productbrand' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('productbrand')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Product Brands</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'bulkimport' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('bulkimport')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Bulk Import</span>
                                </div>
                            </div>
                        )}

                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px] cursor-pointer' onClick={toggleCarBrandDropdown}>
                            <div className='flex items-center justify-between gap-[10px]' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={product} height={20} width={20} />
                                    Car Make/Model
                                </div>
                                {isCarOpen ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                        </li>

                        {isCarOpen && (
                            <div className='flex flex-col space-y-1 py-2'>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'carbrand' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('carbrand')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Car Make</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'carmodel' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('carmodel')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Car Models</span>
                                </div>
                                {/* <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'carlist' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('carlist')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Car List</span>
                                </div> */}
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Promotion Management</span>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'banner' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('banner')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Banners
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'coupon' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('coupon')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Coupons
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'discount' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('discount')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Offers
                            </div>
                        </li>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Order Management</span>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'orders' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('orders')}>
                            <div className='flex items-center justify-between gap-[10px]' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={product} height={20} width={20} />
                                    Order Setup
                                </div>
                            </div>
                        </li>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Installer Setting</span>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'installer' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('installer')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Installer List
                            </div>
                        </li>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>System Setting</span>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'static' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('static')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Static pages
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'dynamic' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('dynamic')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Dynamic pages
                            </div>
                        </li>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>User Management</span>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'customer' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('customer')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Customer List
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'dealer' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('dealer')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Dealer List
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'subscribed' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('subscribed')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Subscribed Customers
                            </div>
                        </li>
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'stories' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('stories')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Customers Stories
                            </div>
                        </li>  
                        <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'review' ? 'activeLeftMenu' : ''}`} onClick={() => handleMenuItemClick('review')}>
                            <div className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Product Review
                            </div>
                        </li>
                    </div>
                </ul>


                <div className=' border-t border-slate-300'>
                    {
                        adminLogin ? 
                        <div className='flex space-x-3 justify-between items-center py-2'>
                        <div className='rounded-full'>
                            <Image src={kingLogo} height={50} width={50} alt='kingLogo' />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-black '>OnlineKing</span>
                            <span className='text-slate-400'>admin@gmail.com</span>
                        </div>
                        <Link className='pl-12' href='/login'>
                        <MdLogout  className='text-black text-[25px]' />

                        </Link>
                    </div>
                    :
                    <div className='flex space-x-3  items-center py-2 cursor-pointer'>
                        <div className='rounded-full'>
                            <Image src={kingLogo} height={50} width={50} alt='kingLogo' />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-black '>Login</span>
                            {/* <span className='text-slate-400'>admin@gmail.com</span> */}
                        </div>
                        <Link className='pl-12' href='/login'>
                        <MdLogin className='text-black text-[25px]' />

                        </Link>
                    </div>

                    }
                    
                </div>
            </div>



            {/* -------------------------- Right side screens ------------------------------- */}
            {activeComponent === 'dashboard' && <Dashboard />}

            {activeComponent === 'category' && <Category />}

            {activeComponent === 'subcategory' && <SubCategory />}

            {activeComponent === 'supersubcategory' && <SuperSubCategory />}

            {activeComponent === 'productattribute' && <ProductAttribute />}

            {activeComponent === 'productlist' && <ProductList />}

            {activeComponent === 'productbrand' && <ProductBrands />}

            {activeComponent === 'bulkimport' && <BulkImport />}

            {activeComponent === 'carbrand' && <CarBrands />}

            {activeComponent === 'carmodel' && <CarModels />}

            {activeComponent === 'carlist' && <CarList />}

            {activeComponent === 'banner' && <Banners />}

            {activeComponent === 'coupon' && <Coupons />}

            {activeComponent === 'discount' && <Discounts />}

            {activeComponent === 'orders' && <Orders />}

            {activeComponent === 'installer' && <Installer />}

            {activeComponent === 'customer' && <Customers />}

            {activeComponent === 'dealer' && <Dealers />}

            {activeComponent === 'subscribed' && <Subscribed />}

            {activeComponent === 'static' && <StaticPages />}

            {activeComponent === 'stories' && <Stories />}

            {activeComponent === 'dynamic' && <DynamicPages />}

            {activeComponent === 'review' && <ProductReview />}

            {/* {activeComponent === 'multipleproduct' && <ProductWithMulitpleCarBrands />} */}
        </div>
    )
}

export default Sidebar
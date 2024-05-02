import { Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { MdAdd, MdOutlineFileDownload } from 'react-icons/md'
import AddProductsWithMulitpleCarBrands from './AddProductsWithMulitpleCarBrands'

const ProductWithMulitpleCarBrands = () => {

    const [isClickedAddProduct, setIsClickedAddProduct] = useState(false)
    const handleAddNewProduct = () => {
        setIsClickedAddProduct(true)
    }

    return (
        <>
            <div className='px-[20px] py-[10px] space-y-5 container mx-auto w-[100%] overflow-y-scroll'>
                {!isClickedAddProduct && (
                    <>
                        <div className=' py-[10px] flex flex-col space-y-5'>
                            <div className='flex flex-col space-y-1'>
                                <span className='text-[30px] text-[#101828] font-[500]'>Products with Multiple Car Brands</span>
                                <span className='text-[#667085] font-[400] text-[16px]'>Simplify product management and presentation with Product Setup, ensuring a streamlined and visually compelling e-commerce storefront.</span>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-[10px]'>
                            <div className='flex flex-col space-y-1 w-full'>
                                <span className='text-[14px] font-[500] text-[#344054]'>Search by category</span>
                                <input
                                    type='text'
                                    placeholder='Seach By Category'
                                    className='inputText !text-[14px]'
                                />
                            </div>
                            <div className='flex flex-col space-y-1 w-full'>
                                <span className='text-[14px] font-[500] text-[#344054]'>Search by sub category</span>
                                <input
                                    type='text'
                                    placeholder='Search By Sub Category'
                                    className='inputText !text-[14px]'
                                />
                            </div>
                            <div className='flex flex-col space-y-1 w-full'>
                                <span className='text-[14px] font-[500] text-[#344054]'>Search by super sub category</span>
                                <input
                                    type='text'
                                    placeholder='Search By Super Sub Category'
                                    className='inputText !text-[14px]'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                            <div className='flex items-center px-3 justify-between'>
                                <div className='flex space-x-2 items-center'>
                                    <span className='text-[18px] font-[500] text-[#101828]'>Product List</span>
                                    <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'> Products</span>
                                </div>
                                <div className='flex items-center space-x-3 inputText w-[50%]'>
                                    <IoSearch className='text-[20px]' />
                                    <input
                                        type='text'
                                        className='outline-none focus-none !text-[14px] w-full'
                                        placeholder='Search By Product'
                                    />
                                </div>

                                <div className='flex space-x-2'>
                                    <div className='px-[16px] py-[10px] gap-[5px] flex items-center rounded-[8px] border border-[#D0D5DD] cursor-pointer hover:bg-[#cfaa4c] hover:text-[#fff] hover:border-none'>
                                        <MdOutlineFileDownload className='text-[20px] font-[600]' />
                                        <span className=' text-[14px] font-[600]'>Export</span>
                                    </div>
                                    <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleAddNewProduct}>
                                        <MdAdd className='text-[#fff] text-[20px] font-[600]' />
                                        <span className=' text-[14px] text-[#fff] font-[600]'>Add New Product</span>
                                    </div>
                                </div>
                            </div>
                            <Paper >
                                <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow className='!bg-[#F9FAFB]'>
                                                {/* Define your table header columns */}
                                                <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                                                <TableCell style={{ minWidth: 200 }}>Car Brand</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Product Image</TableCell>
                                                <TableCell style={{ minWidth: 300 }}>Product Name</TableCell>
                                                <TableCell style={{ minWidth: 300 }}>Category Name</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Stock</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Status</TableCell>
                                                <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow  >
                                                <TableCell>1</TableCell>
                                                <TableCell>Toyota</TableCell>
                                                <TableCell>
                                                    <Image src='' width={70} height={50} alt='image' className='rounded-[8px]' />
                                                </TableCell>
                                                <TableCell>Toyota</TableCell>
                                                <TableCell>Toyota</TableCell>
                                                <TableCell> 200</TableCell>
                                                <TableCell >
                                                    <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                                        <Image src="/images/active.svg" height={10} width={10} alt='active' />
                                                        <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={true}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{
                                                            '& .MuiSwitch-thumb': {
                                                                backgroundColor: true ? '#CFAA4C' : '',
                                                            },
                                                            '& .Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#CFAA4C',
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell ><FaRegTrashAlt className='cursor-pointer' /></TableCell>
                                                <TableCell><FaEdit className='cursor-pointer' /></TableCell>
                                            </TableRow>
                                        </TableBody>
                                        {/* <TableRow>
                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
                      </TableRow> */}
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                    </>
                )}

                {isClickedAddProduct && (
                    <AddProductsWithMulitpleCarBrands />
                )}
            </div>
        </>
    )
}

export default ProductWithMulitpleCarBrands

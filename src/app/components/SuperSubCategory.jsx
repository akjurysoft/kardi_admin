import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { useSnackbar } from '../SnackbarProvider';
import axios from '../../../axios';


import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const SuperSubCategory = () => {
  const { openSnackbar } = useSnackbar();

  const [getSuperSubCategoryName, setGetSuperSubCategoryName] = useState({
    sub_category_id: '',
    category_id: '',
    super_sub_category_name: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setGetSuperSubCategoryName(() => {
      return {
        ...getSuperSubCategoryName,
        [name]: value
      }
    })
  }

  const reset = () => {
    setGetSuperSubCategoryName({
      sub_category_id: '',
      category_id: '',
      super_sub_category_name: ''
    })
    setImage(null)
    setShowImage(null)

    document.getElementById('sub_category_id').value = ''
    document.getElementById('category_id').value = ''
    document.getElementById('super_sub_category_name').value = ''
    document.getElementById('image').value = ''
  }

  console.log('getSuperSubCategoryName', getSuperSubCategoryName)
  // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategoryData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-categories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setCategoryData(res.data.categories)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Category section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Sub Category section Starts-----------------------------------------------------
  const [subCategoryData, setSubCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchSubCategoryData()
    }

    return () => { unmounted = true };
  }, [getSuperSubCategoryName.category_id])

  const fetchSubCategoryData = useCallback(() => {
    let url = "/api/fetch-subcategories";
    if (getSuperSubCategoryName.category_id !== '') {
      url += `?category_id=${getSuperSubCategoryName.category_id}`;
    }
    axios.get(url, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then((res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          setSubCategoryData(res.data.subcategories)
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        if (err.response.data.error === 'Bad Request') {
          openSnackbar(err.response.data.message, 'error');
        }
      })
  }, [getSuperSubCategoryName.category_id])

  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------


  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchSuperSubCategoryData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchSuperSubCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-supersubcategories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.status === 'success') {
            setSuperSubCategoryData(res.data.superSubcategories)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Super Sub Category section Ends-----------------------------------------------------

  // ----------------------------------------------Add superSubCategory section Starts-----------------------------------------------------


  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);

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

  const handleRemoveImage = () => {
    setImage(null);
    setShowImage(null)
  };

  const handleAddSuperSubCategory = () => {
    const formData = new FormData();
    formData.append('sub_category_id', getSuperSubCategoryName.sub_category_id);
    formData.append('category_id', getSuperSubCategoryName.category_id);
    formData.append('super_sub_category_name', getSuperSubCategoryName.super_sub_category_name)
    formData.append('image', image);

    axios.post('/api/add-supersubcategory', formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchSuperSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImage(null)
          setShowImage(null)
          setGetSuperSubCategoryName({})
          reset()
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  // ----------------------------------------------Add superSubCategory section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const totalRows = superSubCategoryData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = superSubCategoryData.filter((e) =>
    e.super_sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-supersubcategory-status?super_sub_category_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchSuperSubCategoryData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------


  // ----------------------------------------------Delete Sub Category section Starts-----------------------------------------------------
  const deleteCategory = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.super_sub_category_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-supersubcategories?super_sub_category_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchSuperSubCategoryData()
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

  // ----------------------------------------------Delete Sub Category section Ends-----------------------------------------------------

  // const [isEditable, setIsEditable] = useState(false)
  // const [editData, setEditData] = useState({})
  // const handleEdit = (data) => {
  //   setEditData(data)
  //   setIsEditable(true)
  // }

  // const [getUpdateSuperSubCategoryData, setGetUpdateSuperSubCategoryData] = useState({
  //   category_id_edit: '',
  //   sub_category_id_edit: '',
  //   super_sub_category_name_edit: '',
  // })

  // const getDataForUpdate = (e) => {
  //   const { value, name } = e.target;

  //   setGetUpdateSuperSubCategoryData(() => {
  //     return {
  //       ...getUpdateSuperSubCategoryData,
  //       [name]: value
  //     }
  //   })
  // }

  // // Image uploading section
  // const [imageEdit, setImageEdit] = useState(null);
  // const [showImageEdit, setShowImageEdit] = useState(null);

  // const handleImageChangeEdit = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImageEdit(file);
  //       setShowImageEdit(e.target.result)
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemoveImageEdit = () => {
  //   setImageEdit(null);
  //   setShowImageEdit(null)
  // };

  // const handleUpdateSuperSubCategory = () => {
  //   const formData = new FormData();
  //   formData.append('super_sub_category_name', getUpdateSuperSubCategoryData.super_sub_category_name_edit);
  //   formData.append('super_sub_category_id', editData.id)
  //   formData.append('image', imageEdit);
  //   axios.post(`/api/edit-super-subcategory`, formData, {
  //     headers: {
  //       Authorization: localStorage.getItem('kardifyAdminToken'),
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  //     .then(res => {
  //       console.log(res)
  //       if (res.data.status === 'success') {
  //         fetchSuperSubCategoryData()
  //         openSnackbar(res.data.message, 'success');
  //         setImageEdit(null)
  //         setShowImageEdit(null)
  //         setEditData({})
  //         setIsEditable(false)
  //       } else {
  //         openSnackbar(res.data.message, 'error');
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       openSnackbar(err.response.data.message, 'error');
  //     })

  // }

  // const returnMain = () => {
  //   setIsEditable(false)
  //   setEditData({})
  // }

  const [getSuperSubCategoryEdit, setGetSuperSubCategoryEdit] = useState({
    edit_category_id: '',
    edit_sub_category_id: '',
    edit_super_sub_category_id: '',
    edit_super_sub_category_name: ''
  })

  const getEditData = (e) => {
    const { value, name } = e.target;

    setGetSuperSubCategoryEdit(() => {
      return {
        ...getSuperSubCategoryEdit,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [imageEdit, setImageEdit] = useState(null);
  const [showImageEdit, setShowImageEdit] = useState(null)

  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageEdit(file);
        setShowImageEdit(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageEdit = () => {
    setImageEdit(null);
    setShowImageEdit(null)
  };

  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setImageEdit(null)
    setShowImageEdit(null)
    setOpen1(false);
    setGetSuperSubCategoryEdit({
      edit_category_id: '',
      edit_sub_category_id: '',
      edit_super_sub_category_id: '',
      edit_super_sub_category_name: ''
    })
  };

  const [editData, setEditData] = useState({})

  console.log(editData)

  const handleEdit = (data) => {
    setOpen1(true)
    setEditData(data)
  }

  const handleEditSubCategory = () => {
    const formData = new FormData();
    formData.append('category_id', getSuperSubCategoryEdit.edit_category_id || editData.category_id)
    formData.append('sub_category_id', getSuperSubCategoryEdit.edit_sub_category_id || editData.sub_category_id)
    formData.append('super_sub_category_id', editData.id);
    formData.append('super_sub_category_name', getSuperSubCategoryEdit.edit_super_sub_category_name || editData.super_sub_category_name);
    if (imageEdit) {
      formData.append('image', imageEdit);
    }
    axios.post(`/api/edit-super-subcategory`, formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          fetchSuperSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImageEdit(null)
          setShowImageEdit(null)
          setEditData({})
          setOpen1(false)
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  return (
    <>
      <div className='px-[20px]  container mx-auto overflow-y-scroll'>
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Super Sub Category Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your product offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span>
          </div>

          <div className='flex items-center justify-between gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Category Name *</span>
              <select name='category_id' id='category_id' onChange={getData}>
                <option>Choose Category</option>
                {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category Name *</span>
              <select name='sub_category_id' id='sub_category_id' onChange={getData}>
                <option>Choose Sub Category</option>
                {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category Name *</span>
              <input type='text' placeholder='Ex: Horn' className='inputText' name='super_sub_category_name' id='super_sub_category_name' onChange={getData} />
            </div>


          </div>

          <div className='flex items-end gap-[24px] justify-between'>
            <div className='flex items-end gap-[10px]'>
              <div className='flex flex-col space-y-1 '>
                <span>Sub Category Image *</span>
                <input type='file' accept='image/*' id='image' onChange={handleImageChange} />
              </div>

              {showImage && (
                <div className="relative bg-[#D8C7B6] rounded-[8px]">
                  <img src={showImage} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                  <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                    <IoClose />
                  </span>
                </div>
              )}
            </div>
            <div className='flex items-center gap-[24px]'>
              <span className='resetButton' onClick={reset}>Reset</span>
              <span className='submitButton' onClick={handleAddSuperSubCategory}>Submit</span>
            </div>
          </div>

          <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Super Sub Category Table</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{superSubCategoryData.length} Super Sub Category</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search Super SubCategory Name here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table content here */}
            {/* <Paper > */}
            <TableContainer >
              <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 450 }}>
                <TableHead>
                  <TableRow className='!bg-[#F9FAFB]'>
                    {/* Define your table header columns */}
                    <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Category image</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Category Name</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Sub Category image</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Sub Category Name</TableCell>
                    <TableCell style={{ minWidth: 250 }}>Super Sub Category image</TableCell>
                    <TableCell style={{ minWidth: 250 }}>Super Sub Category Name</TableCell>
                    <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                    <TableCell style={{ minWidth: 100 }}>Delete</TableCell>
                    <TableCell style={{ minWidth: 100 }}>Edit</TableCell>
                  </TableRow>
                </TableHead>
                {filteredRows.length > 0 ?
                  <TableBody>
                    {paginatedRows.map((row , i) => (
                      <TableRow key={i} >
                        <TableCell>{startIndex + i + 1}</TableCell>
                        <TableCell style={{ minWidth: '100' }}>
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.category?.image_url}`} width={30} height={30} alt={row.category?.category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>{row.category?.category_name}</TableCell>
                        <TableCell>
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.subCategory?.image_url}`} width={30} height={30} alt={row.subCategory?.sub_category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>{row.subCategory?.sub_category_name}</TableCell>
                        <TableCell>
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={30} height={30} alt={row.super_sub_category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>{row.super_sub_category_name}</TableCell>
                        <TableCell>
                          {row.status ?
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
                            onChange={() => handleSwitchChange(row.id)}
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
                        <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteCategory(row)} /></TableCell>
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
            {/* </Paper> */}

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


        <BootstrapDialog
          onClose={handleClose1}
          aria-labelledby="customized-dialog-title"
          open={open1}
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Edit Super Sub Category
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose1}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <div className='flex flex-col space-y-2 mb-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Category</span>
              {/* <input type='text' defaultValue={editData.sub_category_name} className='inputText' placeholder='Ex: Colour' name='edit_sub_category_name' onChange={getEditData} /> */}
              <select defaultValue={editData.category_id} name='edit_category_id' onChange={getEditData}>
                <option>Choose Category</option>
                {categoryData && categoryData.map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>

            <div className='flex flex-col space-y-2 mb-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Sub Category</span>
              <select defaultValue={editData.sub_category_id} name='edit_sub_category_id' onChange={getEditData}>
                <option>Choose Sub Category</option>
                {subCategoryData && subCategoryData.map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>

            <div className='flex flex-col space-y-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Super Sub Category Name</span>
              <input type='text' defaultValue={editData.super_sub_category_name} className='inputText' placeholder='Ex: Colour' name='edit_super_sub_category_name' onChange={getEditData} />
            </div>

            <div className='flex flex-col space-y-2 py-5'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Category Image</span>
              <input type='file' accept='image/*' onChange={handleImageChangeEdit} />
            </div>

            {editData && (
              <div className="relative rounded-[8px]">
                <img src={showImageEdit || `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${editData.image_url}`} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                <span onClick={handleRemoveImageEdit} className={`absolute top-[-15px] bg-transparent text-black cursor-pointer ${!showImageEdit ? 'hidden' : 'block'}`}>
                  <IoClose />
                </span>
              </div>
            )}
          </DialogContent>
          <DialogActions className='justify-between'>
            <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
              Cancel
            </span>
            <span autoFocus onClick={handleEditSubCategory} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
              Save Changes
            </span>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  )
}

export default SuperSubCategory
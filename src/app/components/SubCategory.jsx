import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import axios from '../../../axios';
import { useSnackbar } from '../SnackbarProvider';
import { useRouter } from 'next/navigation';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const SubCategory = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()


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
          } else if (res.data.code === 400) {
            router.push('/login')
          }
        })
        .then(err => {
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
  }, [])

  const fetchSubCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-subcategories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories)
          } else if (res.data.message === 'Session expired' || res.data.code == 401) {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------

  // ----------------------------------------------Add subCategory section Starts-----------------------------------------------------
  const [getSubCategoryName, setGetSubCategoryName] = useState({
    sub_category_name: '',
    category_id: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setGetSubCategoryName(() => {
      return {
        ...getSubCategoryName,
        [name]: value
      }
    })
  }

  const reset = () => {
    setGetSubCategoryName({
      sub_category_name: '',
      category_id: ''
    })

    document.getElementById('sub_category_name').value = ''
    document.getElementById('category_id').value = ''
    document.getElementById('image').value = ''
    setImage(null)
    setShowImage(null)
  }

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

  const handleAddSubCategory = () => {
    // if (!image) {
    //   openSnackbar('Please Select Image', 'error');
    //   return;
    // }
    const formData = new FormData();
    formData.append('sub_category_name', getSubCategoryName.sub_category_name);
    formData.append('category_id', getSubCategoryName.category_id);
    if(image){
      formData.append('image', image);
    }

    axios.post('/api/add-subcategories', formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchSubCategoryData()
          openSnackbar(res.data.message, 'success');
          reset()
          setImage(null)
          setShowImage(null)
          setGetSubCategoryName({})
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  // ----------------------------------------------Add subCategory section Ends-----------------------------------------------------


  // ----------------------------------------------Pagination and Search Query section Starts-----------------------------------------------------
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const totalRows = subCategoryData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = subCategoryData.filter((e) =>
    e.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  // ----------------------------------------------Pagination and Search Query section Ends-----------------------------------------------------


  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-subcategory-status?sub_category_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchSubCategoryData()
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
      text: `Do you want to Delete this ${data.sub_category_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-subcategories?sub_category_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchSubCategoryData()
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

  // ----------------------------------------------Delete Sub Category section Starts-----------------------------------------------------

  // const [isEditable, setIsEditable] = useState(false)

  // const handleEdit = (data) => {
  //   console.log(data)
  //   setEditData(data)
  //   setIsEditable(true)
  // }

  // const handleUpdateSubCategory = () => {
  //   const formData = new FormData();
  //   formData.append('category_id', editData.category_id)
  //   formData.append('sub_category_id', editData.id)
  //   formData.append('sub_category_name', getSubCategoryName.editSubCategoryName || editData.sub_category_name);
  //   formData.append('image', image);
  //   axios.post(`/api/update-subcategories`, formData, {
  //     headers: {
  //       Authorization: localStorage.getItem('kardifyAdminToken'),
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  //     .then(res => {
  //       console.log(res)
  //       if (res.data.status === 'success') {
  //         fetchSubCategoryData()
  //         openSnackbar(res.data.message, 'success');
  //         setImage(null)
  //         setShowImage(null)
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

  const [getSubCategoryEdit, setGetSubCategoryEdit] = useState({
    edit_category_id: '',
    edit_sub_category_name: ''
  })

  const getEditData = (e) => {
    const { value, name } = e.target;

    setGetSubCategoryEdit(() => {
      return {
        ...getSubCategoryEdit,
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
    setGetSubCategoryEdit({
      edit_category_id: '',
      edit_sub_category_name: ''
    })
  };

  const [editData, setEditData] = useState({})

  const handleEdit = (data) => {
    setOpen1(true)
    setEditData(data)
  }

  const handleEditSubCategory = () => {
    const formData = new FormData();
    formData.append('category_id', getSubCategoryEdit.edit_category_id || editData.category_id)
    formData.append('sub_category_id', editData.id)
    formData.append('sub_category_name', getSubCategoryEdit.edit_sub_category_name || editData.sub_category_name);
    if (imageEdit) {
      formData.append('image', imageEdit);
    }
    axios.post(`/api/update-subcategories`, formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          fetchSubCategoryData()
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
            <span className='text-[30px] text-[#101828] font-[500]'>Sub Category Setup</span>
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
              <input type='text' placeholder='Ex: Accessories' className='inputText' id='sub_category_name' name='sub_category_name' onChange={getData} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category Image *</span>
              <input type='file' accept='image/*' id='image' onChange={handleImageChange} />
            </div>

            {showImage && (
              <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width='200' className='rounded-[8px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={reset}>Reset</span>
            <span className='submitButton' onClick={handleAddSubCategory}>Submit</span>
          </div>

          <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Sub Category Table</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{subCategoryData.length} Sub Categories</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search Sub category name / Category Name here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table content here */}
            {/* <div style={{ height: '400px', overflowY: 'auto' }}>  */}
            <TableContainer >
              <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow className='!bg-[#F9FAFB]'>
                    {/* Define your table header columns */}
                    <TableCell style={{ minWidth: 80 }}>Sl No</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Category Image</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Category Name</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Sub Category Image</TableCell>
                    <TableCell style={{ minWidth: 200 }}>Sub Category Name</TableCell>
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
                        <TableCell>{startIndex + i + 1}</TableCell>
                        <TableCell>
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.category.image_url}`} width={50} height={50} alt={row.category.category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>{row.category.category_name}</TableCell>
                        <TableCell>
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={50} height={50} alt={row.sub_category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>{row.sub_category_name}</TableCell>
                        <TableCell >
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
                            checked={row.status === 1}
                            onChange={() => handleSwitchChange(row.id)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                              '& .MuiSwitch-thumb': {
                                backgroundColor: row.status === 1 ? '#CFAA4C' : '',
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
            {/* </div> */}
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
          aria-labelledby="draggable-dialog-title"
          open={open1}
          fullWidth
          PaperComponent={PaperComponent}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="draggable-dialog-title">
            Edit Sub Category
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

            <div className='flex flex-col space-y-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Sub Category Name</span>
              <input type='text' defaultValue={editData.sub_category_name} className='inputText' placeholder='Ex: Colour' name='edit_sub_category_name' onChange={getEditData} />
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

export default SubCategory
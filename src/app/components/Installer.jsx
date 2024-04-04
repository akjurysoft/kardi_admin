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
// import { useSnackbar } from '../nackbarProvider';
import { useRouter } from 'next/navigation';
import Draggable from 'react-draggable';
import { useSnackbar } from '../SnackbarProvider';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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

const Installer = () => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter()






    // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
    const [installersData, setInstallersData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchInstallerData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchInstallerData = useCallback(
        () => {
            axios.get('/api/fetch-all-installers', {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setInstallersData(res.data.installers)
                    } else if (res.data.message === 'Session expired') {
                        router.push('/login')
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
    const rowsPerPage = 10;
    const totalRows = installersData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = installersData.filter((e) =>
        e.installer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    // ----------------------------------------------Add Installer section Starts-----------------------------------------------------

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        reset()
    };

    const [getInstallerData, setGetInstallerData] = useState({
        installer_name: '',
        installer_phone: '',
        installer_email: '',
        company_name: '',
        add1: '',
        add2: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
    })

    const reset = () => {
        setGetInstallerData({
            installer_name: '',
            installer_phone: '',
            installer_email: '',
            company_name: '',
            add1: '',
            add2: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        })

        document.getElementById('installer_name').value = ''
        document.getElementById('installer_phone').value = ''
        document.getElementById('installer_email').value = ''
        document.getElementById('company_name').value = ''
        document.getElementById('add1').value = ''
        document.getElementById('add2').value = ''
        document.getElementById('city').value = ''
        document.getElementById('state').value = ''
        document.getElementById('pincode').value = ''
        document.getElementById('country').value = ''
    }

    const getData = (e) => {
        const { value, name } = e.target;

        setGetInstallerData(() => {
            return {
                ...getInstallerData,
                [name]: value
            }
        })
    }

    const handleAddInstaller = () => {

        if (getInstallerData.installer_phone.length !== 10) {
            openSnackbar('Phone number must be 10 digits', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getInstallerData.installer_email)) {
            openSnackbar('Invalid email format', 'error');
            return;
        }
        if (getInstallerData.pincode.length !== 6) {
            openSnackbar('Pincode must be 6 digits', 'error');

            return;
        }

        axios.post('/api/add-installers', {
            installer_name: getInstallerData.installer_name,
            installer_phone: getInstallerData.installer_phone,
            installer_email: getInstallerData.installer_email,
            company_name: getInstallerData.company_name,
            add1: getInstallerData.add1,
            add2: getInstallerData.add2,
            city: getInstallerData.city,
            state: getInstallerData.state,
            country: getInstallerData.country,
            pincode: getInstallerData.pincode
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    fetchInstallerData()
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
        axios.post(`/api/update-installer-status?installer_id=${id}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchInstallerData()
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
            text: `Do you want to Delete this ${data.installer_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-installer?installer_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            fetchInstallerData()
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

    const [open1, setOpen1] = React.useState(false);
    const handleClickOpen1 = () => {
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
        setEditData({})
    };

    const [editData, setEditData] = useState({})
    console.log(editData)
    const handleEdit = (data) => {
        setEditData(data)
        handleClickOpen1()
        setGetEditInstallerData({})
    }

    const [getEditInstallerData, setGetEditInstallerData] = useState({
        edit_installer_name: '',
        edit_installer_phone: '',
        edit_installer_email: '',
        edit_company_name: '',
        edit_add1: '',
        edit_add2: '',
        edit_city: '',
        edit_state: '',
        edit_pincode: '',
        edit_country: ''
    })

    // const resetEdit = () => {
    //     setGetInstallerData({
    //         installer_name: '',
    //         installer_phone: '',
    //         installer_email: '',
    //         company_name: '',
    //         add1: '',
    //         add2: '',
    //         city: '',
    //         state: '',
    //         pincode: '',
    //         country: ''
    //     })

    //     document.getElementById('installer_name').value = ''
    //     document.getElementById('installer_phone').value = ''
    //     document.getElementById('installer_email').value = ''
    //     document.getElementById('company_name').value = ''
    //     document.getElementById('add1').value = ''
    //     document.getElementById('add2').value = ''
    //     document.getElementById('city').value = ''
    //     document.getElementById('state').value = ''
    //     document.getElementById('pincode').value = ''
    //     document.getElementById('country').value = ''
    // }

    const getDataEdit = (e) => {
        const { value, name } = e.target;

        setGetEditInstallerData(() => {
            return {
                ...getEditInstallerData,
                [name]: value
            }
        })
    }

    const handleEditInstaller = () => {
        if (getEditInstallerData.edit_installer_phone ? getEditInstallerData.edit_installer_phone.length !== 10 : '') {
            openSnackbar('Phone number must be 10 digits', 'error');
            return;
        }
        if (getEditInstallerData.edit_installer_email ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getEditInstallerData.edit_installer_email) :'') {
            openSnackbar('Invalid email format', 'error');
            return;
        }
        if (getEditInstallerData.edit_pincode ? getEditInstallerData.edit_pincode.length !== 6 : '') {
            openSnackbar('Pincode must be 6 digits', 'error');

            return;
        }

        axios.post('/api/edit-installer', {
            installer_id: editData.id,
            installer_name: getEditInstallerData.edit_installer_name || editData.installer_name,
            installer_phone: getEditInstallerData.edit_installer_phone || editData.installer_phone,
            installer_email: getEditInstallerData.edit_installer_email || editData.installer_email,
            company_name: getEditInstallerData.edit_company_name || editData.company_name,
            add1: getEditInstallerData.edit_add1 || editData.add1,
            add2: getEditInstallerData.edit_add2 || editData.add2,
            city: getEditInstallerData.edit_city || editData.city,
            state: getEditInstallerData.edit_state || editData.state,
            country: getEditInstallerData.edit_country || editData.country,
            pincode: getEditInstallerData.edit_pincode || editData.pincode,
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchInstallerData()
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
                if(err.response.data.status === 'error'){
                    openSnackbar(err.response.data.message, 'error');
                }
            })
    }

    const returnMain = () => {
        setIsEditable(false)
        setEditData({})
    }


    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Installer List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                </div>
            </div>

            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                <div className='flex items-center px-3 justify-between'>
                    <div className='flex space-x-2 items-center'>
                        <span className='text-[18px] font-[500] text-[#101828]'>Installer List</span>
                        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{installersData.length} Installer</span>
                    </div>
                    <div className='flex items-center space-x-3 inputText'>
                        <IoSearch className='text-[20px]' />
                        <input
                            type='text'
                            className='outline-none focus-none'
                            placeholder='Search here'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleClickOpen}>
                        <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                        <span className=' text-[16px] text-[#fff] font-[600]'>Add New Installer</span>
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
                                    <TableCell style={{ minWidth: 150 }}>Installer ID</TableCell>
                                    <TableCell style={{ minWidth: 200 }}>Installer Name</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Installer info</TableCell>
                                    <TableCell style={{ minWidth: 200 }}>Company Name</TableCell>
                                    <TableCell style={{ minWidth: 250 }}>Company Address</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>City</TableCell>
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
                                            <TableCell className='text-[#667085]'>{startIndex + i + 1}</TableCell>
                                            <TableCell className='text-[#667085] font-[600]'>
                                                {row.installer_id || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center space-x-2 text-[#667085] capitalize font-[600]' >
                                                    {/* <Image src='/images/logo.svg' alt='installer' width={30} height={50} className='rounded-[50%] object-cover h-[40px] w-[40px]' /> */}
                                                    <span>{row.installer_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col space-y-2 text-[#667085]'>
                                                    <span className='text-[14px] font-[400]'>{row.installer_phone || 'N/A'}</span>
                                                    <span className='text-[14px] font-[400]'>{row.installer_email || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                {row.company_name}
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                {row.add1}, {row.add2}, {row.city}, {row.state}, {row.country}, {row.pincode}
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                {row.city}
                                            </TableCell>
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

            {/*---------------------- add  Installer dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
                open={open}
                fullWidth
                PaperComponent={PaperComponent}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="draggable-dialog-title">
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
                    <div className='flex flex-col space-y-3'>
                        <div className="flex flex-col">
                            <span className='text-[#344054] text-[14px] font-[500]'>Installer Full Name</span>
                            <input type='text' className='inputText !text-[14px]' placeholder='Enter First Name' id='installer_name' name='installer_name' onChange={getData} />
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Installer Email</span>
                                <input type='email' className='inputText !text-[14px]' placeholder='Enter Installer Email' id='installer_email' name='installer_email' onChange={getData} />
                                {/* error message in red */}
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Installer Phone</span>
                                <input type='tel' className='inputText !text-[14px]' placeholder='Enter Installer Phone Number' id='installer_phone' name='installer_phone' onChange={getData} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-[#344054] text-[14px] font-[500]'>Company Name</span>
                            <input type='text' className='inputText !text-[14px]' placeholder='Company / Shop Name' name='company_name' id='company_name' onChange={getData} />
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Address 1</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='House No./ Building Name' name='add1' id='add1' onChange={getData} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Address 2</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Area / Landmark / Nearby' name='add2' id='add2' onChange={getData} />
                            </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>City</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter City' name='city' id='city' onChange={getData} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>State</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter State' name='state' id='state' onChange={getData} />
                            </div>
                        </div>
                        <div className='flex flex-row space-x-4'>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Pincode</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter Pincode' name='pincode' id='pincode' onChange={getData} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Country</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter Country' name='country' id='country' onChange={getData} />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleAddInstaller} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Submit
                    </span>
                </DialogActions>
            </BootstrapDialog>

            {/*---------------------- Edit  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose1}
                aria-labelledby="draggable-dialog-title"
                open={open1}
                fullWidth
                PaperComponent={PaperComponent}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="draggable-dialog-title">
                    Edit Installer Details
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
                    <div className='flex flex-col space-y-3'>
                        <div className="flex flex-col">
                            <span className='text-[#344054] text-[14px] font-[500]'>Installer Full Name</span>
                            <input type='text' className='inputText !text-[14px]' defaultValue={editData.installer_name} placeholder='Enter First Name' id='edit_installer_name' name='edit_installer_name' onChange={getDataEdit} />
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Installer Email</span>
                                <input type='email' className='inputText !text-[14px]' defaultValue={editData.installer_email} placeholder='Enter Installer Email' id='edit_installer_email' name='edit_installer_email' onChange={getDataEdit} />
                                {/* error message in red */}
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Installer Phone</span>
                                <input type='tel' className='inputText !text-[14px]' placeholder='Enter Installer Phone Number' defaultValue={editData.installer_phone} id='edit_installer_phone' name='edit_installer_phone' onChange={getDataEdit} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-[#344054] text-[14px] font-[500]'>Company Name</span>
                            <input type='text' className='inputText !text-[14px]' placeholder='Company / Shop Name' defaultValue={editData.company_name} name='edit_company_name' id='edit_company_name' onChange={getDataEdit} />
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Address 1</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='House No./ Building Name' defaultValue={editData.add1} name='edit_add1' id='edit_add1' onChange={getDataEdit} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Address 2</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Area / Landmark / Nearby' defaultValue={editData.add2} name='edit_add2' id='edit_add2' onChange={getDataEdit} />
                            </div>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>City</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter City' defaultValue={editData.city} name='edit_city' id='edit_city' onChange={getDataEdit} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>State</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter State' defaultValue={editData.state} name='edit_state' id='edit_state' onChange={getDataEdit} />
                            </div>
                        </div>
                        <div className='flex flex-row space-x-4'>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Pincode</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter Pincode' defaultValue={editData.pincode} name='edit_pincode' id='edit_pincode' onChange={getDataEdit} />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <span className='text-[#344054] text-[14px] font-[500]'>Country</span>
                                <input type='text' className='inputText !text-[14px]' placeholder='Enter Country' defaultValue={editData.country} name='edit_country' id='edit_country' onChange={getDataEdit} />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleEditInstaller} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Save Changes
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default Installer
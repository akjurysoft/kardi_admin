import React, { useCallback, useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import { FaRegEye, FaRegTrashAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import axios from '../../../axios';
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';
import Switch from '@mui/material/Switch';
import { useSnackbar } from '../SnackbarProvider';


const Subscribed = () => {

    const router = useRouter()
    const { openSnackbar } = useSnackbar();

    // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
    const [subscriberData, setSubscriberData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchSubscriberData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchSubscriberData = useCallback(
        () => {
            axios.get('/api/fetch-all-subscribers', {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setSubscriberData(res.data.subscribers)
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

    // ----------------------------------------------Fetch Attribute section Ends-----------------------------------------------------

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = subscriberData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = subscriberData.filter((e) =>
        e.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (id) => {
        axios.post(`/api/update-subscriber-status?subscriber_id=${id}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchSubscriberData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------
    // ----------------------------------------------Delete Subscriber section Starts-----------------------------------------------------
    const deleteSubscriber = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.email}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-subscriber?subscriber_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            fetchSubscriberData()
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

    // ----------------------------------------------Delete Subscriber section Ends-----------------------------------------------------


    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Subscribed Customers List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Elevate Customer Engagement: Harness the potential of the Subscribed Customers List in the admin application to personalize interactions, drive targeted marketing campaigns, and foster lasting connections with your loyal audience.</span>
                </div>
            </div>
            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                <div className='flex items-center px-3 justify-between'>
                    <div className='flex space-x-2 items-center'>
                        <span className='text-[18px] font-[500] text-[#101828]'>Subscribed Customers List</span>
                        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{subscriberData.length} Subscribed Customers</span>
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
                                    <TableCell>Sl No</TableCell>
                                    <TableCell >Email Id</TableCell>
                                    <TableCell style={{ minWidth: 50 }}>Status</TableCell>
                                    <TableCell style={{ minWidth: 50 }}>Change Status</TableCell>
                                    <TableCell >Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            {filteredRows.length > 0 ?
                                <TableBody>
                                    {paginatedRows.map((row, i) => (
                                        <TableRow key={i} >
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell className='text-[#667085]'>
                                                {row.email}
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
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
                                            <TableCell className='text-[#667085]'>
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
                                            <TableCell ><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteSubscriber(row)} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                :
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Subscribers found</TableCell>
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
    )
}

export default Subscribed
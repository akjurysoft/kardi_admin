import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, Switch, MenuItem, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions, DialogTitle, Checkbox } from '@mui/material';
import { FiPrinter } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import axios from '../../../axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../SnackbarProvider';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles';
import DescriptionCell from './DescriptionCell';
import { IoSearch } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { getAllCustomerData } from '../api';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



const Stories = () => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter()
    const tabNames = ["Normal / Text Stories", "Video Stories"];
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    // Image upload function
    const [uploadedImages, setUploadedImages] = useState([]);
    const [images, setImages] = useState([]);


    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const newImages = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                newImages.push(file);
                setUploadedImages((prevImages) => [...prevImages, e.target.result]);
                setImages(newImages);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newUploadedImages = [...uploadedImages];
        newUploadedImages.splice(index, 1);
        setUploadedImages(newUploadedImages);
    };


    const [imageStories, setImageStories] = useState([])
    const [videoStories, setVideoStories] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchStoriesData()
            fetchCustomerData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchStoriesData = useCallback(
        () => {
            axios.get('/api/fetch-all-stories', {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        const allStories = res.data.allStories;
                        const imageStories = allStories.filter(story => story.story_type === 'image');
                        const videoStories = allStories.filter(story => story.story_type === 'video');
                        setImageStories(imageStories);
                        setVideoStories(videoStories);
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

    // ----------------------image stories----------------------------------
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = imageStories.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = imageStories.filter((e) =>
        e.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.customer?.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // ----------------------video stories----------------------------------
    const [page1, setPage1] = useState(1);
    const rowsPerPage1 = 10;
    const totalRows1 = videoStories.length;
    const totalPages1 = Math.ceil(totalRows1 / rowsPerPage1);

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage);
    };

    const [searchQuery1, setSearchQuery1] = useState("");

    const filteredRows1 = videoStories.filter((e) =>
        e.heading.toLowerCase().includes(searchQuery1.toLowerCase()) ||
        e.customer.fullname.toLowerCase().includes(searchQuery1.toLowerCase())
    );
    const paginatedRows1 = filteredRows1.slice((page1 - 1) * rowsPerPage1, page1 * rowsPerPage1);

    // -----------------video dialog open------------------------------
    const [open, setOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({})

    const handleOpen = (data) => {
        setOpen(true);
        setSelectedVideo(data)
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVideo({})
    };




    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (data) => {
        axios.post(`/api/update-story-status?story_id=${data.id}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStoriesData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------

    // ----------------------------------------------Delete car brands section Starts-----------------------------------------------------
    const deleteStory = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.heading}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-story?story_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            fetchStoriesData()
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



    const handleApprove = (data) => {
        Swal.fire({
            title: "Approve!!",
            text: `Do you want to Approve this ${data.heading} Story?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "Close",
            confirmButtonText: "Yes! Approve it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/approve-story?story_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            fetchStoriesData()
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
    }



    const [rejectedData, setRejectedData] = useState({})
    const [open1, setOpen1] = useState(false);

    console.log('rejectedData', rejectedData)

    const handleReject = (data) => {
        setOpen1(true);
        setRejectedData(data)
    };
    const handleClose1 = () => {
        setOpen1(false);
        setRejectedData({})
    };

    const [getRejectedReason, setGetRejectedReason] = useState({
        rejected_reason_story: ''
    })

    const getRejectData = (e) => {
        const { value, name } = e.target;

        setGetRejectedReason(() => {
            return {
                ...getRejectedReason,
                [name]: value
            }
        })
    }

    const handleRejectStory = () => {
        if (getRejectedReason.rejected_reason_story === '') {
            openSnackbar('Enter a reason to Reject', 'error');
            return
        }
        axios.post('/api/reject-story', {
            story_id: rejectedData.id,
            rejected_reason: getRejectedReason.rejected_reason_story
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        }).
            then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStoriesData()
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    // Add Image stories section--------------------------------------
    const [getCustomerData, setGetCustomerData] = useState([])
    const fetchCustomerData = async () => {
        try {
            const customerData = await getAllCustomerData();
            setGetCustomerData(customerData.customers);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const [selectedCustomer, setSelectedCustomer] = useState({});
    console.log('selectedCustomer', selectedCustomer)
    const handleCustomerChange = (event) => {
        const customerId = parseInt(event.target.value, 10);
        if (getCustomerData.length > 0) {
            const selectedCustomerdata = getCustomerData.find(customer => customer.id === customerId);

            if (selectedCustomerdata) {
                setSelectedCustomer(selectedCustomerdata);
            } else {
                setSelectedCustomer({})
                openSnackbar(`Customer with id ${customerId} not found`, 'error');
            }
        } else {
            console.log('getCustomerData is empty or not loaded yet');
        }
    };


    const [openImage, setOpenImage] = useState(false)
    const handleOpenAddImage = () => {
        setOpenImage(true)
    }

    const handleCloseImage = () => {
        setOpenImage(false)
        setUploadedImage(null)
        setImage({})
        setSelectedCustomer({})
        resetImageField()
    }

    const fileInputRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [storyImage, setImage] = useState({})

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChangeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setUploadedImage(e.target.result);
            setImage(file)
        };

        reader.readAsDataURL(file);
    };

    const handleStoryImageRemove = () => {
        setUploadedImage(null);
        setImage({})
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const [addNewImageStoryData, setAddNewImageStory] = useState({
        imageHeading: '',
        imageDescription: ''
    })

    const resetImageField = () => {
        setAddNewImageStory({
            imageHeading: '',
            imageDescription: ''
        })
    }

    const getDataImageStory = (e) => {
        const { value, name } = e.target;

        setAddNewImageStory(() => {
            return {
                ...addNewImageStoryData,
                [name]: value
            }
        })
    }

    const addImageStory = () => {

        if (!selectedCustomer) {
            openSnackbar('Choose Customer', 'error')
        } else if (addNewImageStoryData.imageHeading === '') {
            openSnackbar('Fill the Heading', 'error')
        } else if (addNewImageStoryData.imageDescription === '') {
            openSnackbar('Fill the Description', 'error')
        } else if (!storyImage) {
            openSnackbar('Choose Image', 'error')
        } else {
            const formData = new FormData();

            formData.append('customer_id', selectedCustomer.id);
            formData.append('heading', addNewImageStoryData.imageHeading);
            formData.append('description', addNewImageStoryData.imageDescription);
            formData.append('image', storyImage);

            axios.post('/api/add-photo-stories', formData, {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken'),
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    if (res.data.status === 'success') {
                        openSnackbar(res.data.message, 'success')
                        fetchStoriesData()
                        handleCloseImage()
                    } else {
                        openSnackbar(res.data.message, 'error')
                    }
                })
                .catch(err => {
                    console.log(err)
                    openSnackbar(err.response.data.message, 'error')
                })
        }


    }

    // Add Video stories section--------------------------------------
    const [openVideo, setOpenVideo] = useState(false)
    const handleOpenAddVideo = () => {
        setOpenVideo(true)
    }

    const handleCloseVideo = () => {
        setOpenVideo(false)
        setSelectedCustomer({})
        resetVideoField()
        setVideo({})
        setUploadedVideo(null)
    }

    const fileInputRefVideo = useRef(null);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [storyVideo, setVideo] = useState({})

    const handleButtonClickVideo = () => {
        if (fileInputRefVideo.current) {
            fileInputRefVideo.current.click();
        }
    };

    const handleFileChangeVideo = (e) => {
        const file = e.target.files[0];
        setUploadedVideo(URL.createObjectURL(file));
        setVideo(file);
    };

    const handleStoryVideoRemove = () => {
        setUploadedVideo(null);
        setVideo({});
        if (fileInputRefVideo.current) {
            fileInputRefVideo.current.value = null;
        }
    };

    const [addNewVideoStoryData, setAddNewVideoStory] = useState({
        videoHeading: '',
        videoDescription: ''
    })

    const resetVideoField = () => {
        setAddNewVideoStory({
            videoHeading: '',
            videoDescription: ''
        })
    }

    const getDataVideoStory = (e) => {
        const { value, name } = e.target;

        setAddNewVideoStory(() => {
            return {
                ...addNewVideoStoryData,
                [name]: value
            }
        })
    }

    const addVideoStory = () => {

        if (!selectedCustomer) {
            openSnackbar('Choose Customer', 'error')
        } else if (addNewVideoStoryData.videoHeading === '') {
            openSnackbar('Fill the Heading', 'error')
        } else if (addNewVideoStoryData.videoDescription === '') {
            openSnackbar('Fill the Description', 'error')
        } else if (!storyVideo) {
            openSnackbar('Choose Image', 'error')
        } else {
            const formData = new FormData();

            formData.append('customer_id', selectedCustomer.id);
            formData.append('heading', addNewVideoStoryData.videoHeading);
            formData.append('description', addNewVideoStoryData.videoDescription);
            formData.append('video', storyVideo);

            axios.post('/api/add-video-stories', formData, {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken'),
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    if (res.data.status === 'success') {
                        openSnackbar(res.data.message, 'success')
                        fetchStoriesData()
                        handleCloseVideo()
                    } else {
                        openSnackbar(res.data.message, 'error')
                    }
                })
                .catch(err => {
                    console.log(err)
                    openSnackbar(err.response.data.message, 'error')
                })
        }
    }



    // edit story -----------------------------------------------------------------------
    const [editData, setEditData] = useState({})
    console.log('editData', editData)
    const handleView = (data) => {
        setEditData(data)
    }



    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const handleCheckboxChange = (event, productId) => {
        if (event.target.checked) {
            setSelectedProductIds(prevSelectedProductIds => [...prevSelectedProductIds, productId]);
        } else {
            setSelectedProductIds(prevSelectedProductIds => prevSelectedProductIds.filter(id => id !== productId));
        }
    };

    const fileInputRefEditVideo = useRef(null);
    const fileInputRefEditImage = useRef(null);
    const [uploadedEditVideo, setUploadedEditVideo] = useState(null);
    const [uploadedEditImage, setUploadedEditImage] = useState(null);
    const [editImage , setEditImage] = useState({})
    const [editVideo , setEditVideo] = useState({})

    const handleFileChangeEditVideo = (event) => {
        const file = event.target.files[0];
        setUploadedEditVideo(URL.createObjectURL(file));
        setEditVideo(file);
    };

    const handleButtonClickEditVideo = () => {
        if (fileInputRefEditVideo.current) {
            fileInputRefEditVideo.current.click();
        }
    };

    const handleStoryEditVideoRemove = () => {
        setUploadedEditVideo(null);
        setEditVideo({})
        if (fileInputRefEditVideo.current) {
            fileInputRefEditVideo.current.value = null;
        }
    };


    const handleButtonClickEditImage = () => {
        fileInputRefEditImage.current.click();
    };
    const handleFileChangeEditImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setUploadedEditImage(e.target.result);
            setEditImage(file)
        };

        reader.readAsDataURL(file);
    };

    const handleStoryEditImageRemove = () => {
        setUploadedEditImage(null);
        setEditImage({})
        if (fileInputRefEditImage.current) {
            fileInputRefEditImage.current.value = null;
        }
    };


    const handleEditStory = () => {
        const formData = new FormData();
        formData.append('story_id', editData.id);
        formData.append('customer_id', editData.customer_id);
        formData.append('heading', editData.heading);
        formData.append('description', editData.description);
        if(Object.keys(editImage).length){
            formData.append('image',  editImage);
        }
        if(Object.keys(editVideo).length){
            formData.append('image',  editVideo);
        }
        formData.append('product_ids', JSON.stringify(selectedProductIds));

        axios.post('/api/edit-story', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('kardifyAdminToken')
            },
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <>
            {!Object.keys(editData).length > 0 && (
                <div className='px-[20px] space-y-3 container mx-auto overflow-y-scroll'>
                    <div className=' py-[10px] flex flex-col space-y-5'>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-[30px] text-[#101828] font-[500]'>Customer Stories List</span>
                            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                        </div>
                    </div>

                    <div className="flex">
                        {tabNames.map((tabName, index) => (
                            <button
                                key={index}
                                style={{ whiteSpace: 'nowrap' }}
                                className={`px-[30px] py-[8px] w-full tab-btn text-[14px]  border-r-2 border-l-2 border-[#CFAA4C] font-[500] ${activeTab === index ? 'active bg-[#CFAA4C] text-[#fff]' : 'bg-[#FCF8EE]'}`}
                                onClick={() => handleTabClick(index)}
                            >
                                {tabName}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content py-3">
                        {tabNames.map((tabName, index) => (
                            <div key={index} className={`tab-pane ${activeTab === index ? 'active' : 'hidden'}`}>
                                {activeTab === index && (
                                    <>
                                        {tabName === "Normal / Text Stories" && (
                                            <>
                                                <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                                    <div className='flex items-center px-3 justify-between'>
                                                        <div className='flex space-x-2 items-center'>
                                                            <span className='text-[18px] font-[500] text-[#101828]'>Image Stories</span>
                                                            <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{imageStories.length} Image Stories</span>
                                                        </div>
                                                        <div className='flex items-center space-x-3 inputText w-[50%]'>
                                                            <IoSearch className='text-[20px]' />
                                                            <input
                                                                type='text'
                                                                className='outline-none focus-none w-full'
                                                                placeholder='Search here'
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleOpenAddImage}>
                                                            <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                                                            <span className=' text-[16px] text-[#fff] font-[600]'>Add New Image Stories</span>
                                                        </div>
                                                    </div>
                                                    <Paper >
                                                        <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                                            <Table stickyHeader aria-label="sticky table">
                                                                <TableHead>
                                                                    <TableRow className='!bg-[#F9FAFB]'>
                                                                        {/* Define your table header columns */}
                                                                        <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Customer Name</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Gender</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Customer Info</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Address</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Pincode</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Story Image</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Heading</TableCell>
                                                                        <TableCell style={{ minWidth: 400 }}>Description</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Approval Status</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Rejected Reason</TableCell>
                                                                        <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                                        <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                                        {/* <TableCell style={{ minWidth: 50 }}>Print</TableCell> */}
                                                                        <TableCell style={{ minWidth: 50 }}>View</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {filteredRows.length > 0 ?
                                                                    <TableBody>
                                                                        {paginatedRows.map((row, i) => (
                                                                            <TableRow key={i} >
                                                                                <TableCell>{i + 1}</TableCell>
                                                                                <TableCell>
                                                                                    {row.customer.fullname}
                                                                                </TableCell>
                                                                                <TableCell >
                                                                                    female
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                                        <span className='text-[14px] font-[400]'>{row.customer.phone}</span>
                                                                                        <span className='text-[14px] font-[400]'>{row.customer.email}</span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>560098</TableCell>
                                                                                <TableCell>560098</TableCell>
                                                                                <TableCell>
                                                                                    <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt={row.heading} className='rounded-[8px]' />
                                                                                    {/* <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt='categroy' className='rounded-[8px]' /> */}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.heading}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <DescriptionCell description={row.description} />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.is_approved === null && (
                                                                                        <div className='flex items-center gap-[15px]'>
                                                                                            <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row)}>
                                                                                                <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                                            </div>
                                                                                            <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleReject(row)}>
                                                                                                <span className='text-red-500 text-[12px] font-[500]'>Reject</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {row.is_approved == 1 && (
                                                                                        <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center ' >
                                                                                            <span className='text-[#027A48] text-[12px] font-[500]'>Approved</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {row.is_approved == 0 && (
                                                                                        <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center '>
                                                                                            <span className='text-red-500 text-[12px] font-[500]'>Rejected</span>
                                                                                        </div>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.is_approved == false ? row.rejected_reason : 'N/A'}
                                                                                </TableCell>
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
                                                                                        onChange={() => handleSwitchChange(row)}
                                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                                        disabled={row.is_approved === 0}
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
                                                                                <TableCell><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteStory(row)} /></TableCell>
                                                                                {/* <TableCell><FiPrinter className='text-[20px] cursor-pointer text-slate-500' /></TableCell> */}
                                                                                <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleView(row)} /></TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                    :
                                                                    <TableRow>
                                                                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Stories Found</TableCell>
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
                                            </>
                                        )}

                                        {tabName === "Video Stories" && (
                                            <>
                                                <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                                                    <div className='flex items-center px-3 justify-between'>
                                                        <div className='flex space-x-2 items-center'>
                                                            <span className='text-[18px] font-[500] text-[#101828]'>Video Stories</span>
                                                            <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{videoStories.length} Video Stories</span>
                                                        </div>
                                                        <div className='flex items-center space-x-3 inputText w-[50%]'>
                                                            <IoSearch className='text-[20px]' />
                                                            <input
                                                                type='text'
                                                                className='outline-none focus-none w-full'
                                                                placeholder='Search here'
                                                                value={searchQuery1}
                                                                onChange={(e) => setSearchQuery1(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleOpenAddVideo}>
                                                            <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                                                            <span className=' text-[16px] text-[#fff] font-[600]'>Add New Video Stories</span>
                                                        </div>
                                                    </div>
                                                    <Paper >
                                                        <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                                            <Table stickyHeader aria-label="sticky table">
                                                                <TableHead>
                                                                    <TableRow className='!bg-[#F9FAFB]'>
                                                                        {/* Define your table header columns */}
                                                                        <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Customer Name</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Gender</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Customer Info</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Address</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Pincode</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Story Image</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Heading</TableCell>
                                                                        <TableCell style={{ minWidth: 400 }}>Description</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Approval Status</TableCell>
                                                                        <TableCell style={{ minWidth: 200 }}>Rejected Reason</TableCell>
                                                                        <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                                        <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                                        <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                                        {/* <TableCell style={{ minWidth: 50 }}>Print</TableCell> */}
                                                                        <TableCell style={{ minWidth: 50 }}>View</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {filteredRows1.length > 0 ?
                                                                    <TableBody>
                                                                        {paginatedRows1.map((row, i) => (
                                                                            <TableRow key={i} >
                                                                                <TableCell>{i + 1}</TableCell>
                                                                                <TableCell>
                                                                                    {row.customer.fullname}
                                                                                </TableCell>
                                                                                <TableCell >
                                                                                    male
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                                        <span className='text-[14px] font-[400]'>{row.customer.phone}</span>
                                                                                        <span className='text-[14px] font-[400]'>{row.customer.email}</span>
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>560098</TableCell>
                                                                                <TableCell>560098</TableCell>
                                                                                <TableCell>
                                                                                    <>
                                                                                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                            <video src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width='100%' height='100%' alt={row.heading} className='rounded-[8px]' style={{ opacity: 0.5 }} />
                                                                                            <IconButton onClick={() => handleOpen(row)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                                                                                                <PlayArrowIcon />
                                                                                            </IconButton>
                                                                                        </div>
                                                                                    </>
                                                                                    {/* <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt='categroy' className='rounded-[8px]' /> */}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.heading}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <DescriptionCell description={row.description} />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.is_approved === null && (
                                                                                        <div className='flex items-center gap-[15px]'>
                                                                                            <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row)}>
                                                                                                <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                                            </div>
                                                                                            <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleReject(row)}>
                                                                                                <span className='text-red-500 text-[12px] font-[500]'>Reject</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {row.is_approved == 1 && (
                                                                                        <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center' >
                                                                                            <span className='text-[#027A48] text-[12px] font-[500]'>Approved</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {row.is_approved == 0 && (
                                                                                        <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center'>
                                                                                            <span className='text-red-500 text-[12px] font-[500]'>Rejected</span>
                                                                                        </div>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.is_approved == false ? row.rejected_reason : 'N/A'}
                                                                                </TableCell>
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
                                                                                        onChange={() => handleSwitchChange(row)}
                                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                                        disabled={row.is_approved === 0}
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
                                                                                <TableCell><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteStory(row)} /></TableCell>
                                                                                {/* <TableCell><FiPrinter className='text-[20px] cursor-pointer text-slate-500' /></TableCell> */}
                                                                                <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleView(row)} /></TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                    :
                                                                    <TableRow>
                                                                        <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Stories Found</TableCell>
                                                                    </TableRow>
                                                                }
                                                            </Table>
                                                        </TableContainer>
                                                    </Paper>

                                                    {filteredRows1.length > rowsPerPage1 && (
                                                        <div className='flex justify-center mt-3'>
                                                            <Pagination
                                                                count={totalPages1}
                                                                page={page1}
                                                                onChange={handleChangePage1}
                                                                shape="rounded"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                    </>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Add Image Story Section */}
                    <Dialog open={openImage} fullWidth onClose={handleCloseImage}>
                        <DialogTitle className='flex justify-between items-center'>
                            Add New Image Stories
                            <CloseIcon onClick={handleCloseImage} className='cursor-pointer' />
                        </DialogTitle>
                        <DialogContent>
                            <div className='flex flex-col space-y-3'>
                                <div className='flex flex-col space-y-1'>
                                    <span className='font-[600] text-[16px]'>Select Customer</span>
                                    <select id='selectcustomer' onChange={handleCustomerChange}>
                                        <option value='0'>Select Customer</option>
                                        {getCustomerData && getCustomerData.map((e, i) =>
                                            <option key={i} value={e.id}>{e.fullname}</option>
                                        )}
                                    </select>
                                </div>
                                {Object.keys(selectedCustomer).length > 0 && (
                                    <>
                                        <div className='border rounded-[8px] p-[10px] flex flex-col space-y-2'>
                                            <span className='font-[600] text-[16px]'>Customer Information</span>
                                            <div className='flex flex-col space-y-1'>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.fullname}</span>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.email}</span>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.phone}</span>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='flex flex-col space-y-1'>
                                                <span className='font-[600] text-[16px]'>Heading</span>
                                                <input className='inputText !text-[14px]' type='text' placeholder='Story Heading' name='imageHeading' id='imageHeading' onChange={getDataImageStory} />
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-1'>
                                            <span className='font-[600] text-[16px]'>Story Description</span>
                                            <textarea className='inputText !text-[14px]' type='text' placeholder='Story Description' name='imageDescription' id='imageDescription' onChange={getDataImageStory} />
                                        </div>

                                        <div className="flex flex-col items-center justify-center text-[16px]">
                                            <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                                                <div className="text-[40px]">
                                                    <FaCloudUploadAlt />
                                                </div>
                                                <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                                                <span className="mt-2 text-[10px] font-bold">OR</span>
                                                <button
                                                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                                                    onClick={handleButtonClick}
                                                >
                                                    Click to Upload
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleFileChangeImage}
                                                    accept='image/*'
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center mt-3">
                                                {uploadedImage && (
                                                    <div className="p-2 relative">
                                                        <img src={uploadedImage} alt="Uploaded Website Banner" className="max-w-[80px] max-h-[80px]" />
                                                        <button
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                            onClick={handleStoryImageRemove}
                                                        >
                                                            <FaTimes className='text-[10px]' />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-[24px] justify-center'>
                                            <span className='resetButton' >Reset</span>
                                            <span className='submitButton' onClick={addImageStory}>Submit</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Add Video Story Section */}
                    <Dialog open={openVideo} fullWidth onClose={handleCloseVideo}>
                        <DialogTitle className='flex justify-between items-center'>
                            Add New Video Stories
                            <CloseIcon onClick={handleCloseVideo} className='cursor-pointer' />
                        </DialogTitle>
                        <DialogContent>
                            <div className='flex flex-col space-y-3'>
                                <div className='flex flex-col space-y-1'>
                                    <span className='font-[600] text-[16px]'>Select Customer</span>
                                    <select id='selectcustomer' onChange={handleCustomerChange}>
                                        <option value='0'>Select Customer</option>
                                        {getCustomerData && getCustomerData.map((e, i) =>
                                            <option key={i} value={e.id}>{e.fullname}</option>
                                        )}
                                    </select>
                                </div>
                                {Object.keys(selectedCustomer).length > 0 && (
                                    <>
                                        <div className='border rounded-[8px] p-[10px] flex flex-col space-y-2'>
                                            <span className='font-[600] text-[16px]'>Customer Information</span>
                                            <div className='flex flex-col space-y-1'>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.fullname}</span>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.email}</span>
                                                <span className='text-[14px] font-[500] text-[#667085]'>{selectedCustomer.phone}</span>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='flex flex-col space-y-1'>
                                                <span className='font-[600] text-[16px]'>Heading</span>
                                                <input className='inputText !text-[14px]' type='text' placeholder='Story Heading' name='videoHeading' id='videoHeading' onChange={getDataVideoStory} />
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-1'>
                                            <span className='font-[600] text-[16px]'>Story Description</span>
                                            <textarea className='inputText !text-[14px]' type='text' placeholder='Story Description' name='videoDescription' id='videoDescription' onChange={getDataVideoStory} />
                                        </div>

                                        <div className="flex flex-col items-center justify-center text-[16px]">
                                            <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                                                <div className="text-[40px]">
                                                    <FaCloudUploadAlt />
                                                </div>
                                                <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                                                <span className="mt-2 text-[10px] font-bold">OR</span>
                                                <button
                                                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                                                    onClick={handleButtonClickVideo}
                                                >
                                                    Click to Upload
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRefVideo}
                                                    className="hidden"
                                                    onChange={handleFileChangeVideo}
                                                    accept='video/*'
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center mt-3">
                                                {uploadedVideo && (
                                                    <div className="p-2 relative">
                                                        <video className="max-w-[150px] max-h-[80px]" >
                                                            <source src={uploadedVideo} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                        <button
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                            onClick={handleStoryVideoRemove}
                                                        >
                                                            <FaTimes className='text-[10px]' />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-[24px] justify-center'>
                                            <span className='resetButton' >Reset</span>
                                            <span className='submitButton' onClick={addVideoStory}>Submit</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={open} fullWidth onClose={handleClose}>
                        <DialogContent>
                            <IconButton onClick={handleClose} style={{ position: 'absolute', top: 0, right: 5, zIndex: 2 }}>
                                <CloseIcon />
                            </IconButton>
                            <video width='100%' height='100%' controls className='p-[10px]'>
                                <source src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${selectedVideo.image_url}`} type="video/mp4" className='rounded-[8px]' />
                                Your browser does not support the video tag.
                            </video>
                        </DialogContent>
                    </Dialog>


                    {/*---------------------- Reject Stories dialog ------------------------*/}
                    <BootstrapDialog
                        onClose={handleClose1}
                        aria-labelledby="customized-dialog-title"
                        open={open1}
                        fullWidth
                    >
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Reject Story
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
                                <span className='text-[#344054] text-[14px] font-[500]'>Reason:</span>
                                <textarea className='inputText !text-[14px]' placeholder='Reason for rejection' name='rejected_reason_story' onChange={getRejectData} />
                            </div>
                        </DialogContent>
                        <DialogActions className='justify-between'>
                            <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                                Close
                            </span>
                            <span autoFocus className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70' onClick={handleRejectStory}>
                                Reject Story
                            </span>
                        </DialogActions>
                    </BootstrapDialog>
                </div>
            )}

            {Object.keys(editData).length > 0 && editData.id && (
                <div className='px-[20px] space-y-5 container mx-auto overflow-y-scroll'>
                    <div className=' py-[10px] flex flex-col space-y-5'>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-[30px] text-[#101828] font-[500]'>Edit Stories List</span>
                            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                        </div>
                    </div>

                    <div className='flex gap-[10px] items-center'>
                        <div className='flex flex-col w-4/5 space-y-3'>
                            <div className='flex flex-col space-y-1 w-full'>
                                <span>Heading</span>
                                <input type='text' placeholder='Heading' className='inputText !text-[14px]' id='heading' name='heading' defaultValue={editData.heading} />
                            </div>
                            <div className='flex flex-col space-y-1 w-full'>
                                <span>Story Description </span>
                                <textarea type='text' placeholder='Description' className='inputText !text-[14px]' id='description' name='description' defaultValue={editData.description} />
                            </div>
                            <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                                <div className="text-[40px]">
                                    <FaCloudUploadAlt />
                                </div>
                                <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                                <span className="mt-2 text-[10px] font-bold">OR</span>
                                {editData.story_type === 'video' ? (
                                    <>
                                        <button
                                            className='text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300'
                                            onClick={handleButtonClickEditVideo}
                                        >
                                            Click to Upload Video
                                        </button>
                                        <input
                                            type='file'
                                            ref={fileInputRefEditVideo}
                                            className='hidden'
                                            onChange={handleFileChangeEditVideo}
                                            accept='video/*'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className='text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300'
                                            onClick={handleButtonClickEditImage}
                                        >
                                            Click to Upload Image
                                        </button>
                                        <input
                                            type='file'
                                            ref={fileInputRefEditImage}
                                            className='hidden'
                                            onChange={handleFileChangeEditImage}
                                            accept='image/*'
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <>
                                {editData.story_type === 'video' ?
                                    <>
                                        {editData && (
                                            <div className="p-2 relative">
                                                <video className="max-w-[200px] max-h-[200px]" >
                                                    <source src={uploadedEditVideo} type="video/mp4"/>
                                                    Your browser does not support the video tag.
                                                </video>
                                                <button
                                                    className={`absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 ${uploadedEditVideo ? 'block' : 'hidden'}`}
                                                    onClick={handleStoryEditVideoRemove}
                                                >
                                                    <FaTimes className='text-[10px]' />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                    :
                                    <>
                                        {editData && (
                                            <div className="p-2 relative">
                                                <img src={uploadedEditImage || `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${editData.image_url}`} alt="Uploaded Website Banner" className="max-w-[200px] max-h-[200px]" />
                                                <button
                                                    className={`absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 ${uploadedEditImage ? 'block' : 'hidden'}`}
                                                    onClick={handleStoryEditImageRemove}
                                                >
                                                    <FaTimes className='text-[10px]' />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                }
                            </>
                        </div>
                    </div>
                    <Paper className='w-full'>
                        <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow className='!bg-[#F9FAFB]'>
                                        {/* Define your table header columns */}
                                        <TableCell style={{ minWidth: 30 }}></TableCell>
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
                                    {editData.customer.orders && editData.customer.orders.map((order, index) => (
                                        <React.Fragment key={index}>
                                            {order.order_details.map((orderDetail, detailIndex) => (
                                                <TableRow key={detailIndex}>
                                                    <TableCell>
                                                        <Checkbox onChange={(event) => handleCheckboxChange(event, orderDetail.product.id)} />
                                                    </TableCell>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        {orderDetail.product_images.length > 0 && (
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${orderDetail.product_images[0].image_url}`}
                                                                width={50}
                                                                height={40}
                                                                alt={orderDetail.product.product_name}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{orderDetail.product.product_name}</TableCell>
                                                    <TableCell>{orderDetail.quantity}</TableCell>
                                                    <TableCell>{orderDetail.sub_total}</TableCell>
                                                    <TableCell>₹ {orderDetail.sub_total}</TableCell>
                                                    <TableCell>{orderDetail.total_amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    <div className='flex items-center gap-[24px] justify-center'>
                        <span className='resetButton' onClick={() => setEditData({})}>Back</span>
                        <span className='submitButton' onClick={handleEditStory}>Update Story</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default Stories
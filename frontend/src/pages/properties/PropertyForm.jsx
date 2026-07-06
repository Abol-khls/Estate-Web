import { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Stack,
     Box,
    Button,
    IconButton,
    Card,
    CardMedia,
    Chip
} from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppCheckbox from "../../components/common/AppCheckbox";
import AppSelect from "../../components/common/AppSelect";
import {
    PROPERTY_TYPES,
    TRANSACTION_TYPES
} from "../../constants/propertyOptions";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import DeleteIcon from "@mui/icons-material/Delete";



import VideoUploader from "../../components/properties/VideoUploader";

import ImageUploader from "../../components/properties/ImageUploader";

import { useParams } from "react-router-dom";

import { MenuItem } from "@mui/material";



export default function PropertyForm() {

    const [form, setForm] = useState({

        code: "",
        title: "",

        property_type: "",
        transaction_type: "",

        price: "",
        area: "",
        rooms: "",

        floor: "",
        total_floors: "",
        year_built: "",

        parking: false,
        elevator: false,
        storage: false,

        address: "",
        description: "",

    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);

    const [existingVideos, setExistingVideos] = useState([]);
    const [newVideos, setNewVideos] = useState([]);
    const [deletedVideos, setDeletedVideos] = useState([]);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        if (!isEdit) return;

        async function loadProperty() {

            try {

                const response = await api.get(
                    `properties/${id}/`
                );

                setForm({

                    code: response.data.code,
                    title: response.data.title,
                    property_type: response.data.property_type,
                    transaction_type: response.data.transaction_type,
                    price: response.data.price,
                    area: response.data.area,
                    rooms: response.data.rooms,
                    floor: response.data.floor ?? "",
                    total_floors: response.data.total_floors ?? "",
                    year_built: response.data.year_built ?? "",
                    parking: response.data.parking,
                    elevator: response.data.elevator,
                    storage: response.data.storage,
                    address: response.data.address,
                    description: response.data.description,

                });
                setExistingImages(response.data.images || []);
                setNewImages([]);

                setExistingVideos(response.data.videos || []);
                setNewVideos([]);



            }

            catch (error) {

                console.log(error);

            }

        }

        loadProperty();

    }, [id, isEdit]);



    function handleChange(e) {

        const { name, value } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    }



    function handleCheckbox(e) {

        const { name, checked } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: checked

        }));
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));

    }
    function handleImages(e) {

        setNewImages(
            [...e.target.files]
        );
        setErrors(prev => ({
            ...prev,
            images: ""
        }));

    }


    function handleVideos(e) {

        setVideos(
            [...e.target.files]
        );

    }

    function handleRemoveImage(image) {

        if (!image.isNew && image.id) {
            setDeletedImages(prev => [...prev, image.id]);

            setExistingImages(prev =>
                prev.filter(img => img.id !== image.id)
            );
        }

    }

    function handleRemoveVideo(video, index, isNew) {

        if (isNew) {

            URL.revokeObjectURL(video.preview);

            setNewVideos(prev =>
                prev.filter((_, i) => i !== index)
            );

        } else {

            setDeletedVideos(prev => [

                ...prev,

                video.id

            ]);

            setExistingVideos(prev =>
                prev.filter(v => v.id !== video.id)
            );

        }

    }

    function handleRemoveExisting(image, index) {

        setDeletedImages(prev => [
            ...prev,
            image.id
        ]);

        setExistingImages(prev =>
            prev.filter((_, i) => i !== index)
        );

    }

    function validateForm() {

        const newErrors = {};

        if (!form.code.trim()) {
            newErrors.code = "کد ملک الزامی است";
        }

        if (!form.title.trim()) {
            newErrors.title = "عنوان الزامی است";
        }

        if (!form.property_type) {
            newErrors.property_type = "نوع ملک را انتخاب کنید";
        }

        if (!form.transaction_type) {
            newErrors.transaction_type = "نوع معامله را انتخاب کنید";
        }

        if (!form.price) {
            newErrors.price = "قیمت الزامی است";
        }

        if (!form.area) {
            newErrors.area = "متراژ الزامی است";
        }

        if (!form.rooms) {
            newErrors.rooms = "تعداد اتاق الزامی است";
        }

        if (!form.address.trim()) {
            newErrors.address = "آدرس الزامی است";
        }





        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleNumberChange(e) {

        const { name, value } = e.target;

        if (/^\d*$/.test(value)) {

            setForm(prev => ({
                ...prev,
                [name]: value
            }));

        }

    }

    const handleSetCover = async (imageId) => {

        try {

            await api.post(
                `properties/${id}/set_cover/`,
                {
                    image_id: imageId
                }
            );

            setExistingImages(prev =>
                prev.map(image => ({
                    ...image,
                    is_cover: image.id === imageId
                }))
            );

        } catch (error) {

            console.log(error);

        }

    };

    async function handleSubmit(e) {

        e.preventDefault();
        console.log("Submit Clicked");

        if (!validateForm()) {
            return;
        }
        console.log("1");

        try {


            const formData = new FormData();

            console.log("2");

            Object.keys(form).forEach(key => {

                const value = form[key];

                if (
                    ["floor", "total_floors", "year_built", "description"].includes(key)
                    && value === ""
                ) {
                    return;
                }

                formData.append(key, value);

            });
            console.log("3");

            newImages.forEach(image => {
                formData.append("images", image.file ?? image);
            });
            console.log("4");

            newVideos.forEach(video => {
                formData.append("videos", video.file);
            });
            console.log("5");

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            formData.append(
                "deleted_images",
                JSON.stringify(deletedImages)
            );
            console.log("6");
            formData.append(

                "deleted_videos",

                JSON.stringify(deletedVideos)

            );
            console.log("7");

            console.log("Before API Request");


            if (isEdit) {


                await api.patch(
                    `properties/${id}/`,
                    formData
                );

            } else {

                await api.post(
                    "properties/",
                    formData
                );

            }

            navigate("/properties");


        } catch (error) {

            console.log(error.response?.data);

        }

    }




    return (

        <PageContainer>

            <PageHeader
                title={
                    isEdit
                        ? "ویرایش ملک"
                        : "افزودن ملک"
                }
            />


            <form onSubmit={handleSubmit}>


                <Grid container spacing={2}>


                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField

                            label="کد ملک"

                            name="code"

                            value={form.code}

                            onChange={handleChange}
                            error={!!errors.code}
                            helperText={errors.code}

                        />
                    </Grid>



                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppTextField

                            label="عنوان"

                            name="title"

                            value={form.title}

                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}

                        />

                    </Grid>



                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppSelect

                            label="نوع ملک"

                            name="property_type"

                            value={form.property_type}

                            onChange={handleChange}
                            error={!!errors.property_type}
                            helperText={errors.property_type}

                        >


                            <MenuItem value="">
                                انتخاب کنید
                            </MenuItem>

                            {PROPERTY_TYPES.map(item => (

                                <MenuItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </MenuItem>

                            ))}


                        </AppSelect>


                    </Grid>




                    <Grid size={{ xs: 12, md: 6 }}>


                        <AppSelect

                            label="نوع معامله"

                            name="transaction_type"

                            value={form.transaction_type}

                            onChange={handleChange}
                            error={!!errors.transaction_type}
                            helperText={errors.transaction_type}

                        >

                            <MenuItem value="">
                                انتخاب کنید
                            </MenuItem>

                            {TRANSACTION_TYPES.map(item => (

                                <MenuItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </MenuItem>

                            ))}


                        </AppSelect>


                    </Grid>




                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="قیمت"

                            name="price"

                            value={form.price}

                            onChange={handleNumberChange}
                            error={!!errors.price}
                            helperText={errors.price}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}

                        />

                    </Grid>




                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="متراژ"

                            name="area"

                            value={form.area}

                            onChange={handleNumberChange}
                            error={!!errors.area}
                            helperText={errors.area}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="طبقه"
                            name="floor"
                            type="number"
                            value={form.floor}
                            onChange={handleNumberChange}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}
                        />

                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="تعداد طبقات"
                            name="total_floors"
                            type="number"
                            value={form.total_floors}
                            onChange={handleNumberChange}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}
                        />

                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="سال ساخت"
                            name="year_built"
                            type="number"
                            value={form.year_built}
                            onChange={handleNumberChange}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}
                        />

                    </Grid>



                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="اتاق"

                            name="rooms"

                            value={form.rooms}

                            onChange={handleNumberChange}
                            error={!!errors.rooms}
                            helperText={errors.rooms}
                            type="text"
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric"
                                }
                            }}

                        />

                    </Grid>




                    <Grid size={{ xs: 12 }}>

                        <AppTextField

                            label="آدرس"

                            name="address"

                            multiline

                            rows={3}

                            value={form.address}

                            onChange={handleChange}
                            error={!!errors.address}
                            helperText={errors.address}

                        />

                    </Grid>




                    <Grid size={{ xs: 12 }}>

                        <AppTextField

                            label="توضیحات"

                            name="description"

                            multiline

                            rows={4}

                            value={form.description}

                            onChange={handleChange}

                        />

                    </Grid>




                    <Grid size={{ xs: 12 }}>


                        <AppCheckbox

                            label="پارکینگ"

                            name="parking"

                            checked={form.parking}

                            onChange={handleCheckbox}

                        />


                        <AppCheckbox

                            label="آسانسور"

                            name="elevator"

                            checked={form.elevator}

                            onChange={handleCheckbox}

                        />



                        <AppCheckbox

                            label="انباری"

                            name="storage"

                            checked={form.storage}

                            onChange={handleCheckbox}

                        />


                    </Grid>
                    <Grid size={{ xs: 12 }}>

                        <Typography variant="h6">

                            تصاویر فعلی

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flexWrap: "wrap"
                            }}
                        >

                            {existingImages.map((image, index) => (

                                <Card
                                    key={image.id}
                                    sx={{
                                        width: 170,
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                >

                                    <Chip
                                        label={image.is_cover ? "⭐ کاور" : "انتخاب کاور"}
                                        color={image.is_cover ? "primary" : "default"}
                                        size="small"
                                        clickable
                                        onClick={() => handleSetCover(image.id)}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            left: 8,
                                            zIndex: 2
                                        }}
                                    />

                                    <IconButton
                                        color="error"
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            bgcolor: "white",
                                            zIndex: 2
                                        }}
                                        onClick={() => handleRemoveExisting(image, index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                    <CardMedia
                                        component="img"
                                        image={`${API_BASE_URL}${image.image}`}
                                        height="120"
                                        sx={{
                                            objectFit: "cover"
                                        }}
                                    />

                                </Card>

                            ))}

                        </Stack>

                    </Grid>

                    <ImageUploader
                        newImages={newImages}
                        setNewImages={setNewImages}
                    />


                    <Grid size={{ xs: 12 }}>

                        <label>
                            ویدیوهای ملک
                        </label>

                        <VideoUploader

                            existingVideos={existingVideos}
                            setExistingVideos={setExistingVideos}

                            newVideos={newVideos}
                            setNewVideos={setNewVideos}

                            onRemove={handleRemoveVideo}

                        />

                    </Grid>






                    <Grid size={{ xs: 12 }}>

                        <AppButton
                            type="submit"
                        >

                            {
                                isEdit
                                    ? "ذخیره تغییرات"
                                    : "ثبت ملک"
                            }

                        </AppButton>

                    </Grid>



                </Grid>
            </form>



        </PageContainer>

    );

}
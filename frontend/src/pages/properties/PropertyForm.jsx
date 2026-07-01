import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppCheckbox from "../../components/common/AppCheckbox";
import AppSelect from "../../components/common/AppSelect";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

    const [images, setImages] = useState([]);

    const [videos, setVideos] = useState([]);

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

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

    }



    function handleCheckbox(e) {

        const { name, checked } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: checked

        }));

    }

    function handleImages(e) {

        setImages(
            [...e.target.files]
        );

    }

    function handleVideos(e) {

        setVideos(
            [...e.target.files]
        );

    }

    async function handleSubmit(e) {

        e.preventDefault();


        try {


            const formData = new FormData();


            Object.keys(form).forEach(key => {

                formData.append(
                    key,
                    form[key] ?? ""
                );

            });


            images.forEach(image => {

                formData.append(
                    "images",
                    image
                );

            });

            videos.forEach(video => {

                formData.append(
                    "videos",
                    video
                );

            });


            if (isEdit) {

                await api.put(
                    `properties/${id}/`,
                    formData
                );

            }
            else {

                await api.post(
                    "properties/",
                    formData
                );

            }


            navigate("/properties");


        }

        catch (error) {

            console.log(
                error.response?.data
            );

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

                        />
                    </Grid>



                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppTextField

                            label="عنوان"

                            name="title"

                            value={form.title}

                            onChange={handleChange}

                        />

                    </Grid>



                    <Grid size={{ xs: 12, md: 6 }}>

                        <AppSelect

                            label="نوع ملک"

                            name="property_type"

                            value={form.property_type}

                            onChange={handleChange}

                        >


                            <MenuItem value="">
                                انتخاب کنید
                            </MenuItem>


                            <MenuItem value="apartment">
                                آپارتمان
                            </MenuItem>


                            <MenuItem value="villa">
                                ویلا
                            </MenuItem>


                            <MenuItem value="land">
                                زمین
                            </MenuItem>


                            <MenuItem value="office">
                                دفتر
                            </MenuItem>


                        </AppSelect>


                    </Grid>




                    <Grid size={{ xs: 12, md: 6 }}>


                        <AppSelect

                            label="نوع معامله"

                            name="transaction_type"

                            value={form.transaction_type}

                            onChange={handleChange}

                        >

                            <MenuItem value="">
                                انتخاب کنید
                            </MenuItem>

                            <MenuItem value="sale">
                                فروش
                            </MenuItem>

                            <MenuItem value="rent">
                                اجاره
                            </MenuItem>


                        </AppSelect>


                    </Grid>




                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="قیمت"

                            name="price"

                            value={form.price}

                            onChange={handleChange}

                        />

                    </Grid>




                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="متراژ"

                            name="area"

                            value={form.area}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="طبقه"
                            name="floor"
                            type="number"
                            value={form.floor}
                            onChange={handleChange}
                        />

                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="تعداد طبقات"
                            name="total_floors"
                            type="number"
                            value={form.total_floors}
                            onChange={handleChange}
                        />

                    </Grid>


                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField
                            label="سال ساخت"
                            name="year_built"
                            type="number"
                            value={form.year_built}
                            onChange={handleChange}
                        />

                    </Grid>



                    <Grid size={{ xs: 12, md: 4 }}>

                        <AppTextField

                            label="اتاق"

                            name="rooms"

                            value={form.rooms}

                            onChange={handleChange}

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

                        <input

                            type="file"

                            multiple

                            accept="image/*"

                            onChange={handleImages}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <label>
                            ویدیوهای ملک
                        </label>

                        <input

                            type="file"

                            multiple

                            accept="video/*"

                            onChange={handleVideos}

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
import { useState } from "react";
import { Grid } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppCheckbox from "../../components/common/AppCheckbox";
import AppSelect from "../../components/common/AppSelect";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

    const navigate = useNavigate();



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

    async function handleSubmit(e) {

        e.preventDefault();


        try {


            const data = {
                ...form,

                floor: form.floor || null,

                total_floors: form.total_floors || null,

                year_built: form.year_built || null,
            };


            await api.post(
                "properties/",
                data
            );


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
                title="افزودن ملک"
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

                        <AppButton
                            type="submit"
                        >

                            ثبت ملک

                        </AppButton>

                    </Grid>



                </Grid>
            </form>



        </PageContainer>

    );

}
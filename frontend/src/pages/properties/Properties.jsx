import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@mui/material";

import IconButton from "@mui/material/IconButton";

import FavoriteIcon from "@mui/icons-material/Favorite";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import AppButton from "../../components/common/AppButton";

import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../../components/common/DeleteDialog";

export default function Properties() {


    const [properties, setProperties] = useState([]);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigate = useNavigate();



    async function loadProperties() {

        try {

            const response = await api.get(
                "properties/"
            );


            setProperties(
                response.data.results ?? response.data
            );


        }
        catch (error) {

            console.log(error);

        }

    }



    useEffect(() => {

        loadProperties();

    }, []);

    function handleDeleteClick(property) {

        setSelectedProperty(property);

        setDeleteOpen(true);

    }

    async function handleDelete() {

        try {

            await api.delete(
                `properties/${selectedProperty.id}/`
            );

            setDeleteOpen(false);

            setSelectedProperty(null);

            loadProperties();

        }

        catch (error) {

            console.log(error);

        }

    }

    async function toggleFavorite(property) {

        try {

            await api.patch(

                `properties/${property.id}/`,

                {

                    is_favorite: !property.is_favorite

                }

            );

            loadProperties();

        }

        catch (error) {

            console.log(error);

        }

    }



    return (

        <Container>


            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}
            >

                <Typography
                    variant="h4"
                >
                    املاک
                </Typography>


                <AppButton
                    onClick={() =>
                        navigate("/properties/create")
                    }
                >
                    افزودن ملک
                </AppButton>


            </div>



            <Paper>


                <Table>


                    <TableHead>

                        <TableRow>

                            <TableCell>
                                عنوان
                            </TableCell>


                            <TableCell>
                                قیمت
                            </TableCell>


                            <TableCell>
                                آدرس
                            </TableCell>

                            <TableCell>

                                علاقه‌مندی

                            </TableCell>




                            <TableCell>
                                عملیات
                            </TableCell>


                        </TableRow>


                    </TableHead>



                    <TableBody>


                        {
                            properties.map(property => (


                                <TableRow
                                    key={property.id}
                                >


                                    <TableCell>
                                        {property.title}
                                    </TableCell>


                                    <TableCell>
                                        {property.price}
                                    </TableCell>


                                    <TableCell>
                                        {property.address}
                                    </TableCell>

                                    <TableCell>

                                        <IconButton

                                            color="error"

                                            onClick={() =>
                                                toggleFavorite(property)
                                            }

                                        >

                                            {
                                                property.is_favorite
                                                    ? <FavoriteIcon />
                                                    : <FavoriteBorderIcon />
                                            }

                                        </IconButton>

                                    </TableCell>



                                    <TableCell>

                                        <Button
                                            startIcon={<VisibilityIcon />}
                                            onClick={() =>
                                                navigate(`/properties/${property.id}`)
                                            }
                                        >
                                            مشاهده
                                        </Button>


                                        <Button
                                            onClick={() =>
                                                navigate(`/properties/${property.id}/edit`)
                                            }
                                        >
                                            ویرایش
                                        </Button>


                                        <Button
                                            color="error"
                                            onClick={() =>
                                                handleDeleteClick(property)
                                            }
                                        >
                                            حذف
                                        </Button>

                                    </TableCell>



                                </TableRow>


                            ))
                        }


                    </TableBody>



                </Table>


            </Paper>

            <DeleteDialog

                open={deleteOpen}

                title="حذف ملک"

                message={`آیا از حذف "${selectedProperty?.title ?? ""}" مطمئن هستید؟`}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedProperty(null);

                }}

                onConfirm={handleDelete}

            />



        </Container>


    );

}
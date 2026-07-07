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
    Button,
    Stack
} from "@mui/material";

import PropertyToolbar from "../../components/properties/PropertyToolbar";
import PropertyActions from "../../components/properties/PropertyActions";

import Avatar from "@mui/material/Avatar";
import TableContainer from "@mui/material/TableContainer";

import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AppButton from "../../components/common/AppButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import AppTextField from "../../components/common/AppTextField";
import PropertyFilters from "../../components/properties/PropertyFilters";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../../components/common/DeleteDialog";

import Pagination from "@mui/material/Pagination";



export default function Properties() {


    const [properties, setProperties] = useState([]);

    const [search, setSearch] = useState("");

    const [propertyType, setPropertyType] = useState("all");

    const [transactionType, setTransactionType] = useState("all");

    const [favoriteOnly, setFavoriteOnly] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);

    const pageSize = 20;

    const [ordering, setOrdering] = useState("all");



    async function loadProperties() {

        try {

            const params = {
                page,
                search,
            };

            if (propertyType !== "all") {
                params.property_type = propertyType;
            }

            if (transactionType !== "all") {
                params.transaction_type = transactionType;
            }

            if (ordering !== "all") {
                params.ordering = ordering;
            }

            if (favoriteOnly) {
                params.is_favorite = true;
            }


            const response = await api.get(
                "properties/",
                {
                    params
                }
            );

            setProperties(
                response.data.results ?? response.data
            );

            setCount(
                response.data.count ?? 0
            );


        }
        catch (error) {
            console.log(error.response?.data);

            console.log(error);

        }

    }



    useEffect(() => {

        loadProperties();

    }, [

        search,

        propertyType,

        transactionType,

        favoriteOnly,

        page,

        ordering

    ]);

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

            <PropertyToolbar

                search={search}
                setSearch={setSearch}

                propertyType={propertyType}
                setPropertyType={setPropertyType}

                transactionType={transactionType}
                setTransactionType={setTransactionType}

                favoriteOnly={favoriteOnly}
                setFavoriteOnly={setFavoriteOnly}

                ordering={ordering}
                setOrdering={setOrdering}

            />



            <Paper>
                <TableContainer>


                    <Table>


                        <TableHead>

                            <TableRow>
                                <TableCell>
                                    تصویر
                                </TableCell>

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

                                            <Avatar
                                                src={property.cover_image}
                                                variant="rounded"
                                                sx={{
                                                    width: 80,
                                                    height: 60,
                                                    borderRadius: 2
                                                }}
                                            />

                                        </TableCell>


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

                                            <PropertyActions

                                                property={property}

                                                onView={(property) =>
                                                    navigate(`/properties/${property.id}`)
                                                }

                                                onEdit={(property) =>
                                                    navigate(`/properties/${property.id}/edit`)
                                                }

                                                onDelete={handleDeleteClick}

                                            />

                                        </TableCell>



                                    </TableRow>


                                ))
                            }


                        </TableBody>



                    </Table>
                </TableContainer>


            </Paper>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 24,
                }}
            >
                <Pagination
                    page={page}
                    count={Math.ceil(count / pageSize)}
                    color="primary"
                    onChange={(event, value) => {
                        setPage(value);
                    }}
                />
            </div>

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
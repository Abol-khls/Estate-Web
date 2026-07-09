import { useEffect, useState } from "react";
import api from "../../services/api";
import { Box, Pagination } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import PropertyTable from "../../components/properties/PropertyTable";
import PropertyToolbar from "../../components/properties/PropertyToolbar";
import AppButton from "../../components/common/AppButton";
import DeleteDialog from "../../components/common/DeleteDialog";
import { useSnackbar } from "../../context/SnackbarContext";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";



export default function Properties() {
    const [loading, setLoading] = useState(true);

    const [properties, setProperties] = useState([]);

    const [search, setSearch] = useState("");

    const { showSnackbar } = useSnackbar();

    const [propertyType, setPropertyType] = useState("all");

    const [transactionType, setTransactionType] = useState("all");

    const [favoriteOnly, setFavoriteOnly] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    const [count, setCount] = useState(0);

    const pageSize = 10;

    const [ordering, setOrdering] = useState("all");



    async function loadProperties() {
        setLoading(true);

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

            const message =
                error.response?.data?.detail ||
                "خطا در دریافت لیست املاک";

            showSnackbar(message, "error");

        } finally {
            setLoading(false);
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
            showSnackbar(
                "ملک با موفقیت حذف شد.",
                "success"
            );

            setDeleteOpen(false);

            setSelectedProperty(null);

            loadProperties();

        }

        catch (error) {

            const message =
                error.response?.data?.detail ||
                "حذف ملک انجام نشد.";

            showSnackbar(message, "error");

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

            const message =
                error.response?.data?.detail ||
                "تغییر وضعیت علاقه‌مندی انجام نشد.";

            showSnackbar(message, "error");

        }

    }
    if (loading) {

        return (

            <PageContainer>

                <Loading />

            </PageContainer>

        );

    }



    return (

        <PageContainer>

            <PageHeader

                title="املاک"

                subtitle={`${count} ملک ثبت‌شده`}

                action={

                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/properties/create")
                        }
                    >
                        افزودن ملک
                    </AppButton>

                }

            />

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

            <PropertyTable

                properties={properties}

                onView={(property) =>

                    navigate(`/properties/${property.id}`)

                }

                onEdit={(property) =>

                    navigate(`/properties/${property.id}/edit`)

                }

                onDelete={handleDeleteClick}

                onToggleFavorite={toggleFavorite}

            />
            {properties.length === 0 ? (

                <Box
                    sx={{
                        py: 8,
                        textAlign: "center",
                    }}
                >

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        هیچ ملکی ثبت نشده است.
                    </Typography>

                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/properties/create")}
                    >
                        افزودن اولین ملک
                    </AppButton>

                </Box>

            ) : (

                <PropertyTable
                    properties={properties}
                    onView={(property) =>
                        navigate(`/properties/${property.id}`)
                    }
                    onEdit={(property) =>
                        navigate(`/properties/${property.id}/edit`)
                    }
                    onDelete={handleDeleteClick}
                    onToggleFavorite={toggleFavorite}
                />

            )}


            {count > pageSize && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >
                    <Pagination
                        page={page}
                        count={Math.ceil(count / pageSize)}
                        color="primary"
                        shape="rounded"
                        onChange={(event, value) => {
                            setPage(value);
                        }}
                    />
                </Box>

            )}

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

        </PageContainer>

    );

}
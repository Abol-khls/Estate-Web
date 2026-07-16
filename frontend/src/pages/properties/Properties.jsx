import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { Box, Pagination } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import PropertyGrid from "../../components/properties/PropertyGrid";
import PropertyToolbar from "../../components/properties/PropertyToolbar";
import AppButton from "../../components/common/AppButton";
import DeleteDialog from "../../components/common/DeleteDialog";
import PropertyGridSkeleton from "../../components/common/skeletons/PropertyGridSkeleton";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";
import useDebouncedValue from "../../hooks/useDebouncedValue";

import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";



export default function Properties() {


    const [properties, setProperties] = useState([]);

    const [searchInput, setSearchInput] = useState("");

    const search = useDebouncedValue(searchInput, 400);

    const { showSnackbar } = useSnackbar();

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

    const [loading, setLoading] = useState(true);


    const isFirstRun = useRef(true);



    async function loadProperties(pageToLoad = page) {

        setLoading(true);

        try {

            const params = {
                page: pageToLoad,
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

            if (error.response?.status === 404 && pageToLoad !== 1) {

                setPage(1);
                return;

            }

            const message = getErrorMessage(
                error,
                "خطا در دریافت لیست املاک"
            );

            showSnackbar(message, "error");

            setProperties([]);
            setCount(0);

        }
        finally {

            setLoading(false);

        }


    }



    useEffect(() => {

        if (isFirstRun.current) {

            isFirstRun.current = false;
            loadProperties(1);
            return;

        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadProperties(1);
        }

    
    }, [

        search,

        propertyType,

        transactionType,

        favoriteOnly,

        ordering

    ]);


    useEffect(() => {

        if (isFirstRun.current) return;

        loadProperties(page);

    }, [page]);

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

            const message = getErrorMessage(
                error,
                "حذف ملک انجام نشد."
            );

            showSnackbar(message, "error");

        }


    }

    async function toggleFavorite(property) {

        try {

            const response = await api.post(

                `properties/${property.id}/toggle_favorite/`

            );


            loadProperties();

            showSnackbar(
                response.data.is_favorite
                    ? "به علاقه‌مندی‌ها اضافه شد."
                    : "از علاقه‌مندی‌ها حذف شد.",
                "success"
            );

        }

        catch (error) {

            const message = getErrorMessage(
                error,
                "تغییر وضعیت علاقه‌مندی انجام نشد."
            );

            showSnackbar(message, "error");

        }

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

                search={searchInput}
                setSearch={setSearchInput}

                propertyType={propertyType}
                setPropertyType={setPropertyType}

                transactionType={transactionType}
                setTransactionType={setTransactionType}

                favoriteOnly={favoriteOnly}
                setFavoriteOnly={setFavoriteOnly}

                ordering={ordering}
                setOrdering={setOrdering}

            />

            {loading ? (

                <PropertyGridSkeleton />

            ) : (

                <PropertyGrid

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
                        disabled={loading}
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
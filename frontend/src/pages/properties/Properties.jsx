import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import useResourceList from "../../hooks/queries/useResourceList";
import useDeleteResource from "../../hooks/queries/useDeleteResource";
import useToggleFavorite from "../../hooks/queries/useToggleFavorite";

import AddIcon from "@mui/icons-material/Add";

const PAGE_SIZE = 20;

export default function Properties() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

    const search = useDebouncedValue(searchInput, 400);

    const { showSnackbar } = useSnackbar();

    const [propertyType, setPropertyType] = useState(searchParams.get("property_type") ?? "all");

    const [transactionType, setTransactionType] = useState(searchParams.get("transaction_type") ?? "all");

    const [propertyStatus, setPropertyStatus] = useState(searchParams.get("status") ?? "all");

    const [favoriteOnly, setFavoriteOnly] = useState(searchParams.get("favorite") === "true");

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigate = useNavigate();

    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    const [ordering, setOrdering] = useState(searchParams.get("ordering") ?? "all");

    const filtersKey = JSON.stringify([
        search,
        propertyType,
        transactionType,
        propertyStatus,
        favoriteOnly,
        ordering,
    ]);

    const [appliedFiltersKey, setAppliedFiltersKey] = useState(filtersKey);

    if (filtersKey !== appliedFiltersKey) {
        setAppliedFiltersKey(filtersKey);
        setPage(1);
    }

    useEffect(() => {

        const next = {};

        if (search) next.search = search;
        if (propertyType !== "all") next.property_type = propertyType;
        if (transactionType !== "all") next.transaction_type = transactionType;
        if (propertyStatus !== "all") next.status = propertyStatus;
        if (favoriteOnly) next.favorite = "true";
        if (ordering !== "all") next.ordering = ordering;
        if (page !== 1) next.page = String(page);

        setSearchParams(next, { replace: true });

    }, [search, propertyType, transactionType, propertyStatus, favoriteOnly, ordering, page]);

    const params = useMemo(() => {

        const value = { page, search };

        if (propertyType !== "all") {
            value.property_type = propertyType;
        }

        if (transactionType !== "all") {
            value.transaction_type = transactionType;
        }

        if (propertyStatus !== "all") {
            value.status = propertyStatus;
        }

        if (ordering !== "all") {
            value.ordering = ordering;
        }

        if (favoriteOnly) {
            value.is_favorite = true;
        }

        return value;

    }, [page, search, propertyType, transactionType, propertyStatus, ordering, favoriteOnly]);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useResourceList("properties", params);

    const properties = data?.results ?? [];
    const count = data?.count ?? 0;

    const shouldResetPageOn404 = (
        isError
        && error?.response?.status === 404
        && page !== 1
    );

    if (shouldResetPageOn404) {
        setPage(1);
    }

    useEffect(() => {

        if (!isError || shouldResetPageOn404) return;

        const message = getErrorMessage(
            error,
            "خطا در دریافت لیست املاک"
        );

        showSnackbar(message, "error");

    }, [isError, error, shouldResetPageOn404]);


    const deleteMutation = useDeleteResource("properties");

    const toggleFavoriteMutation = useToggleFavorite();

    function handleDeleteClick(property) {

        setSelectedProperty(property);

        setDeleteOpen(true);

    }

    function handleDelete() {

        deleteMutation.mutate(selectedProperty.id, {

            onSuccess: () => {

                showSnackbar("ملک با موفقیت حذف شد.", "success");

                setDeleteOpen(false);
                setSelectedProperty(null);

            },

            onError: (mutationError) => {

                const message = getErrorMessage(
                    mutationError,
                    "حذف ملک انجام نشد."
                );

                showSnackbar(message, "error");

            },

        });

    }

    function toggleFavorite(property) {

        toggleFavoriteMutation.mutate(property.id, {

            onSuccess: (result) => {

                showSnackbar(
                    result.is_favorite
                        ? "به علاقه‌مندی‌ها اضافه شد."
                        : "از علاقه‌مندی‌ها حذف شد.",
                    "success"
                );

            },

            onError: (mutationError) => {

                const message = getErrorMessage(
                    mutationError,
                    "تغییر وضعیت علاقه‌مندی انجام نشد."
                );

                showSnackbar(message, "error");

            },

        });

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
                            navigate("/admin/properties/create")
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

                propertyStatus={propertyStatus}
                setPropertyStatus={setPropertyStatus}

                favoriteOnly={favoriteOnly}
                setFavoriteOnly={setFavoriteOnly}

                ordering={ordering}
                setOrdering={setOrdering}

            />

            {isLoading ? (

                <PropertyGridSkeleton />

            ) : (

                <PropertyGrid

                    properties={properties}

                    onView={(property) =>

                        navigate(`/admin/properties/${property.id}`)

                    }

                    onEdit={(property) =>

                        navigate(`/admin/properties/${property.id}/edit`)

                    }

                    onDelete={handleDeleteClick}

                    onToggleFavorite={toggleFavorite}

                />

            )}

            {count > PAGE_SIZE && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >
                    <Pagination
                        page={page}
                        count={Math.ceil(count / PAGE_SIZE)}
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
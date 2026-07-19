import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, MenuItem, Pagination, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import PublicLayout from "./PublicLayout";
import PublicPropertyCard from "./PublicPropertyCard";
import InquiryForm from "./InquiryForm";

import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";
import AppButton from "../../components/common/AppButton";
import PropertyGridSkeleton from "../../components/common/skeletons/PropertyGridSkeleton";

import useDebouncedValue from "../../hooks/useDebouncedValue";
import useResourceList from "../../hooks/queries/useResourceList";

import { PROPERTY_TYPES, TRANSACTION_TYPES, ORDERING_OPTIONS } from "../../constants/propertyOptions";

const PAGE_SIZE = 20;

export default function PublicProperties() {

    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const search = useDebouncedValue(searchInput, 400);

    const [propertyType, setPropertyType] = useState("all");
    const [transactionType, setTransactionType] = useState("all");
    const [ordering, setOrdering] = useState("-created_at");
    const [page, setPage] = useState(1);

    const [inquiryOpen, setInquiryOpen] = useState(false);

    useEffect(() => {

        setPage(1);

    }, [search, propertyType, transactionType, ordering]);

    const params = useMemo(() => {

        const value = { page, search, ordering };

        if (propertyType !== "all") {
            value.property_type = propertyType;
        }

        if (transactionType !== "all") {
            value.transaction_type = transactionType;
        }

        return value;

    }, [page, search, propertyType, transactionType, ordering]);

    const { data, isLoading } = useResourceList("public/properties", params);

    const properties = data?.results ?? [];
    const count = data?.count ?? 0;

    return (

        <PublicLayout>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >

                <Box>

                    <Typography variant="h5" fontWeight={800}>
                        ملک‌های موجود
                    </Typography>

                    <Typography color="text.secondary">
                        {count} ملک برای بازدید
                    </Typography>

                </Box>

                <AppButton onClick={() => setInquiryOpen(true)}>
                    درخواست تماس با ما
                </AppButton>

            </Box>

            <Box
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppTextField
                            placeholder="جستجو بر اساس عنوان یا آدرس..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            startIcon={<SearchIcon fontSize="small" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AppSelect
                            label="نوع ملک"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {PROPERTY_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AppSelect
                            label="نوع معامله"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {TRANSACTION_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AppSelect
                            label="مرتب‌سازی"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                        >
                            {ORDERING_OPTIONS.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                </Grid>

            </Box>

            {isLoading ? (

                <PropertyGridSkeleton />

            ) : properties.length === 0 ? (

                <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
                    ملکی مطابق جستجوی شما پیدا نشد.
                </Box>

            ) : (

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            xl: "repeat(4, 1fr)",
                        },
                        gap: 2.5,
                    }}
                >

                    {properties.map(property => (

                        <PublicPropertyCard
                            key={property.id}
                            property={property}
                            onView={(p) => navigate(`/property/${p.id}`)}
                        />

                    ))}

                </Box>

            )}

            {count > PAGE_SIZE && (

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        page={page}
                        count={Math.ceil(count / PAGE_SIZE)}
                        color="primary"
                        shape="rounded"
                        onChange={(event, value) => setPage(value)}
                    />
                </Box>

            )}

            <InquiryForm
                open={inquiryOpen}
                onClose={() => setInquiryOpen(false)}
                property={null}
            />

        </PublicLayout>

    );

}
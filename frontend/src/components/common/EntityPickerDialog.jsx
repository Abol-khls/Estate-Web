import { useEffect, useRef, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Pagination,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";

import api from "../../services/api";
import AppTextField from "./AppTextField";
import Loading from "./Loading";

export default function EntityPickerDialog({

    open,
    onClose,
    title,
    endpoint,
    searchPlaceholder,
    renderItem,
    onSelect,

}) {

    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const pageSize = 10;

    const isFirstRun = useRef(true);

    async function loadItems(pageToLoad = page) {

        setLoading(true);

        try {

            const response = await api.get(endpoint, {
                params: { page: pageToLoad, search },
            });

            setItems(response.data.results ?? response.data);
            setCount(response.data.count ?? 0);

        }
        catch {

            if (pageToLoad !== 1) {
                setPage(1);
                return;
            }

            setItems([]);
            setCount(0);

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (!open) return;

        setSearch("");
        setPage(1);
        isFirstRun.current = true;
        loadItems(1);

        
    }, [open]);

    useEffect(() => {

        if (!open) return;

        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadItems(1);
        }

        
    }, [search]);

    useEffect(() => {

        if (!open || isFirstRun.current) return;

        loadItems(page);

        
    }, [page]);

    function handleSelect(item) {
        onSelect(item);
        onClose();
    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >

            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {title}

                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>

            </DialogTitle>

            <Box sx={{ px: 3, pb: 2 }}>

                <AppTextField
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startIcon={<SearchIcon fontSize="small" />}
                    autoFocus
                />

            </Box>

            <DialogContent
                dividers
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                }}
            >

                {loading ? (

                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Loading />
                    </Box>

                ) : items.length === 0 ? (

                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            color: "text.secondary",
                        }}
                    >
                        <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                        <Typography variant="body2">
                            موردی برای نمایش پیدا نشد.
                        </Typography>
                    </Box>

                ) : (

                    <Box sx={{ flex: 1, overflowY: "auto" }}>

                        {items.map((item, index) => (

                            <Box
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                sx={{
                                    px: 3,
                                    py: 2,
                                    cursor: "pointer",
                                    bgcolor: index % 2 === 1 ? "rgba(31, 59, 87, 0.02)" : "transparent",
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    transition: ".15s",
                                    "&:hover": {
                                        bgcolor: "rgba(31, 59, 87, 0.06)",
                                    },
                                }}
                            >

                                {renderItem(item)}

                            </Box>

                        ))}

                    </Box>

                )}

            </DialogContent>

            {count > pageSize && (

                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <Pagination
                        page={page}
                        count={Math.ceil(count / pageSize)}
                        color="primary"
                        shape="rounded"
                        size="small"
                        disabled={loading}
                        onChange={(event, value) => setPage(value)}
                    />
                </Box>

            )}

        </Dialog>

    );

}
import { Stack, Box, MenuItem, Typography } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

import AppTextField from "../common/AppTextField";
import AppSelect from "../common/AppSelect";
import AppCheckbox from "../common/AppCheckbox";
import {
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
    ORDERING_OPTIONS
} from "../../constants/propertyOptions";

export default function PropertyFilters({

    search,
    setSearch,

    propertyType,
    setPropertyType,

    transactionType,
    setTransactionType,

    favoriteOnly,
    setFavoriteOnly,

    ordering,
    setOrdering

}) {

    return (

        <Box

            sx={{

                mb: 3,

                p: 3,

                borderRadius: 4,

                bgcolor: "background.paper",

                border: "1px solid",

                borderColor: "divider",

                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",

            }}

        >

            <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 2 }}
            >

                <TuneIcon
                    fontSize="small"
                    sx={{ color: "secondary.main" }}
                />

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    فیلتر و جستجو
                </Typography>

            </Stack>

            <AppTextField

                placeholder="جستجوی ملک..."

                value={search}

                onChange={(e) =>
                    setSearch(e.target.value)
                }

                startIcon={<SearchIcon sx={{ color: "text.secondary" }} />}

                sx={{

                    mb: 2

                }}

            />

            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={2}
                sx={{
                    alignItems: {
                        xs: "stretch",
                        md: "center"
                    }
                }}
            >

                <Box sx={{ flex: 1 }}>

                    <AppSelect

                        label="نوع ملک"

                        value={propertyType}

                        onChange={(e) =>
                            setPropertyType(e.target.value)
                        }

                    >

                        <MenuItem value="all">
                            همه
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

                </Box>

                <Box sx={{ flex: 1 }}>

                    <AppSelect

                        label="نوع معامله"

                        value={transactionType}

                        onChange={(e) =>
                            setTransactionType(e.target.value)
                        }

                    >

                        <MenuItem value="all">
                            همه
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

                </Box>

                <Box sx={{ flex: 1 }}>

                    <AppSelect
                        label="مرتب‌سازی"
                        value={ordering}
                        onChange={(e) =>
                            setOrdering(e.target.value)
                        }
                    >
                        <MenuItem value="all">
                            پیش فرض
                        </MenuItem>

                        {ORDERING_OPTIONS.map(item => (

                            <MenuItem
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </MenuItem>

                        ))}

                    </AppSelect>

                </Box>

                <Box

                    sx={{

                        minWidth: 180,

                        display: "flex",

                        justifyContent: "center",

                        bgcolor: favoriteOnly ? "rgba(200, 155, 60, 0.1)" : "transparent",

                        borderRadius: 2,

                        transition: ".2s",

                    }}

                >

                    <AppCheckbox

                        label="فقط علاقه‌مندی"

                        checked={favoriteOnly}

                        onChange={(e) =>
                            setFavoriteOnly(e.target.checked)
                        }

                    />

                </Box>

            </Stack>

        </Box>

    );

}
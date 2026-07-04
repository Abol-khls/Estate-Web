import { Stack, Box, MenuItem } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

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

                p: 2,

                borderRadius: 2,

                bgcolor: "background.paper",

                boxShadow: 1

            }}

        >



            <AppTextField

                placeholder="جستجوی ملک..."

                value={search}

                onChange={(e) =>
                    setSearch(e.target.value)
                }

                startIcon={<SearchIcon />}

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

                        justifyContent: "center"

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
import { Stack, Box, MenuItem } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import AppTextField from "../common/AppTextField";
import AppSelect from "../common/AppSelect";
import AppCheckbox from "../common/AppCheckbox";

export default function PropertyFilters({

    search,
    setSearch,

    propertyType,
    setPropertyType,

    transactionType,
    setTransactionType,

    favoriteOnly,
    setFavoriteOnly

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

                        <MenuItem value="">همه</MenuItem>

                        <MenuItem value="apartment">آپارتمان</MenuItem>

                        <MenuItem value="villa">ویلا</MenuItem>

                        <MenuItem value="land">زمین</MenuItem>

                        <MenuItem value="office">دفتر</MenuItem>

                        <MenuItem value="shop">مغازه</MenuItem>

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

                        <MenuItem value="">همه</MenuItem>

                        <MenuItem value="sale">فروش</MenuItem>

                        <MenuItem value="rent">اجاره</MenuItem>

                        <MenuItem value="pre_sale">پیش فروش</MenuItem>

                        <MenuItem value="mortgage">رهن</MenuItem>

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
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer
} from "@mui/material";

import PropertyRow from "./PropertyRow";

export default function PropertyTable({

    properties,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite

}) {

    return (

        <Paper
            elevation={2}
            sx={{
                borderRadius: 3,
                overflow: "hidden"
            }}
        >

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow
                            sx={{
                                bgcolor: "grey.100"
                            }}
                        >

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                تصویر
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                عنوان
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                قیمت
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                آدرس
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                علاقه‌مندی
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 2,
                                }}
                            >
                                عملیات
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            properties.map(property => (

                                <PropertyRow

                                    key={property.id}

                                    property={property}

                                    onView={onView}

                                    onEdit={onEdit}

                                    onDelete={onDelete}

                                    onToggleFavorite={onToggleFavorite}

                                />

                            ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

        </Paper>







    );

}
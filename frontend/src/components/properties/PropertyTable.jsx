import {

    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody

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

        <Paper>

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

        </Paper>

    );

}
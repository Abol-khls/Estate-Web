import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@mui/material";

import AppButton from "../../components/common/AppButton";

import { useNavigate } from "react-router-dom";

export default function Properties() {


    const [properties, setProperties] = useState([]);

    const navigate = useNavigate();



    async function loadProperties() {

        try {

            const response = await api.get(
                "properties/"
            );


            setProperties(
                response.data.results ?? response.data
            );


        }
        catch (error) {

            console.log(error);

        }

    }



    useEffect(() => {

        loadProperties();

    }, []);



    return (

        <Container>


            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}
            >

                <Typography
                    variant="h4"
                >
                    املاک
                </Typography>


                <AppButton
                    onClick={() =>
                        navigate("/properties/create")
                    }
                >
                    افزودن ملک
                </AppButton>


            </div>



            <Paper>


                <Table>


                    <TableHead>

                        <TableRow>

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
                                عملیات
                            </TableCell>


                        </TableRow>


                    </TableHead>



                    <TableBody>


                        {
                            properties.map(property => (


                                <TableRow
                                    key={property.id}
                                >


                                    <TableCell>
                                        {property.title}
                                    </TableCell>


                                    <TableCell>
                                        {property.price}
                                    </TableCell>


                                    <TableCell>
                                        {property.address}
                                    </TableCell>



                                    <TableCell>


                                        <Button>
                                            ویرایش
                                        </Button>


                                        <Button
                                            color="error"
                                        >
                                            حذف
                                        </Button>


                                    </TableCell>



                                </TableRow>


                            ))
                        }


                    </TableBody>



                </Table>


            </Paper>



        </Container>


    );

}
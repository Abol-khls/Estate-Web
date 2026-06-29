import { Grid } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";

export default function PropertyForm() {

    return (

        <PageContainer>

            <PageHeader
                title="افزودن ملک"
            />

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="کد ملک"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="عنوان"
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppButton>
                        ثبت ملک
                    </AppButton>
                </Grid>

            </Grid>

        </PageContainer>

    );

}
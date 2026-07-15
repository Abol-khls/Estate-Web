import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

import ErrorState from "./ErrorState";

export default function ServerError() {

    return (

        <ErrorState
            icon={ErrorOutlineIcon}
            code="500"
            title="مشکلی پیش اومد"
            message="یه خطای غیرمنتظره تو برنامه رخ داد. تیم فنی از این موضوع مطلع شده. لطفاً صفحه رو دوباره بارگذاری کنید."
            actionLabel="بارگذاری مجدد صفحه"
            onAction={() => window.location.reload()}
        />

    );

}
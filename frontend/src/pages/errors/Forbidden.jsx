import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block";

import ErrorState from "./ErrorState";

export default function Forbidden() {

    const navigate = useNavigate();

    return (

        <ErrorState
            icon={BlockIcon}
            code="403"
            title="دسترسی غیرمجاز"
            message="شما دسترسی لازم برای مشاهده یا انجام این عملیات رو ندارید. اگه فکر می‌کنید این یه اشتباهه، با مدیر آژانس خودتون تماس بگیرید."
            actionLabel="بازگشت به داشبورد"
            onAction={() => navigate("/dashboard")}
        />

    );

}
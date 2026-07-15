import { useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import ErrorState from "./ErrorState";
import { useAuth } from "../../context/AuthContext";

export default function NotFound() {

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (

        <ErrorState
            icon={SearchOffIcon}
            code="404"
            title="صفحه پیدا نشد"
            message="آدرسی که وارد کردید وجود نداره یا جابه‌جا شده. لطفاً آدرس رو بررسی کنید یا به صفحه اصلی برگردید."
            actionLabel={isAuthenticated ? "بازگشت به داشبورد" : "بازگشت به صفحه ورود"}
            onAction={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        />

    );

}
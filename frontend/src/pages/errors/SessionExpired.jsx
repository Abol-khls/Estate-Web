import { useNavigate } from "react-router-dom";
import LockClockIcon from "@mui/icons-material/LockClock";

import ErrorState from "./ErrorState";

export default function SessionExpired() {

    const navigate = useNavigate();

    return (

        <ErrorState
            icon={LockClockIcon}
            code="401"
            title="نشست شما منقضی شده"
            message="برای امنیت حساب‌تون، بعد از مدتی عدم فعالیت از سیستم خارج می‌شید. لطفاً دوباره وارد بشید تا کارتون رو ادامه بدید."
            actionLabel="ورود مجدد"
            onAction={() => navigate("/admin/login")}
        />

    );

}
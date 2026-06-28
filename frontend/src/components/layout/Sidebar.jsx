import {
    Home,
    Building2,
    Users,
    FileText,
    Calendar,
    LogOut
} from "lucide-react";

import {useAuth} from "../../context/AuthContext";


export default function Sidebar(){


    const {logout}=useAuth();


    return (

        <aside className="sidebar">


            <h2>
                Estate CRM
            </h2>


            <nav>


                <a>
                    <Home size={18}/>
                    داشبورد
                </a>


                <a>
                    <Building2 size={18}/>
                    املاک
                </a>


                <a>
                    <Users size={18}/>
                    مشتریان
                </a>


                <a>
                    <FileText size={18}/>
                    قراردادها
                </a>


                <a>
                    <Calendar size={18}/>
                    بازدیدها
                </a>


            </nav>



            <button onClick={logout}>

                <LogOut size={18}/>

                خروج

            </button>


        </aside>

    );
}
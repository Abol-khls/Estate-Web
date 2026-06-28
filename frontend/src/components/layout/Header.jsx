import {useAuth} from "../../context/AuthContext";


export default function Header(){


const {user}=useAuth();


return (

<header>


<h3>
داشبورد
</h3>


<div>

{
user?.username
}


</div>


</header>


)

}
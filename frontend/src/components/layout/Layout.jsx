import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({children}) {

    return (

        <div className="app-layout">

            <Sidebar />

            <div className="main">

                <Header />

                <main>
                    {children}
                </main>

            </div>

        </div>

    );
}
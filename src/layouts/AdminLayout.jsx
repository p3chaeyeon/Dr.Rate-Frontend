/* src/layouts/AdminLayout.jsx */

import { Outlet } from "react-router-dom";
import AdminSideNav from "src/components/AdminSideNav/AdminSideNav";
import AdminHeader from "src/components/AdminHeader/AdminHeader";

const AdminLayout = () => {
    return (
        <div className="adminPage">
            <div className="left">
                <AdminSideNav />
            </div>
            <div className="right">
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;

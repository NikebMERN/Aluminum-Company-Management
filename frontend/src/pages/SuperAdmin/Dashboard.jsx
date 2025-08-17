import { useEffect, useState } from "react";
import { getAllSubAdmins } from "../../services/adminService";
import { useNotification } from "../../hooks/useNotification";
import { Link } from "react-router-dom";
// import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
// import AddIcon from '@mui/icons-material/Add';
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
// import Topbar from "../../components/layouts/Topbar";

export default function SuperAdminDashboard() {
    const [subAdmins, setSubAdmins] = useState([]);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllSubAdmins();
                setSubAdmins(data.data);
                // console.log(data.data);
            } catch (err) {
                notifyError("Failed to fetch sub-admins");
            }
        })();
    }, [getAllSubAdmins]);

    return (
        <div>
            <Topbar title="Super-Admin Dashboard" />
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar for desktop */}
                {/* <aside className=""> */}
                <Sidebar />
                {/* </aside> */}
                {/* <Topbar /> */}
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subAdmins?.map((sa) => (
                        <tr key={sa.id}>
                            <td className="p-2 border">{sa.id}</td>
                            <td className="p-2 border">{sa.name}</td>
                            <td className="p-2 border">{sa.email}</td>
                            <td className="p-2 border">
                                <Link
                                    to={`/super_admin/${sa.id}`}
                                    className="text-blue-500 underline"
                                >
                                    <ReportIcon />View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

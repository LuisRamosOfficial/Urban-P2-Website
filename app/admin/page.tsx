import { AdminRoute } from "../Components/ProtectMiddleware";
import styles from "./admin.module.scss";
import Header from "./header";
import Main from "./main";
import Sidebar from "./sidebar";


const AdminPage = () => {
  return (
    <AdminRoute>
      <main className={styles["admin"]}>
        <Header styles={styles} label="Admin Page" />
        <Sidebar styles={styles}/>
        <Main styles={styles}/>
      </main>
    </AdminRoute>
  );


};



export default AdminPage;
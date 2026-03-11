 "use client";
import { AdminRoute } from "../Components/ProtectMiddleware";
import styles from "./admin.module.scss";
import Header from "./header";
import Main from "./main";
import Sidebar from "./sidebar";
import { useState } from "react";

const AdminPage = () => {

  const [state, setState] = useState("posts");

  return (
    <AdminRoute>
      <main className={styles["admin"]}>
        <Header styles={styles} label="Admin Page" />
        <Sidebar  styles={styles} state={state} setState={setState}/>
        <Main  styles={styles} state={state} setState={setState}/>
      </main>
    </AdminRoute>
  );


};



export default AdminPage;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import { DashProfile } from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashboardComp from "../components/DashboardComp";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        {/* Display component based on selected tab */}
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComments />}
        {tab === "dash" && <DashboardComp />}
      </div>
    </div>
  );
}

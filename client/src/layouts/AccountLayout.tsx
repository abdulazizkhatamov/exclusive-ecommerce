import React from "react";
import { Link, Outlet } from "react-router-dom";
import AccountSidebar from "@/components/custom/account/AccountSidebar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

const AccountLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-600 hover:text-[#db4444]">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-[#db4444]">{user?.fullName}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <AccountSidebar />

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;

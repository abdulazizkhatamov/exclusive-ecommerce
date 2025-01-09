import React from "react";
import { NavLink } from "react-router-dom";

const AccountSidebar: React.FC = () => {
  return (
    <div className="shadow-lg shadow-gray-100 md:col-span-1 p-10 max-h-max">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#db4444]"
                    : "text-gray-600 hover:text-[#db4444]"
                }
                end
              >
                Personal info
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/account/security"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#db4444]"
                    : "text-gray-600 hover:text-[#db4444]"
                }
              >
                Security
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/account/orders"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#db4444]"
                    : "text-gray-600 hover:text-[#db4444]"
                }
              >
                Orders
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;

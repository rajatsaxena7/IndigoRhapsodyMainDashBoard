import React from "react";
import { MdOutlineMenu, MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { AppBarWrap } from "./AppBar.styles";

function AppBar() {
  const handleInputControlVisibility = () => setShowInputControl(true);
  return (
    <AppBarWrap>
      <div className="appbar-content">
        <div className="appbar-left">
          <button type="button" className="sidebar-open-btn">
            <MdOutlineMenu size={24} />
          </button>
          <h3 className="appbar-title">Dashboard</h3>
        </div>
        <div className="appbar-right">
          {/* Notification Bell Icon */}
          <button className="notification-bell">
            <MdNotificationsNone size={24} />
          </button>
        </div>
      </div>
    </AppBarWrap>
  );
}

export default AppBar;

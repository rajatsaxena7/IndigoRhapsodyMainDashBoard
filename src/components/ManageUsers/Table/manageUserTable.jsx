import React, { useEffect, useState } from "react";
import { ManageUserTableWrap } from "./manageUserTable.Styles";
import { Table, Input, Tag, Button, Space, message } from "antd";
import { getAllUsers } from "../../../service/userPageApi"; // Adjust the import path accordingly

function ManageUserTable() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // Store the original users list
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data.users);
        setOriginalUsers(data.users); // Store the original data as well
        setLoading(false);
      } catch (error) {
        message.error("Error fetching users");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "displayName",
      key: "displayName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "User" ? "green" : "volcano"}>{role}</Tag>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Last Logged In",
      dataIndex: "last_logged_in",
      key: "last_logged_in",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredUsers = originalUsers.filter((user) =>
      user.displayName.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    setSearchText("");
    setUsers(originalUsers); // Reset users to the original list
  };

  return (
    <ManageUserTableWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Space>
          <Input.Search
            placeholder="Search by name"
            onSearch={handleSearch}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button type="primary" onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </ManageUserTableWrap>
  );
}

export default ManageUserTable;

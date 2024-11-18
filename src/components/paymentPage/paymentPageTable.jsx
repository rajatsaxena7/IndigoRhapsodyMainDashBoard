import React, { useEffect, useState } from "react";
import { PaymentPageTableWrap } from "./paymentPageTable.Styles";
import { Table, Input, Tag, Button, Space, message, Select } from "antd";
import { GetPayment } from "../../service/paymentpageapi";

const { Option } = Select;

function PaymentPageTable() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await GetPayment();
        setPayments(data.payments);
        setFilteredPayments(data.payments);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching payments");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: ["userId", "displayName"],
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Total Amount",
      dataIndex: ["cartId", "total_amount"],
      key: "totalAmount",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    filterPayments(value, statusFilter);
  };

  // Handle status filter functionality
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterPayments(searchText, value);
  };

  // Function to filter payments based on name and status
  const filterPayments = (name, status) => {
    const filteredData = payments.filter((payment) => {
      const matchesName = payment.userId.displayName
        .toLowerCase()
        .includes(name.toLowerCase());
      const matchesStatus = status ? payment.paymentStatus === status : true;
      return matchesName && matchesStatus;
    });
    setFilteredPayments(filteredData);
  };

  return (
    <PaymentPageTableWrap>
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Input.Search
          placeholder="Search by name"
          onSearch={handleSearch}
          style={{ width: 200 }}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 150 }}
          onChange={handleStatusChange}
          allowClear
        >
          <Option value="Completed">Completed</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Failed">Failed</Option>
        </Select>
        <Button
          type="primary"
          onClick={() => {
            setSearchText("");
            setStatusFilter("");
            setFilteredPayments(payments);
          }}
        >
          Reset
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </PaymentPageTableWrap>
  );
}

export default PaymentPageTable;

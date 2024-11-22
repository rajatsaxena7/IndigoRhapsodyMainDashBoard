import React, { useEffect, useState } from "react";
import { CouponPageTableWrap } from "./couponPage.styles";
import {
  Table,
  Input,
  Tag,
  Button,
  Space,
  message,
  Modal,
  Form,
  DatePicker,
} from "antd";
import { GetCoupons, DeleteCoupon } from "../../../service/couponApi";
import moment from "moment";

function CouponPageTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await GetCoupons();
      setCoupons(data); // Use directly if data is an array, else adjust
      setLoading(false);
    } catch (error) {
      message.error("Error fetching coupons");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId) => {
    try {
      await DeleteCoupon(couponId);
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      message.success("Coupon deleted successfully");
    } catch (error) {
      message.error("Error deleting coupon");
    }
  };

  const handleAddCoupon = async (values) => {
    try {
      const formattedValues = {
        ...values,
        expiryDate: values.expiryDate.toISOString(), // Convert moment to ISO string
      };

      const response = await fetch(
        `https://indigo-rhapsody-backend-ten.vercel.app/coupon/`, // Adjust endpoint if needed
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );
      const newCoupon = await response.json();
      setCoupons([...coupons, newCoupon]); // Add new coupon to list
      message.success("Coupon created successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error creating coupon");
    }
  };

  const columns = [
    {
      title: "Coupon Title",
      dataIndex: "couponCode",
      key: "couponCode",
    },
    {
      title: "Amount",
      dataIndex: "couponAmount",
      key: "couponAmount",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <Tag color={is_active ? "green" : "volcano"}>
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Used By",
      dataIndex: "__v",
      key: "__v",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  const disablePastDates = (current) => {
    // Disable dates before today
    return current && current < moment().startOf("day");
  };

  return (
    <CouponPageTableWrap>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Coupon
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Modal for Adding Coupon */}
      <Modal
        title="Add New Coupon"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCoupon}>
          <Form.Item
            label="Coupon Code"
            name="couponCode"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="couponAmount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please select expiry date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disablePastDates}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </CouponPageTableWrap>
  );
}

export default CouponPageTable;

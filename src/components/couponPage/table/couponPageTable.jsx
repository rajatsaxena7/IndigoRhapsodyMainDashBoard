import React, { useEffect, useState } from "react";
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { GetCoupons, DeleteCoupon } from "../../../service/couponApi";
import moment from "moment";

const { confirm } = Modal;

function CouponPageTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await GetCoupons();
      if (response && Array.isArray(response.data)) {
        setCoupons(response.data);
      } else {
        console.error("Invalid data format", response);
        message.error("Unexpected response format from server");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      message.error("Error fetching coupons");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showDeleteConfirm = (couponId) => {
    confirm({
      title: "Are you sure you want to delete this coupon?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeleteCoupon(couponId);
          setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
          message.success("Coupon deleted successfully");
        } catch (error) {
          console.error("Error deleting coupon", error);
          message.error("Error deleting coupon");
        }
      },
    });
  };

  const handleAddCoupon = async (values) => {
    try {
      const formattedValues = {
        ...values,
        expiryDate: values.expiryDate.toISOString(),
      };

      const response = await fetch(
        `https://indigo-rhapsody-backend-ten.vercel.app/coupon/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );
      const newCoupon = await response.json();

      if (response.ok) {
        setCoupons([...coupons, newCoupon]);
        message.success("Coupon created successfully");
        form.resetFields();
        setIsModalVisible(false);
      } else {
        throw new Error(newCoupon.message || "Error creating coupon");
      }
    } catch (error) {
      console.error("Error creating coupon", error);
      message.error(error.message || "Error creating coupon");
    }
  };

  const disablePastDates = (current) => {
    return current && current < moment().startOf("day");
  };

  const columns = [
    {
      title: "Coupon Code",
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
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => showDeleteConfirm(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Coupon
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(coupons) ? coupons : []}
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
        <Form form={form} onFinish={handleAddCoupon} layout="vertical">
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
            rules={[
              { required: true, message: "Please enter amount" },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Amount cannot be negative")),
              },
            ]}
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
    </div>
  );
}

export default CouponPageTable;

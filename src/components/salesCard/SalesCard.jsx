import React from "react";
import { BlockContentWrap, BlockTitle } from "../../styles/global/default";
import {
  TotalOrders,
  TotalDesigners,
  TotalProducts,
  TotalUsers,
  TotalSales,
} from "../../service/DashboardApi";
import { useState, useEffect } from "react";
import { SalesBlockWrap } from "./SalesCard.styles";
// import { PiShoppingBagLight } from "react-icons/pi";
import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { FcCalculator } from "react-icons/fc";
import { MdOutlineDesignServices } from "react-icons/md";
import { MdDesignServices } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";

const SalesCard = () => {
  const [ordersCount, setOrdersCount] = useState(null);
  const [designersCount, setDesignersCount] = useState(null);
  const [productsCount, setProductsCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [totalSales, setTotalSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const ordersData = await TotalOrders();
        const designersData = await TotalDesigners();
        const productsData = await TotalProducts();
        const usersData = await TotalUsers();
        const salesData = await TotalSales();

        setOrdersCount(ordersData.totalOrders);
        setDesignersCount(designersData.totalDesigners);
        setProductsCount(productsData.totalProducts);
        setUsersCount(usersData.totalUsers);
        setTotalSales(salesData.totalSales);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <SalesBlockWrap>
      <div className="block-head">
        <div className="block-head-l">
          <BlockTitle className="block-title">
            <h3>Total Statistics </h3>
          </BlockTitle>
          <p className="Sales Summary">{error ? `Error: ${error}` : ""}</p>
        </div>
        <div className="block-head-r">
          <button type="button" className="export-btn">
            {/* <img src={Icons.ExportDark} alt="" /> */}

            <span className="text">Export</span>
          </button>
        </div>
      </div>
      <BlockContentWrap>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="cards">
            <div className="card-item card-misty-rose">
              <div className="card-item-icon">
                {/* <img src={Icons.CardOrder} alt="Orders Icon" /> */}
                {/* <PiShoppingBagLight /> */}
                <BiSolidShoppingBagAlt />
              </div>
              <div className="card-item-value">{ordersCount}</div>
              <p className="card-item-text text">Total Orders</p>
            </div>
            <div className="card-item card-latte">
              <div className="card-item-icon">
                {/* <img src={Icons.CardSales} alt="Sales Icon" /> */}
                <FcCalculator />
              </div>
              <div className="card-item-value">{`₹ ${totalSales}`}</div>
              <p className="card-item-text text">Total Sales</p>
            </div>
            <div className="card-item card-coffee">
              <div className="card-item-icon">
                {/* <img src={Icons.CardProduct} alt="Products Icon" /> */}
                <MdDesignServices />
              </div>
              <div className="card-item-value">{designersCount}</div>
              <p className="card-item-text text">Total Designers</p>
            </div>
            <div className="card-item card-nyanza">
              <div className="card-item-icon">
                {/* <img src={Icons.CardProduct} alt="Products Icon" /> */}
                <HiOutlineUserGroup />
              </div>
              {/* <div className="card-item-value">
                {productsData ? productsData.totalProducts : "N/A"}
              </div> */}
               <div className="card-item-value">{usersCount}</div>
              <p className="card-item-text text">Total Users</p>
            </div>
          </div>
        )}
      </BlockContentWrap>
    </SalesBlockWrap>
  );
};

export default SalesCard;

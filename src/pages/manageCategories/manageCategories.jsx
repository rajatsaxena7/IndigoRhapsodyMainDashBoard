import React from "react";
import { ManageCategoriesWrap } from "./manageCategories.styles";
import CategoryTable from "../../components/manageCategories/category/categoryTable";
import SubCategoryTable from "../../components/manageCategories/subCategory/subcategoryTable";

function ManageCategories() {
  return (
    <ManageCategoriesWrap>
      <CategoryTable />
      <SubCategoryTable />
    </ManageCategoriesWrap>
  );
}

export default ManageCategories;

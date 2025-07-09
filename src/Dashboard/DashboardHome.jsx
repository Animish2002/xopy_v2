import React from "react";
import Layout from "./Layout";
import ChartOne from "../components/Charts/ChartOne";
import ChartTwo from "../components/Charts/ChartTwo";
import CardDataStats from "../components/CardDataStats";
import { Eye, ShoppingCart, Package, Users } from "lucide-react";

const DashboardHome = () => {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="p-4 md:text-2xl text-lg font-semibold">
          Home
        </div>
      </div>
      
      {/* <div className="md:p-4 p-2">
        <div className="p-4 md:text-2xl text-lg ui font-semibold">Home</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats
            title="Total views"
            total="$3.456K"
            rate="0.43%"
            levelUp
          >
            <Eye className="h-6 w-6 text-blue-500 dark:text-white" />
          </CardDataStats>

          <CardDataStats
            title="Total Profit"
            total="$45,2K"
            rate="4.35%"
            levelUp
          >
            <ShoppingCart className="h-6 w-6 text-blue-500 dark:text-white" />
          </CardDataStats>

          <CardDataStats
            title="Total Product"
            total="2.450"
            rate="2.59%"
            levelUp
          >
            <Package className="h-6 w-6 text-blue-500 dark:text-white" />
          </CardDataStats>

          <CardDataStats
            title="Total Users"
            total="3.456"
            rate="0.95%"
            levelDown
          >
            <Users className="h-6 w-6 text-blue-500 dark:text-white" />
          </CardDataStats>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <ChartOne />
          <ChartTwo />
        </div>
      </div> */}
    </Layout>
  );
};

export default DashboardHome;

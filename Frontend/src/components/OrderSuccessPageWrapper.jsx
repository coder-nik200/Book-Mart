import OrderSuccessPage from "../pages/OrderSuccessPage";
import { useLocation } from "react-router-dom";

const OrderSuccessPageWrapper = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  if (!orderId) return <div>Invalid order</div>;
  return <OrderSuccessPage orderId={orderId} />;
};

export default OrderSuccessPageWrapper;

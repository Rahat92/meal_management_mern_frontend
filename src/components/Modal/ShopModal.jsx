import { createPortal } from "react-dom";

export const ShopModalPortal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById("shopModal")
  );
};
export default ShopModalPortal;
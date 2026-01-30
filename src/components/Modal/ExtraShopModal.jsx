import { createPortal } from "react-dom";

export const ExtraShopModalPortal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById("shopModal")
  );
};
export default ExtraShopModalPortal;
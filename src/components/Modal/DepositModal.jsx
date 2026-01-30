import { createPortal } from "react-dom";

export const DepositModalPortal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById("DepositModal")
  );
};
export default DepositModalPortal;
import React from 'react'

const UserHomeTableHeadContent = ({screenWidth,setMoneyOption,moneyOption,borderTotalDeposite,borderTotalShop, borderTotalExtraShop}) => {
  return (
    <table
    style={{
      width: "100%",
      textAlign: "center",
    }}
  >
    <tr>
      <td
        style={{
          width: "25%",
        }}
      >
        <span
          style={{
            display: "inline-block",
            marginLeft: "-1.4rem",
          }}
        >
          Meal
        </span>
      </td>
      {/* <td>jsj</td> */}
      <td
        style={{
          width: "25%",
          position: "relative",
          fontSize: "12px",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: "-.2rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          {screenWidth < 600 ? (
            <select
              style={{ fontSize: "14px" }}
              onChange={(e) => {
                setMoneyOption(e.target.value);
              }}
            >
              <option>Deposite</option>
              <option>Shopping</option>
              <option>Extra</option>
            </select>
          ) : (
            <p style={{ fontSize: "14px" }}>
              Deposite
            </p>
          )}
        </p>
        <p
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            marginTop: "3px",
          }}
        >
          {moneyOption === "Deposite"
            ? borderTotalDeposite
            : moneyOption === "Shopping"
            ? borderTotalShop
            : moneyOption === "Extra"
            ? borderTotalExtraShop
            : ""}{" "}
          Tk
        </p>
      </td>

      <td
        style={{
          width: "25%",
          position: "relative",
          fontSize: "12px",
          display:
            screenWidth < 600 ? "none" : "",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: "-.2rem",
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Shopping
        </p>
        <p
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            marginTop: "3px",
          }}
        >
          {borderTotalShop} Tk
        </p>
      </td>
      <td
        style={{
          width: "25%",
          position: "relative",
          fontSize: "12px",
          display:
            screenWidth < 600 ? "none" : "",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: "-.2rem",
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Extra Shop
        </p>
        <p
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            marginTop: "3px",
          }}
        >
          {borderTotalExtraShop} Tk
        </p>
      </td>
    </tr>
  </table>

  )
}

export default UserHomeTableHeadContent
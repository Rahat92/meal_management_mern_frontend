import tw from "tailwind-styled-components"

const Button = tw.div`
    ${(p) => (p.$primary ? "bg-indigo-600" : "bg-indigo-300")}
    md:fixed md:right-[6%] md:top-[10%] btn border-2 text-white cursor-pointer
`
export { Button }
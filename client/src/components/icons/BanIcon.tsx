import React from "react";

interface Props {
  className?: string;
}

const BanIcon: React.FC<Props> = ({ className }) => (
  <svg
    fill="#000000"
    xmlns="http://www.w3.org/2000/svg"
    width="800px"
    height="800px"
    viewBox="0 0 52 52"
    enableBackground="new 0 0 52 52"
    xmlSpace="preserve"
    className={className}
  >
    <path d="M26,2C12.8,2,2,12.8,2,26s10.8,24,24,24s24-10.8,24-24S39.2,2,26,2z M37.9,27.7c-0.1,0.7-0.7,1.3-1.5,1.3 H15.6c-0.8,0-1.4-0.5-1.5-1.3c-0.1-1.2-0.1-2.3,0-3.4c0.1-0.7,0.7-1.3,1.5-1.3h20.8c0.8,0,1.4,0.6,1.5,1.3 C38,25.5,38,26.6,37.9,27.7z" />
  </svg>
);

export default BanIcon;

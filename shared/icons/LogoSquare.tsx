import { useState, useEffect, type SVGProps } from 'react';

// Appending an empty string to the ID fixes display errors
const LogoSquareIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => {
  const [id, setId] = useState('');
  const clipPath = `clip${id}`;
  const paint1 = `paint1${id}`;
  const paint2 = `paint2${id}`;

  useEffect(() => {
    if (!id) {
      setId(Math.random().toString());
    }
  }, [id]);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath={`url(#${clipPath})`}>
        <path
          d="M16.0001 0V6.94813C16.0001 8.18335 15.617 9.37998 14.9254 10.3643C14.7104 10.6731 14.4674 10.953 14.1964 11.2135L14.1777 11.2232H10.9815V4.78649H8.01884H5.02819H4.7665H1.81323L1.85062 4.74789L4.35529 2.34499L5.28052 1.46683C6.32725 0.463209 7.61697 0 9.03753 0H16.0001Z"
          fill={`url(#${paint1})`}
        />
        <path
          d="M14.1776 11.2328L14.1682 11.2425L14.1589 11.2521L13.9907 11.4162L13.3551 12.0338L11.0467 14.2437L10.8224 14.456C9.7757 15.45 8.40187 15.9904 6.99065 15.9904H0V12.883L0.0093458 11.2232L0.0280374 9.01328C0.0373832 7.4017 0.682243 5.87698 1.82243 4.77686H4.7757H4.78505V11.2232H14.1776V11.2328Z"
          fill={`url(#${paint2})`}
        />
      </g>
      <defs>
        <linearGradient
          id={paint1}
          x1="9.24231"
          y1="-0.685443"
          x2="8.28813"
          y2="16.947"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#48EF8A" />
          <stop offset="0.5458" stopColor="#43B4A6" />
          <stop offset="0.6918" stopColor="#2D796F" />
          <stop offset="0.9662" />
        </linearGradient>
        <linearGradient
          id={paint2}
          x1="7.51082"
          y1="16.8652"
          x2="5.00743"
          y2="-1.19146"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF5F96" />
          <stop offset="0.6103" stopColor="#FF33AF" />
          <stop offset="1" />
        </linearGradient>
        <clipPath id={clipPath}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default LogoSquareIcon;

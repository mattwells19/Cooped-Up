import * as React from "react";

type IInfluenceSvgProps = React.SVGProps<SVGSVGElement> & { leftColor: string, rightColor: string };

export const InfluenceSvg: React.FC<IInfluenceSvgProps> = ({ leftColor, rightColor, children, ...props }) => (
  <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="200" height="280" rx="5" fill={rightColor}/>
    <path d="M0 5C0 2.23857 2.23858 0 5 0H100V280H5C2.23858 280 0 277.761 0 275V5Z" fill={leftColor}/>
    <rect x="9" y="9" width="182" height="262" rx="4" stroke="black" strokeWidth="2"/>
    {children}
  </svg>
);

export const InfluenceName: React.FC<React.SVGProps<SVGTextElement>> = ({ children, ...props }) => (
  <text
    textAnchor="middle"
    fontFamily="Nova Flat"
    fill="black"
    fontSize="40px"
    x="100"
    y="65"
    {...props}
  >
    {children}
  </text>
);

export const DetailTextGroup: React.FC<React.SVGProps<SVGGElement>> = ({ children, ...props }) => (
  <g textAnchor="middle" fill="black" fontSize="14px" fontWeight="500" {...props}>{children}</g>
);
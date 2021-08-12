import * as React from "react";

type IInfluenceSvgProps = React.SVGProps<SVGSVGElement> & { leftColor: string, rightColor: string };

const InfluenceSvg: React.FC<IInfluenceSvgProps> = ({ leftColor, rightColor, children, ...props }) => (
  <svg width="200" height="280" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="200" height="280" rx="5" fill={rightColor}/>
    <path d="M0 5C0 2.23857 2.23858 0 5 0H100V280H5C2.23858 280 0 277.761 0 275V5Z" fill={leftColor}/>
    <rect x="9" y="9" width="182" height="262" rx="4" stroke="black" strokeWidth="2"/>
    {children}
  </svg>
);

const InfluenceName: React.FC<React.SVGProps<SVGTextElement>> = ({ children, ...props }) => (
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

const DetailTextGroup: React.FC<React.SVGProps<SVGGElement>> = ({ children, ...props }) => (
  <g textAnchor="middle" fill="black" fontSize="14px" fontWeight="500" {...props}>{children}</g>
);


export const AmbassadorImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#BFC392" rightColor="#C1C5AB" {...props}>
    <InfluenceName x="100" y="60" fontSize="30px">Ambassador</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="181">
        Exchange cards with the
      </text>
      <text dx="100" dy="200">
        deck
      </text>

      <text x="100" y="240">
        Block being stolen from
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export const DukeImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#7A668F" rightColor="#87759B" {...props}>
    <InfluenceName>Duke</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="190">
        Collect 3 coins
      </text>

      <text x="100" y="240">
        Block Foreign Aid
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export const CaptainImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#93B4C6" rightColor="#AABCC5" {...props}>
    <InfluenceName>Captain</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="181">
        Steal 2 coins from another
      </text>
      <text dx="100" dy="200">
        player
      </text>

      <text x="100" y="240">
        Block being stolen from
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export const AssassinImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#414B52" rightColor="#515B62" {...props}>
    <InfluenceName>Assassin</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="200">
        Pay 3 coins to assassinate
      </text>
      <text dx="100" dy="220">
        another player
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export const ContessaImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#EB696A" rightColor="#EB8585" {...props}>
    <InfluenceName>Contessa</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="210">
        Block being assassinated
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export const BlankImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#C0C6E5" rightColor="#DCE1F1" {...props} />
);


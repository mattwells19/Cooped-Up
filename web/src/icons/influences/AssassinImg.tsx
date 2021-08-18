import * as React from "react";
import { InfluenceSvg, InfluenceName, DetailTextGroup } from "./InfluenceImage";

const AssassinImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
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

export default AssassinImg;

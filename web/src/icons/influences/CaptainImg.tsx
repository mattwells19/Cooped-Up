import * as React from "react";
import { InfluenceSvg, InfluenceName, DetailTextGroup } from "./InfluenceImage";

const CaptainImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
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

export default CaptainImg;

import * as React from "react";
import { InfluenceSvg, InfluenceName, DetailTextGroup } from "./InfluenceImage";

const AmbassadorImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
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

export default AmbassadorImg;
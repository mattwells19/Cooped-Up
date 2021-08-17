import * as React from "react";
import { InfluenceSvg, InfluenceName, DetailTextGroup } from "./InfluenceImage";

const DukeImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
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

export default DukeImg;
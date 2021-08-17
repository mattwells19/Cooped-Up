import * as React from "react";
import { InfluenceSvg, InfluenceName, DetailTextGroup } from "./InfluenceImage";

const ContessaImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#EB696A" rightColor="#EB8585" {...props}>
    <InfluenceName>Contessa</InfluenceName>
    <DetailTextGroup>
      <text x="100" y="210">
        Block being assassinated
      </text>
    </DetailTextGroup>
  </InfluenceSvg>
);

export default ContessaImg;
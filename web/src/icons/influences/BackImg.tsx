import * as React from "react";
import { InfluenceSvg } from "./InfluenceImage";

const BlankImg: React.FC<React.SVGProps<SVGSVGElement>> = ({ ...props }) => (
  <InfluenceSvg leftColor="#C0C6E5" rightColor="#DCE1F1" {...props} />
);

export default BlankImg;
// The same picture for Twitter / X cards.
import Image, { generateImageMetadata as ogMetadata } from "./opengraph-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const generateImageMetadata = ogMetadata;
export default Image;

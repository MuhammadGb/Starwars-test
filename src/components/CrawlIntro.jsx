import React from "react";
import Crawl from "react-star-wars-crawl";

import "react-star-wars-crawl/lib/index.css";

const IntroCrawl = ({ title, text }) => {
  return <Crawl title={title} text={text} />;
};

export default IntroCrawl;

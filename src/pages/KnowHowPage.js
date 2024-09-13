import React, { useState } from "react";
import CollapsibleExample from "../components/navmenu";
import UncontrolledExample from "../components/cover";
import LoginModal from "../components/modals/login";
import NewsCarousel from "../components/other/NewsCarousel";
import Section2 from "../components/section/section2";
import StatisticElectric from "../components/other/statisticselectric";
import Aboutsys from "../components/section/aboutsys";
import Credit from "../components/section/credit";
import Footer from "../components/section/footer";
import KnowHow from "../components/other/knowhow";

const KnowHowPage = () => {
  const [lnShow, setLnShow] = useState(false);

  return (
    <div>
        <CollapsibleExample loginShow={setLnShow} />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} />
<KnowHow></KnowHow>
      <Credit></Credit>
      <Footer></Footer>
    </div>
  );
};

export default KnowHowPage;

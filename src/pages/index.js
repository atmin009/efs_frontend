import React, { useState } from 'react';
import CollapsibleExample from '../components/navmenu'; 
import UncontrolledExample from '../components/cover'; 
import LoginModal from '../components/modals/login';
import NewsCarousel from '../components/other/NewsCarousel';
import Section2 from '../components/section/section2';
import StatisticElectric from '../components/other/statisticselectric';
import Aboutsys from '../components/section/aboutsys';
import Credit from '../components/section/credit';

const HomePage = () => {
  const [lnShow, setLnShow] = useState(false);

  return (
    <div>
      <CollapsibleExample 
        loginShow={setLnShow} 
      />
      <UncontrolledExample />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} /> 
      <div className='container'>
      <NewsCarousel></NewsCarousel>
      </div>
      <Section2></Section2>
<StatisticElectric></StatisticElectric>
<Aboutsys></Aboutsys>
<Credit></Credit>
    </div>
  );
};

export default HomePage;

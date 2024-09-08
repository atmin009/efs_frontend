import React, { useState, useEffect } from 'react';
import axios from 'axios';
import XMLParser from 'react-xml-parser';

const RSSFeed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get('https://cors-anywhere.herokuapp.com/https://www.wu.ac.th/th/feed/all');
        const xml = new XMLParser().parseFromString(response.data);
        const rssItems = xml.getElementsByTagName('item');
        setItems(rssItems);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
      }
    };

    fetchRSS();
  }, []);

  return (
    <div>
      <h2>ข่าวล่าสุด : มหาวิทยาลัยวลัยลักษณ์</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.getElementsByTagName('link')[0].value}>
              <h3>{item.getElementsByTagName('title')[0].value}</h3>
            </a>
            <p>{item.getElementsByTagName('description')[0].value}</p>
            <p><strong>วันที่เผยแพร่:</strong> {item.getElementsByTagName('pubDate')[0].value}</p>
            <img src={item.getElementsByTagName('enclosure')[0]?.attributes?.url} alt="thumbnail" width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSSFeed;

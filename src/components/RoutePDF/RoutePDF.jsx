import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Page, Text, View, Document, StyleSheet, Svg, Line } from '@react-pdf/renderer';
import getRouteDonations from '../../utils/routesUtils';
// import deliveryIcon from '../../assets/delivery.svg';

const RoutePDF = ({ routeID }) => {
  const [routeInfo, setRouteInfo] = useState({});
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const helper = async () => {
      const info = await getRouteDonations(routeID);
      setRouteInfo(info[0]);
      // console.log(info[0]);
      setDonations(info[0].donations);
    };
    helper();
  }, []);

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    section: {
      margin: 10,
      padding: 10,
      // flexGrow: 1
    },
    title: {
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontSize: 60,
      // marginLeft: "auto"
    },
    donationTitle: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 40,
    },
    subTitle: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: 20,
    },
  });
  const donationsList = donations.map(d => (
    <View key={d.id}>
      <Svg height="10" width="500">
        <Line x1="0" y1="0" x2="500" y2="0" strokeWidth={2} stroke="#939393" />
      </Svg>
      <Text style={styles.donationTitle}>Donation #{d.id}</Text>
      {/* <Svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.89807 11.7134C9.49249 11.7134 10.0015 11.5016 10.4252 11.0779C10.8481 10.655 11.0596 10.1463 11.0596 9.55188C11.0596 8.95746 10.8481 8.44842 10.4252 8.02476C10.0015 7.60182 9.49249 7.39035 8.89807 7.39035C8.30365 7.39035 7.79497 7.60182 7.37203 8.02476C6.94837 8.44842 6.73654 8.95746 6.73654 9.55188C6.73654 10.1463 6.94837 10.655 7.37203 11.0779C7.79497 11.5016 8.30365 11.7134 8.89807 11.7134ZM8.89807 19.657C11.0956 17.6396 12.7258 15.8066 13.7885 14.1581C14.8513 12.5103 15.3827 11.0469 15.3827 9.76803C15.3827 7.80464 14.7565 6.19682 13.5043 4.94458C12.2528 3.69305 10.7174 3.06729 8.89807 3.06729C7.07878 3.06729 5.54301 3.69305 4.29077 4.94458C3.03924 6.19682 2.41348 7.80464 2.41348 9.76803C2.41348 11.0469 2.94486 12.5103 4.00761 14.1581C5.07036 15.8066 6.70051 17.6396 8.89807 19.657ZM8.89807 22.1158C8.75396 22.1158 8.60986 22.0887 8.46576 22.0347C8.32166 21.9807 8.19557 21.9086 8.08749 21.8186C5.45763 19.4949 3.49425 17.3381 2.19733 15.348C0.900412 13.3572 0.251953 11.4973 0.251953 9.76803C0.251953 7.06612 1.12125 4.9136 2.85984 3.31046C4.59771 1.70733 6.61045 0.905762 8.89807 0.905762C11.1857 0.905762 13.1984 1.70733 14.9363 3.31046C16.6749 4.9136 17.5442 7.06612 17.5442 9.76803C17.5442 11.4973 16.8957 13.3572 15.5988 15.348C14.3019 17.3381 12.3385 19.4949 9.70864 21.8186C9.60056 21.9086 9.47447 21.9807 9.33037 22.0347C9.18627 22.0887 9.04217 22.1158 8.89807 22.1158Z" fill="black" fill-opacity="0.92"/>
        </Svg> */}
      <Text>Delivery Address:</Text>
      <Text>
        {d.firstName} {d.lastName}
      </Text>
      <Text>Comments: {d.notes}</Text>
    </View>
  ));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>Route Summary</Text>
          <Text>{routeInfo.id}</Text>
        </View>
        {/* <View>
                {donations.map(d => <Text style={styles.donationTitle}>donation #{d.id}</Text>)}
              </View> */}

        {donationsList}
      </Page>
    </Document>
  );
};
RoutePDF.propTypes = {
  routeID: PropTypes.number.isRequired,
};
export default RoutePDF;

import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Line,
  Image,
  Font,
} from '@react-pdf/renderer';
import { getRouteDonations, getDriver } from '../../utils/routesUtils';
import { formatPhone } from '../../utils/utils';
import deliveryIcon from '../../assets/delivery.png';
import itemIcon from '../../assets/item.png';
import emailIcon from '../../assets/email.png';
import phoneIcon from '../../assets/phone.png';
import driverIcon from '../../assets/driver.png';
// import timeIcon from '../../assets/time.png';
import InterRegular from '../../assets/Inter/Inter-Regular.ttf';
import InterBold from '../../assets/Inter/Inter-Bold.ttf';

const RoutePDF = ({ routeID }) => {
  const [donations, setDonations] = useState([]);
  const [driver, setDriver] = useState('');
  const [dateStr, setDateStr] = useState('');

  Font.register({
    family: 'Inter',
    fonts: [
      { src: InterRegular, fontStyle: 'normal' }, // font-style: normal, font-weight: normal
      { src: InterBold, fontWeight: 'bold' },
    ],
  });

  useEffect(() => {
    const helper = async () => {
      const info = await getRouteDonations(routeID);

      setDonations(info.donations);

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(info.date);
      setDateStr(date.toLocaleDateString('en-US', options));

      const driverName = await getDriver(info.driverId);
      setDriver(driverName);
    };
    helper();
  }, []);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      margin: 30,
      fontSize: 13,
      fontFamily: 'Inter',
    },
    section: {
      margin: 10,
      padding: 10,
    },
    title: {
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontSize: 40,
    },
    date: {
      fontSize: 23,
      marginBottom: 20,
    },
    donationTitle: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
      marginTop: 10,
    },
    subTitle: {
      fontWeight: 'bold',
    },
    donorInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 520,
      marginBottom: 20,
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    indent: {
      marginLeft: 18,
    },
    icon: {
      width: 8,
      marginRight: 10,
      alignSelf: 'center',
    },
    iconTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    furnitureList: {
      marginBottom: 30,
    },
  });
  const donationsList = donations.map(d => (
    <View key={d.id}>
      <Svg height="10" width="520">
        <Line x1="0" y1="0" x2="520" y2="0" strokeWidth={2} stroke="#939393" />
      </Svg>

      <Text style={styles.donationTitle}>Donation #{d.id}</Text>
      <View style={styles.donorInfo}>
        <View>
          <View style={styles.iconTitleContainer}>
            <Image src={deliveryIcon} style={styles.icon} />
            <Text style={styles.subTitle}>Delivery Address:</Text>
          </View>
          <Text style={styles.indent}>
            {d.firstName} {d.lastName}
          </Text>
          <Text style={styles.indent}>
            {d.addressStreet} {d.addressUnit ? `, ${d.addressUnit}` : ''}
          </Text>
          <Text style={styles.indent}>
            {d.addressCity}, {d.addressZip}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.iconTitleContainer}>
            <Image src={emailIcon} style={styles.icon} />
            <Text> {d.email} </Text>
          </View>
          <View style={styles.iconTitleContainer}>
            <Image src={phoneIcon} style={styles.icon} />
            <Text> {formatPhone(d.phoneNum)} </Text>
          </View>
          <View style={styles.iconTitleContainer}>
            <Image src={driverIcon} style={styles.icon} />
            <Text> {driver} </Text>
          </View>
        </View>
      </View>

      <View style={styles.furnitureList}>
        <View style={styles.iconTitleContainer}>
          <Image src={itemIcon} style={styles.icon} />
          <Text style={styles.subTitle}>Number of Items: {d.furniture.length}</Text>
        </View>
        {d.furniture.map((f, index) => (
          <Text style={styles.indent} key={f.id}>
            {index + 1}. {f.name}
          </Text>
        ))}
      </View>
    </View>
  ));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Route Summary</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        {donationsList}
      </Page>
    </Document>
  );
};
RoutePDF.propTypes = {
  routeID: PropTypes.number.isRequired,
};
export default RoutePDF;

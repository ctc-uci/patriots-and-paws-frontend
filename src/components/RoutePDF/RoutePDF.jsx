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
import { formatDatePDF } from '../../utils/RouteUtils';
import { formatPhonePDF } from '../../utils/utils';
import deliveryIcon from '../../assets/delivery.png';
import itemIcon from '../../assets/item.png';
import emailIcon from '../../assets/email.png';
import phoneIcon from '../../assets/phone.png';
import commentIcon from '../../assets/comment.png';
import InterRegular from '../../assets/Inter/Inter-Regular.ttf';
import InterBold from '../../assets/Inter/Inter-Bold.ttf';

const RoutePDF = ({ driverData, donationData, date }) => {
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
      setDonations(donationData);
      setDateStr(formatDatePDF(new Date(date)));
      setDriver(`${driverData.firstName} ${driverData.lastName}`);
    };
    helper();
  }, []);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      margin: 30,
      fontSize: 13,
      fontFamily: 'Inter',
      paddingBottom: 30,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    title: {
      fontWeight: 'bold',
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
      marginTop: 15,
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
      marginBottom: 20,
    },
    donation: {
      marginBottom: 30,
    },
    pageNumbers: {
      position: 'absolute',
      top: 0,
      right: 60,
      textAlign: 'center',
    },
  });

  const donationsList = donations?.map(
    ({
      id,
      firstName,
      lastName,
      addressStreet,
      addressUnit,
      addressCity,
      addressZip,
      email,
      phoneNum,
      furniture,
      notes,
    }) => (
      <View key={id} style={styles.donation}>
        <Svg height="10" width="520">
          <Line x1="0" y1="0" x2="520" y2="0" strokeWidth={2} stroke="#939393" />
        </Svg>

        <Text style={styles.donationTitle}>Donation #{id}</Text>
        <View style={styles.donorInfo}>
          <View>
            <View style={styles.iconTitleContainer}>
              <Image src={deliveryIcon} style={styles.icon} />
              <Text style={styles.subTitle}>Delivery Address:</Text>
            </View>
            <Text style={styles.indent}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.indent}>
              {addressStreet} {addressUnit ? `, ${addressUnit}` : ''}
            </Text>
            <Text style={styles.indent}>
              {addressCity}, {addressZip}
            </Text>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.iconTitleContainer}>
              <Image src={emailIcon} style={styles.icon} />
              <Text> {email} </Text>
            </View>
            <View style={styles.iconTitleContainer}>
              <Image src={phoneIcon} style={styles.icon} />
              <Text> {formatPhonePDF(phoneNum)} </Text>
            </View>
          </View>
        </View>

        <View style={styles.furnitureList}>
          <View style={styles.iconTitleContainer}>
            <Image src={itemIcon} style={styles.icon} />
            <Text style={styles.subTitle}>
              Number of Items: {furniture.reduce((acc, { count }) => acc + count, 0)}
            </Text>
          </View>
          {furniture.map(({ id: fid, name, count }) => (
            <Text style={styles.indent} key={fid}>
              {'\u2022'} {count}x {name}
            </Text>
          ))}
        </View>

        {notes && (
          <View>
            <View style={styles.iconTitleContainer}>
              <Image src={commentIcon} style={styles.icon} />
              <Text style={styles.subTitle}>Notes:</Text>
            </View>
            <Text style={styles.indent}>{notes}</Text>
          </View>
        )}
      </View>
    ),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
        <View
          render={({ pageNumber }) =>
            pageNumber === 1 && (
              <View>
                <Text style={styles.title}>Route Summary</Text>
                <Text style={styles.date}>
                  {dateStr} | {driver}
                </Text>
              </View>
            )
          }
        />
        {donationsList}
      </Page>
    </Document>
  );
};

RoutePDF.propTypes = {
  driverData: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    role: PropTypes.string,
  }),
  donationData: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    addressStreet: PropTypes.string,
    addressUnit: PropTypes.string,
    addressCity: PropTypes.string,
    addressZip: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNum: PropTypes.string,
    notes: PropTypes.string,
    submittedDate: PropTypes.string,
    pickupDate: PropTypes.string,
    routeId: PropTypes.number,
    pictures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        imageURL: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
  }),
  date: PropTypes.instanceOf(Date).isRequired,
};

RoutePDF.defaultProps = {
  donationData: {},
  driverData: {},
};

export default RoutePDF;

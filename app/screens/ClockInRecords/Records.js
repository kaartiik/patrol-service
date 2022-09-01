import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import LoadingIndicator from '../../components/LoadingIndicator';

import commonStyles from '../../providers/constants/commonStyles';
import colours from '../../providers/constants/colours';
import * as ROLES from '../../providers/constants/roles';

import AltitudeIcon from '../../../assets/icons/AltitudeIcon';
import LatitudeIcon from '../../../assets/icons/LatitudeIcon';
import LongitudeIcon from '../../../assets/icons/LongitudeIcon';

import {
  getClockins,
  getRecorderClockins,
} from '../../providers/actions/Checkpoint';

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  cardContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardText: {
    marginVertical: 5,
  },
  recipeItem: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  previewImg: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.veryLightPink,
    borderRadius: 3,
    padding: 5,
  },
  geographicContainer: {
    height: 80,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 6,
  },
  geographicInfoText: { textAlign: 'center', color: colours.white },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 10,
  },
});

const Altitude = ({ info }) => (
  <LinearGradient
    colors={[colours.gradientBlueDark, colours.gradientBleLight]}
    style={styles.geographicContainer}
  >
    <AltitudeIcon size={40} colour={colours.white} />
    <Text numberOfLines={2} style={styles.geographicInfoText}>Altitude: {info}</Text>
  </LinearGradient>
);

const Latitude = ({ info }) => (
  <LinearGradient
    style={styles.geographicContainer}
    colors={[colours.gradientBlueDark, colours.gradientBleLight]}
  >
    <LatitudeIcon size={40} colour={colours.white} />
    <Text numberOfLines={2} style={styles.geographicInfoText}>Latitude: {info}</Text>
  </LinearGradient>
);

const Longitude = ({ info }) => (
  <LinearGradient
    style={styles.geographicContainer}
    colors={[colours.gradientBlueDark, colours.gradientBleLight]}
  >
    <LongitudeIcon size={40} colour={colours.white} />
    <Text numberOfLines={2} style={styles.geographicInfoText}>Longitude: {info}</Text>
  </LinearGradient>
);

const RenderItem = ({ item }) => {
  return (
    <View style={styles.cardContainer}>
      <Text
        style={{
          fontSize: 15,
          marginVertical: 3,
          flexShrink: 1,
        }}
      >
        {item.clocked_in_at}
      </Text>
      <Text style={styles.cardText}>Recorder: {item.recorder}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Altitude info={item.altitude} />
        <Latitude info={item.latitude} />
        <Longitude info={item.longitude} />
      </View>
      {/* <Text style={styles.recipeDescription}>Altitude: {item.altitude}</Text>

        <Text style={styles.recipeDescription}>Latitude: {item.latitude}</Text>
        <Text style={styles.recipeDescription}>
          Longitude: {item.longitude}
        </Text> */}

      <Text style={styles.cardText}>Address: {item.address}</Text>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Records({ route, navigation }) {
  const { siteID } = route.params;
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const { role, clockIns, isLoading } = useSelector((state) => ({
    role: state.userReducer.role,
    clockIns: state.checkpointReducer.clockIns,
    isLoading: state.appActionsReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      if (siteID !== '' && siteID !== null && siteID !== undefined) {
        if (role === ROLES.ADMIN) {
          dispatch(getClockins(siteID));
        } else {
          dispatch(getRecorderClockins(siteID));
        }
      }
    }, [])
  );

  useEffect(() => {
    setData([...clockIns]);
  }, [clockIns]);

  const searchData = (searchText) => {
    let newData = [];
    if (searchText) {
      newData = clockIns.filter((item) => {
        const uSearchText = searchText.toUpperCase();
        const checkpoint = item.checkpoint.toUpperCase();
        const recorder = item.recorder.toUpperCase();

        return (
          checkpoint.indexOf(uSearchText) > -1 ||
          recorder.indexOf(uSearchText) > -1
        );
      });
      setData([...newData]);
    } else {
      setData([...clockIns]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <View>
          <Text style={commonStyles.screenHeaderText}>Records</Text>

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data}
            ListHeaderComponent={
              <View style={styles.textboxContainer}>
                <TextInput
                  placeholder="Search by checkpoint or recorder..."
                  value={search}
                  onChangeText={(text) => {
                    setSearch(text);
                    searchData(text);
                  }}
                />
              </View>
            }
            renderItem={({ item, index }) => (
              <RenderItem key={index} item={item} />
            )}
            ListEmptyComponent={
              <View style={styles.flatlistEmptyContainer}>
                <Text>No clock in records yet</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

export default Records;

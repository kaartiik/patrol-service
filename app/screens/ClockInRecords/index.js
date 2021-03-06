import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../../components/LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getClockinSiteNames,
  getRecorderClockinSiteNames,
} from '../../providers/actions/Checkpoint';
import colours from '../../providers/constants/colours';
import commonStyles from '../../providers/constants/commonStyles';
import * as ROLES from '../../providers/constants/roles';

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 10,
  },
});

const RenderItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        marginVertical: 10,
        padding: 10,
        backgroundColor: colours.white,
        borderRadius: 6,
      }}
      onPress={() => navigation.navigate('Records', { siteID: item.siteID })}
    >
      <Text style={{ fontWeight: 'bold' }} numberOfLines={1}>
        {item.siteName}
      </Text>
    </TouchableOpacity>
  );
};

export default function ClockInSites() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const { role, clockInSiteNames, isLoading } = useSelector((state) => ({
    role: state.userReducer.role,
    clockInSiteNames: state.checkpointReducer.clockInSiteNames,
    isLoading: state.appActionsReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      if (role === ROLES.ADMIN) {
        console.log('get admin sitenames');
        dispatch(getClockinSiteNames());
      } else {
        dispatch(getRecorderClockinSiteNames());
      }
    }, [])
  );

  useEffect(() => {
    setData(clockInSiteNames);
  }, [clockInSiteNames]);

  const searchData = (searchText) => {
    let newData = [];
    if (searchText) {
      newData = clockInSiteNames.filter((item) => {
        return item.siteName.indexOf(searchText) > -1;
      });
      setData([...newData]);
    } else {
      setData([...clockInSiteNames]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {isLoading ? (
        <Loading />
      ) : (
        <View>
          <Text style={commonStyles.screenHeaderText}>Records - Sites</Text>

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data}
            ListHeaderComponent={
              <View style={styles.textboxContainer}>
                <TextInput
                  placeholder="Search..."
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
                <Text>No sites</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

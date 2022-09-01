import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { Picker } from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSite } from '../../providers/actions/User';
import Loading from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';
import * as ROLES from '../../providers/constants/roles';
import commonStyles from '../../providers/constants/commonStyles';

import { getSites } from '../../providers/actions/Sites';

import { Ionicons } from '@expo/vector-icons';

// import { AuthContext } from '../navigation/AuthProvider';\

const IMAGE_DIMENSION = 50;

const styles = StyleSheet.create({
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  bigBtn: {
    marginVertical: 5,
    marginHorizontal: 30,
    backgroundColor: colours.themePrimary,
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
  pickerContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    marginVertical: 10,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
});

const validationSchema = yup.object().shape({
  siteID: yup.string().required('Required'),
});

export default function UpdateUser({ route }) {
  LayoutAnimation.easeInEaseOut();
  const { userObject } = route.params;
  const dispatch = useDispatch();

  const { allSites, isLoading } = useSelector((state) => ({
    allSites: state.sitesReducer.allSites,
    isLoading: state.appActionsReducer.isLoading,
  }));

  useEffect(() => {
    dispatch(getSites());
  }, []);

  const handleUpdate = ({ siteID }) => {
    dispatch(updateUserSite(userObject, siteID));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Formik
              initialValues={{
                siteID: userObject.siteID ? userObject.siteID : '',
              }}
              onSubmit={(values) => handleUpdate(values)}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                touched,
                values,
                submitCount,
                errors,
              }) => {
                return (
                  <View style={{ padding: 10 }}>
                    <Text style={commonStyles.screenHeaderText}>
                      Update User
                    </Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                      <Text>Name: </Text>
                      <Text style={{ fontWeight: 'bold' }}>
                        {userObject.name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                      <Text>Email: </Text>
                      <Text style={{ fontWeight: 'bold' }}>
                        {userObject.email}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                      <Text>User Role: </Text>
                      <Text style={{ fontWeight: 'bold' }}>
                        {userObject.role}
                      </Text>
                    </View>

                    {userObject.role !== ROLES.ADMIN && (
                      <>
                        <Text style={{ marginTop: 10 }}>Site Name: </Text>
                        <View style={styles.pickerContainer}>
                          <Picker
                          iosIcon={<Ionicons
                            name="ios-chevron-down"
                            size={10}
                            style={{position: 'absolute', top: 'auto', right: -250}}
                            color={colours.themePrimary}
                          />}
                            selectedValue={values.siteID}
                            onValueChange={(value) =>
                              setFieldValue('siteID', value)
                            }
                          >
                            <Picker.Item label="Assign user site" value="" />
                            {allSites.map((item) => (
                              <Picker.Item
                                key={item.siteID}
                                label={item.siteName}
                                value={item.siteID}
                              />
                            ))}
                          </Picker>
                        </View>
                        <Text style={{ color: 'red' }}>
                          {(touched.siteID || submitCount > 0) && errors.siteID}
                        </Text>

                        <TouchableOpacity
                          style={styles.bigBtn}
                          onPress={handleSubmit}
                          title="SUBMIT"
                        >
                          <Text style={{ color: 'white' }}>Update User</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                );
              }}
            </Formik>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

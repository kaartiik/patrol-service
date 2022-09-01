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
import { createUser } from '../../providers/actions/User';
import Loading from '../../components/LoadingIndicator';
import commonStyles from '../../providers/constants/commonStyles';

import colours from '../../providers/constants/colours';
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
    padding: 10,
    marginVertical: 10,
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
  inputTitle: { color: 'black' },
});

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  siteID: yup.string().required('Required'),
  email: yup.string().required('Required').email('Please enter a valid email'),
  password: yup.string().required('Required').min(6, 'Minimum 6 characters'),
});

export default function CreateUser({ navigation }) {
  LayoutAnimation.easeInEaseOut();
  const dispatch = useDispatch();

  const { allSites, isLoading } = useSelector((state) => ({
    allSites: state.sitesReducer.allSites,
    isLoading: state.userReducer.isLoading,
  }));

  useEffect(() => {
    dispatch(getSites());
  }, []);

  const handleRegister = ({ name, siteID, email, password }) => {
    dispatch(createUser(name, siteID, email, password));
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
                name: '',
                siteID: '',
                email: '',
                password: '',
              }}
              onSubmit={(values) => handleRegister(values)}
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
                      Create User
                    </Text>

                    <Text style={styles.inputTitle}>Name: </Text>
                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter name..."
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.name || submitCount > 0) && errors.name}
                    </Text>

                    <Text style={styles.inputTitle}>Site Name: </Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        iosIcon={<Ionicons
                        name="ios-chevron-down"
                        size={10}
                        style={{position: 'absolute', top: 'auto', right: -200}}
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

                    <Text style={styles.inputTitle}>Email: </Text>
                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter email..."
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.email || submitCount > 0) && errors.email}
                    </Text>

                    <Text style={styles.inputTitle}>Password: </Text>
                    <View style={styles.textboxContainer}>
                      <TextInput
                        secureTextEntry
                        placeholder="Enter password..."
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.password || submitCount > 0) && errors.password}
                    </Text>

                    <TouchableOpacity
                      style={styles.bigBtn}
                      onPress={handleSubmit}
                      title="SUBMIT"
                    >
                      <Text style={{ color: 'white' }}>Add User</Text>
                    </TouchableOpacity>
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

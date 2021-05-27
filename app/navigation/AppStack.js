import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';
import BreakfastRecipes from '../screens/BreakfastRecipes';
import LunchRecipes from '../screens/LunchRecipes';
import DinnerRecipes from '../screens/DinnerRecipes';
import Recipe from '../screens/Recipe';
import EditRecipe from '../screens/EditRecipe';
import ImagePicker from '../screens/UploadRecipe/ImagePicker';
import BarcodeScannerScreen from '../screens/Home/BarcodeScanner';

const Stack = createStackNavigator();

export default function MainStack() {
  // const { isAdmin } = useContext(AuthContext);

  const { isAdmin } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
  }));

  return (
    <Stack.Navigator initialRouteName="MyTabs" mode="modal" headerMode="none">
      <Stack.Screen name="MyTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="BarcodeScannerScreen"
        component={BarcodeScannerScreen}
      />
      <Stack.Screen name="BreakfastRecipes" component={BreakfastRecipes} />
      <Stack.Screen name="LunchRecipes" component={LunchRecipes} />
      <Stack.Screen name="DinnerRecipes" component={DinnerRecipes} />
      <Stack.Screen name="Recipe" component={Recipe} />
      <Stack.Screen name="EditRecipe" component={EditRecipe} />
      <Stack.Screen name="ImagePicker" component={ImagePicker} />
    </Stack.Navigator>
  );
}

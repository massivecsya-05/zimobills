import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FaultReportScreen from '../screens/FaultReportScreen';
import BillsScreen from '../screens/BillsScreen';
import TokensScreen from '../screens/TokensScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import BillCalculatorScreen from '../screens/BillCalculatorScreen';
import TipsScreen from '../screens/TipsScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Faults" component={FaultReportScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen name="Tokens" component={TokensScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsScreen} />
      <Tab.Screen name="Calculator" component={BillCalculatorScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="News" component={AnnouncementsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Tabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

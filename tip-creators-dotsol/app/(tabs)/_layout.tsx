import { Tabs } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The index redirects to the home screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vibe-score"
        options={{
          title: 'Vibe Score',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="star.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="wallet.pass.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      {/* Hidden screens for navigation */}
      <Tabs.Screen name="qr-scanner" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="tip" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen name="demo" options={{ tabBarItemStyle: { display: 'none' } }} />
    </Tabs>
  )
}

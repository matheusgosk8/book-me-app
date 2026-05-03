import React from 'react';
import { Slot } from 'expo-router';
import useRequireAuth from '@/hooks/useRequireAuth';

export default function HomeLayout() {
  useRequireAuth();
  return <Slot />;
}

import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginForm from '@/components/forms/LoginForm'
import useRedirectIfAuth from '@/hooks/useRedirectIfAuth';

type Props = {}

const LogIn = (props: Props) => {
  useRedirectIfAuth();
  return (
    <ScrollView>
      <LoginForm/>
    </ScrollView>
  )
}

export default LogIn

const styles = StyleSheet.create({})
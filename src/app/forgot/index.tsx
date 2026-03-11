import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginForm from '@/components/forms/ForgotForm'
import ForgotPasswordForm from '@/components/forms/ForgotForm'

type Props = {}

const LogIn = (props: Props) => {
  return (
    <ScrollView>
      <ForgotPasswordForm/>
    </ScrollView>
  )
}

export default LogIn

const styles = StyleSheet.create({})
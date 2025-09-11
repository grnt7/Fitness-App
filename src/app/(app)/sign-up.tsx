import * as React from 'react'
import { Alert, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    if (!emailAddress || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return
    }

    setIsLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    if (!code) {
        Alert.alert("Error", "Please enter the verification code");
        return
    }

    setIsLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <Ionicons name="mail-open-outline" size={64} color="#3B82F6" className="mb-6" />
        <Text className="text-xl font-bold mb-4">Check your email</Text>
        <Text className="text-xs  mb-4">We've sent a verification code to {emailAddress}</Text>
        <TextInput
          value={code}
          placeholder="Enter your 6-digit code"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
          className="w-full p-4 border rounded-lg border-gray-300 mb-4 text-center text-lg"
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={onVerifyPress}
          className="w-full bg-blue-600 rounded-lg p-4 items-center"
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>
        {/* Resend code */}
        <TouchableOpacity>
            <Text className="text-blue-600 font-medium text-sm mt-4">Didn't receive the code? Resend</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="flex-1 justify-center">
          {/* Logo and Branding */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center">
              <Ionicons
                name="fitness"
                size={40}
                color="white"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.4)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 10,
                }}
              />
            </View>
            <Text className="text-gray-900 text-2xl font-bold ">
              Join FitTracker
            </Text>
            <Text className="text-md text-gray-600 text-center mt-2">
              Start your fitness journey{"\n"}and achieve your goals!
            </Text>
          </View>

          {/* Sign-Up form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2 text-center">Create your account</Text>
            
            {/* Email input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="ml-3 flex-1 text-gray-900"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a  password"
                  secureTextEntry={true}
                  className="ml-3 flex-1 text-gray-900"
                  editable={!isLoading}
                />
              
              </View>
                <Text className="text-xs  text-gray-500 mb-2">Must be at least 8 characters</Text>
            </View>

            {/* Continue button */}
           <TouchableOpacity onPress={onSignUpPress}
      disabled={isLoading}
      className={`rounded-xl py-2  mb-4  ${isLoading ? 'bg-gray-400' : 'bg-blue-600' }`}
      activeOpacity={0.8}
      >
        <View className="flex-row justify-center items-center">

        {isLoading ? (
            <Ionicons name="refresh" size={20} color="white"  />
        ) : (
            <Ionicons name="person-add-outline" size={20} color="white" />
            // <Text className="text-white text-lg font-semibold">
            //     Sign In
            // </Text>
        )}
        <Text className="text-white text-lg font-semibold ml-2">
            {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
        </View>
      </TouchableOpacity>

      {/* Terms */}
      <Text className="text-xs text-gray-500 mb-4 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
      </Text>
          </View>
          {/* Sign in Link */}

         
          <View className="flex-row justify-center items-center mb-2 pb-6">
            <Text className="text-gray-600 text-sm">
              Already have an account?  </Text>
                 
            <Link href="/sign-in">
              <Text className="text-blue-600 font-bold ml-2  ">
                  Sign in
              </Text>
            </Link>
          </View>
        </View>
        {/* Footer */}
        <View className="pb-2">
            <Text className="text-center text-gray-500 text-sm mb-4 ">
                Ready to transform your fitness journey? 
            </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

function Workout() {
   const router = useRouter();

  const startWorkout = () => {
    //navigate to active screen
    router.push("/active-workout");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
    <StatusBar barStyle="dark-content" />

    {/* Main Start workout Screen */}
<View className="flex-1 px-6">
  {/* Header */}
  <View className='pt-8 pb-6'>
    <Text className='text-3xl font-bold text-gray-900 mb-2'>
      Ready to Train?
    </Text>
      <Text className='text-lg text-gray-600'>
        Start your workout session
      </Text>
   </View>
</View>
{/* Generic Start Workout Card */}
<View className='bg-white rounded-3xl p-6 shadow-sm border 
border-gray-100 mx-6 mb-8'>
  <View className='flex-row items-center justify-between mb-6'>
    <View className='flex-row items-center'>
      <View className='w-12 h-12 bg-blue-100 rounded-full items-center 
      justify-center mr-3'>
        <Ionicons name="fitness" size={24} color="#3B82F6" />
      </View>
      <View >
        <Text className='text-xl font-semibold text-gray-900'>
          Start Workout
        </Text>
           <View className='bg-green-100 px-3 py-1 rounded-full'>
      <Text className='text-green-700 font-medium text-sm'>Ready</Text>
    </View>
        <Text className='text-gray-500'>Begin your training session</Text>
        </View>
     </View>
    </View>
    {/* Start button */}
<TouchableOpacity
onPress={startWorkout}
className="bg-blue-600 rounded-2xl py-4 items-center
active-bg-blue-700"
activeOpacity={0.8}
>
<View className='flex-row items-center'>
<Ionicons 
name="play"
size={20}
color="white"
style={{marginRight: 8 }}
/>
</View>
</TouchableOpacity>
</View>
   
    </SafeAreaView>
  )
}

export default Workout;
   
     
 
        
      

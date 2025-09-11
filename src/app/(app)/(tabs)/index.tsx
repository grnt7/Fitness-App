import { useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getWorkoutsQuery } from "./history";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { client } from "@/lib/sanity/client";
import workout from "fitness-app/schemaTypes/workout";
import { formatDuration } from "lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomePage() {

const{user } = useUser();
const router = useRouter();
const [workouts, setWorkouts ] = useState<GetWorkoutsQueryResult>([]);
const [ loading, setLoading ] = useState(true);
const [ refreshing, setRefreshing ] = useState(false)


const fetchWorkouts = async () => {
  if (!user?.id) return;


  try {
    const results = await client.fetch(getWorkoutsQuery, { userId: user.id });
    setWorkouts(results);
  } catch (error) {
    console.error("Error fetching workouts:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

useEffect(() => {
  fetchWorkouts();
}, [user?.id]);

const onRefresh = () => {
  setRefreshing(true);
  fetchWorkouts();
}

// Calculate stats
const totalWorkouts = workouts.length;
const lastWorkout = workouts[0];
const totalDuration = workouts.reduce(
  (sum, workout) => sum + (workout.duration || 0),
  0
);


const averageDuration = 
totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

const formatDate = (dateString: string) => {
const date = new Date(dateString);
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

if (date.toDateString() === today.toDateString()) {
return "Today";

} else if (date.toDateString() === yesterday.toDateString()) {
  return "Yesterday";
 } else {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
 }
}


const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
  return(
    workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0);
    }, 0) || 0
  );
};

if (loading) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center">
<ActivityIndicator/>
<Text className="text-gray-600 mt-4">Loading your stats...</Text>
      </View>

    </SafeAreaView>
  )
}



  return (
    <SafeAreaView className="flex flex-1 bg-gray-50">
      <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>

      }
      >

        {/* Header */}
        <View className="px-6 pt-8 pb-6">
      <Text className="text-lg text-gray-600">
      Welcome Back,
      </Text>
      <Text className="text-3xl font-bold text-gray-900">
        {user?.firstName || "Athlete"}!💪
      </Text>
        </View>

          <View className="px-6 mb-8">
              <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Your Fitness Stats
          </Text>
        
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
          <Text className="text-2xl font-bold text-blue-600">
            {totalWorkouts}
          </Text>
          <Text className="text-sm text-gray-600 text-center">
        Total{"\n"}Workouts
          </Text>
            </View>
        
            <View className="items-center flex-1">
        <Text className="text-2xl font-bold text-green-600">
        {formatDuration(totalDuration)}
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Total{"\n"}Time
        </Text>
            </View>
          {/* <View className="items-center flex-1">
        <Text className="text-2xl font-bold text-purple-600">
          {daysSinceJoining}
        </Text>
        <Text className="text-sm text-gray-600 text-center">
          Days{"\n"}Active
        </Text>
          </View> */}
          </View>
        {totalWorkouts > 0 && (
          <View className="mt-4 pt-4 border-t border-gray-100">
            <View className="flex-row items-center justify-between">
        <Text className="text-gray-600">
        Average workout duration
        </Text>
        <Text className="font-semibold text-gray-900">
        {formatDuration(averageDuration)}
        </Text>
            </View>
        
          </View>
        )}
        
        
              </View>
              </View>
        {/* Quick Actions */}
        <View className="px-6 mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </Text>
        {/* Start Workout Button */}

<TouchableOpacity
onPress={() => router.push("/workout")}
className="bg-blue-600 rounded-2xl p-6 mb-4 shadow-sm"
activeOpacity={0.8}
>
<View className="flex-row items-center justify-between">
<View className="flex-row items-center flex-1">
<View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
<Ionicons name="play" size={24} color="white"/>
</View>
<View>
  <Text className="text-white text-xl font-semibold">
  Start Workout
</Text>
<Text className="text-blue-100">
  Begin your Training Session
</Text>
</View>
</View>
<Ionicons name="chevron-forward" size={24} color="white"/>
</View>


</TouchableOpacity>

{/* Action Grid  */}
<View className="flex-row gap-4"> 
  <TouchableOpacity
  onPress={() => router.push("/history")}
  className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100"
  activeOpacity={0.7}
  >
<View className="items-center">
  <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3">
<Ionicons name = "time-outline" size={24} color="#6B7280"/> 
  </View>
<Text className="text-gray-900 font-medium text-center">
  Workout{"\n"}History
</Text>
</View>
  </TouchableOpacity>
  <TouchableOpacity
  onPress={() => router.push("/exercises")}
  className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100"
    activeOpacity={0.7}
  >
<View className="items-center">
  <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3">
<Ionicons name = "barbell-outline" size={24} color="#6B7280"/> 
  </View>
<Text className="text-gray-900 font-medium text-center">
 Browse{"\n"}Exercises
</Text>
</View>
  </TouchableOpacity>

</View>

{/* Last workout Card */}
{lastWorkout && (
  <View className="px-6 mb-8">
    <Text className="text-lg font-semibold text-gray-900 mb-4">
  Last Workout
    </Text>
    <TouchableOpacity
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    onPress={() => {
      router.push({
        pathname: "/history/workout-record",
        params: { workoutId: lastWorkout._id },
      });
    }}
    activeOpacity={0.7}
    >
<View className="flex-row items-center justify-between mb-4">
  <View>
    <Text className="text-lg font-semibold text-gray-900">
    {formatDate(lastWorkout.date || "")}
    </Text>
    <View>
      <Ionicons name="time-outline" size={16} color="#6B7280"/>
      <Text className="text-gray-600 ml-2">
    {lastWorkout.duration
    ? formatDuration(lastWorkout.duration)
    : "Duration not recorded"
    }
      </Text>
    </View>
  </View>
<View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
  <Ionicons name="fitness-outline" size={24} color="#3B82F6"/>
</View>
</View>
    </TouchableOpacity>
  </View>
)}

{/* Empty State for No Workouts */}

{totalWorkouts === 0 && (
<View className="px-6 mb-8">
  <View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100">
<View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
<Ionicons name = "barbell-outline" size={32} color="#3B82F6"/>
</View>
<Text className="text-xl font-semibold text-gray-900 mb-2">
  Ready to Start your fitness journey
</Text>
<Text>
  Track your workouts and see your progress over time
</Text>
<TouchableOpacity
onPress={() => router.push("/workout")}
className="bg-blue-600 rounded-xl px-6 py-3"
activeOpacity={0.8}
>
<Text className="text-white font-semibold">
  Start your first workout
</Text>
</TouchableOpacity>
  </View>

</View>

)}

      </View>

      </ScrollView>
    </SafeAreaView>
  );
}




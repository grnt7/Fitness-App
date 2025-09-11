import { client } from "../../../../lib/sanity/client";
import { defineQuery } from "groq";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "@clerk/clerk-expo";
import { Workout } from "../../../../lib/sanity/types";
import { GetWorkoutsQueryResult } from "../../../../lib/sanity/types"
import { useLocalSearchParams, useRouter } from "expo-router";
import { formatDuration } from "lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";




export const getWorkoutsQuery = 
defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
  _id,
  date,
  durationSeconds,
  exercises[] {
    exercise-> {
      _id,
      name
    },
    sets[] {
      reps,
      weight,
      weightUnit,
      _type,
      _key
    },

  }
}`);
export default function HistoryPage() {
  const { user } = useUser();
  const [ workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [ loading, setLoading] = useState(true);
  const [ refreshing, setRefreshing] = useState(false)
  const { refresh } = useLocalSearchParams();
  const router = useRouter();




const fetchWorkouts = async () => {
  if (!user?.id) return;

  try {
    const results = await client.fetch(getWorkoutsQuery,{ userId: user.id });
   // console.log(user.id);
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

  // Define the onRefresh function that will be called by RefreshControl
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Handle refresh parameter from deleted workout
  useEffect(() => {
    if (refresh === "true") {
      fetchWorkouts();
      // Clear the refresh paarameter from the url
      router.replace("/(app)/(tabs)/history");
    }
  });

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
    day: "numeric",
  });
}

};
const formatWorkoutDuration = (seconds?: number) => {
  if(!seconds) return "Duration not recorded";
  return formatDuration(seconds);
}

const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
  return (
    workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0 );
    }, 0) || 0
  );
  
};

const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
return (
  workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) || []
);
} 


// if (loading) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content"/>
      {/* Header */}
      <View className="px-6 py-4 bh-white border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-900">
        Workout History
        </Text>
        <Text className="text-gray-600 mt-1">
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} completed
        </Text>
      </View>

    {/* Workouts list */}
    <ScrollView className="flex-1"
                contentContainerStyle={{ padding: 24}}
                refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
    >
      {workouts.length === 0 ? (
        <View className="bg-white rounded-2xlp-8 items-center">
          <Ionicons name= "barbell-outline" size={64} color="#9CA3AF"/>
          <Text className="text-xl font-semibold text-gray-900 mt-4">
          No workouts yet
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Your completed workouts will appear here
          </Text>
        </View>
      ) : (
        <View className="space-y-4 gap-4">
          {workouts.map((workout) => (
            <TouchableOpacity
            key={workout._id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            activeOpacity={0.7}
            onPress={()=> {
              router.push({
                pathname: "/history/workout-record",
                params: {
                  workoutId: workout._id,
                },
              });
            }}
            >
              {/* Workout Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {formatDate(workout.date || "")}

                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="time-outline" size={16} color="#6B7280"/>
                  <Text className="text-gray-600 ml-2">
                    {formatWorkoutDuration(workout.duration)}

                  </Text>
                </View>

              </View>
            <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
              <Ionicons
              name="fitness-outline"
              size={24}
              color="#3B82F6"
              />
            </View>
            </View>

            {/* Workout Stats */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                  <Text className="text-sm font-medium text-gray-700">
                    {workout.exercises?.length || 0} exercises

                  </Text>

                </View>
                <View className="bg-gray-100 rounded-lg px-3 py-2">
                <Text className="text-sm font-medium text-gray-700">
                  {getTotalSets(workout)} sets
                </Text>
                </View>

              </View>

            </View>
            {workout.exercises && workout.exercises.length > 0 && (
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
              Exercises:
                </Text>
                <View className="flex-row flex-wrap">
              {getExerciseNames(workout)
              .slice(0, 3)
              .map((name, index) => (
                <View
                key={index}
                className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-blue-700 text-sm font-medium">
                  {name}
                  </Text>
                </View>
              ))}
              {getExerciseNames(workout).length > 3 && (
                <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                  <Text className="text-gray-600 text-sm font-medium">
                +{getExerciseNames(workout).length -3} more
                  </Text>

                </View>
              )}
                </View>
              </View>
            )}
            <View>
              
            </View>
            </TouchableOpacity>
          ))}

        </View>
      )}

    </ScrollView>

    </SafeAreaView>
  );
};


// };




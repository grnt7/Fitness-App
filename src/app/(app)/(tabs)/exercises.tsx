import { View, Text, TouchableOpacity, TextInput, FlatList, RefreshControl,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useRouter } from 'expo-router';
import { client } from "@/lib/sanity/client";


import { defineQuery } from "groq";
import ExerciseCard from '@/app/components/ExerciseCard';
import { Exercise } from 'fitness-app/sanity.types';

// Define the query outside the component for proper type generation

export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
  ...
  }`);


const Exercises = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [ exercises, setExercises] = useState([]);
  const [ filteredExercises, setFilteredExercises] = useState([]);
  const router = useRouter();
  const [ refreshing, setRefreshing] = useState(false);

const fetchExercises = async () => {
  try {
    //fetch exercises from Sanity
    const exercises = await client.fetch(exercisesQuery);
    //exercises[0].

    setExercises(exercises);
    setFilteredExercises(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
};

useEffect(() => {
  fetchExercises();
}, []);


useEffect(() => {
const filtered = exercises.filter((exercise: Exercise) =>
exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
);
setFilteredExercises(filtered);
}, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  
  return (
    <SafeAreaView className="flex 1 bg-gray-50">
      {/* Header */}
      <View className=" px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
          </Text>
        
          <Text className="text-gray-600 mt-1">
            Discover and master new exercises
            </Text>
        
     
      
      {/* Search Bar */}
      <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl mt-4">
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          placeholder="Search Exercises..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 border border-gray-300 rounded-md p-2 text-gray-800"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
      </View>
      {/* Exercise List */}
     <Text>Exercises</Text>
        <FlatList
         data={filteredExercises}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding:24 }}
          renderItem={({ item }) => (
          <ExerciseCard 
          item={item}
        onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3B82F6"]} //Android
          tintColor="#3B82F" //iOS
          title="Pull to refresh exercises" //iOS
          titleColor="#6B7280"// iOS
        />
        }
        ListEmptyComponent={
          <View className="bg-white rounded 2xl p-8 items">
            <Ionicons name="fitness-outline" size={64} color="#9CA3AF"/>
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              {searchQuery
              ? "Try adjusting your search"
              : "Your exercises will appear here"
              }

            </Text>

          </View>
        }
     />
     </SafeAreaView>
     

     
  
  );
}

export default Exercises;
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Image, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { urlFor } from '@/lib/sanity/client';
import { Exercise } from 'fitness-app/sanity.types';
import { defineQuery } from 'groq';
import { client } from '@/lib/sanity/client';
import Markdown from 'react-native-markdown-display'
import AiGuidanceDisplay from '../components/AiGuidanceDisplay';


const singleExerciseQuery = defineQuery(
  `*[_type == "exercise" && _id == $id][0]`
 );

 const getDifficultyColor = (difficulty: string) => {
    // Process the string to a consistent format
    const normalizedDifficulty = difficulty.trim().toLowerCase();

    switch (normalizedDifficulty) {
        case 'beginner':
            return 'bg-green-500';
        case 'intermediate':
            return 'bg-yellow-500';
        case 'advanced':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

const getDifficultyText = (difficulty: string) => {
    // Process the string to a consistent format
    const normalizedDifficulty = difficulty.trim().toLowerCase();

    switch (normalizedDifficulty) {
        case 'beginner':
            return 'Beginner';
        case 'intermediate':
            return 'Intermediate';
        case 'advanced':
            return 'Advanced';
        default:
            return 'Unknown';
    }
};


export default function ExerciseDetail() {
   const router = useRouter();
   const [exercise, setExercise] = useState<Exercise>(null);
   const [loading, setLoading] = useState(true);
   
   const[aiGuidance, setAiGuidance] = useState<string>("");
   
   const [aiLoading, setAiLoading] = useState(false);
    
    const { id } = useLocalSearchParams<{// Replace with actual id retrieval logic

        id : string;
    }>();

   useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      try {
        const exerciseData = await client.fetch(singleExerciseQuery, { id });
        setExercise(exerciseData);
    
      } catch (error) {
        console.error("Error fetching exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
   }, [id]);


  
   const getAiGuidance = async () => {
  if (!exercise) return;
  setAiLoading(true);

  try {
    const response = await fetch('http://192.168.1.226:8081/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseName: exercise.name,
      }),
    });

    if (!response.ok) {
      // Check if the response is valid before parsing
      //const errorData = await response.json();
      //throw new Error(errorData.error || 'Failed to fetch AI guidance');
      throw new Error("Failed to fetch AI guidance");
    }

    const data = await response.json();
    setAiGuidance(data.message); // Correctly set state from the 'message' property
  } catch (error) {
    console.error("Error fetching AI guidance:", error);
    setAiGuidance("Sorry, AI guidance is currently unavailable. Please try again later.");
  } finally {
    setAiLoading(false);
  }
};
    
     if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-4 text-gray-600">Loading Exercise...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!exercise) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">  
              <Text className="text-gray-600">Exercise not found: {id}</Text>
              <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-500 rounded-lg"
              >
                <Text className="text-white font-semibold">Go Back</Text>
              </TouchableOpacity>
            </SafeAreaView>
        );
    }
     
     
      return (
  <SafeAreaView className="flex-1 bg-white">
    <StatusBar barStyle="light-content" backgroundColor="#000" />
    {/* Header with close button */}
    <View className="absolute top-12 left-0 right-0 z-10 px-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View className="h-80 bg-white relative">
        {exercise?.image ? (
          <Image
            source={{ uri: urlFor(exercise.image?.asset?._ref).url() }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
            <Ionicons name="fitness" size={80} color="white" />
          </View>
        )}
        {/* Gradient overlay */}
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </View>
      {/* Content */}
      <View className="px-6 py-6">
        {/* Title and Difficulty */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {exercise?.name}
            </Text>
            <View
              className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
                exercise?.difficulty
              )}`}
            >
              <Text className="text-sm font-semibold text-white">
                {getDifficultyText(exercise?.difficulty)}
              </Text>
            </View>
          </View>
        </View>
        {/* Description */}
        <View className="mb-6">
          <Text className="text-gray-600 mb-3leading-relaxed">
             
            {exercise?.description || 'No description available.'}
           
          </Text>
        </View>
        {/* Video Section */}
        <View>
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            Video Tutorial
          </Text>
          <TouchableOpacity
            className="bg-red-500 rounded-xl p-4 flex-row items-center"
            onPress={() => Linking.openURL(exercise.videoUrl)}
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
              <Ionicons name="play" size={24} color="#EF4444" />
            </View>
            <View>
              <Text className="text-white font-semibold text-lg">Watch Tutorial</Text>
              <Text className="text-red-100 text-sm">Learn proper form and technique</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Ai Guidance */}
        {(aiGuidance || aiLoading) && (
          <View className="mt-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="fitness" size={24} color="#3B82F6" />
              <Text className="text-xl font-semibold text-gray-800 ml-2">
                AI coach says...
              </Text>
            </View>
            
            {aiLoading ? (
              <View className="bg-gray-50 rounded-xl p-4 items-center">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="text-gray-600 mt-2">Getting personalized guidance...
                  
                </Text>
              </View>
            ) : (
              <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <Markdown
                  style={{
                    body: { paddingBottom: 20 },
                    heading2: {
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginTop: 12,
                      marginBottom: 6,
                    },
                    heading3: {
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#374151',
                      marginTop: 8,
                      marginBottom: 4,
                    },
                  }}>
                  {aiGuidance}
                </Markdown>
              </View>
            )}
          </View>
        )}
        {/* Action Buttons */}
        <View className="mt-8 gap-2">
          {/* Ai Coach Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${
              aiLoading
                ? 'bg-gray-400'
                : aiGuidance
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            onPress={getAiGuidance}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold text-lg ml-2">Loading...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                {aiGuidance ? 'Refresh Ai Guidance' : 'Get AI Guidance on Form and Technique'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-200 rounded-xl py-4 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 font-bold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
      );
    };
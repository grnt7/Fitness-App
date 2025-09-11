import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Markdown  from 'react-native-markdown-display';

interface Props {
  aiGuidance: string;
  aiLoading: boolean;
}

const AiGuidanceDisplay: React.FC<Props> = ({ aiGuidance, aiLoading }) => {
  if (aiLoading) {
    return (
      <View className="bg-gray-50 rounded-xl p-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text className="text-gray-600 mt-2">
          Getting Personalized guidance...
        </Text>
      </View>
    );
  }

  if (typeof aiGuidance === 'string' && aiGuidance.length > 0) {
    return (
      <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <Markdown>{aiGuidance}</Markdown>
      </View>
    );
  }

  return null;
};

export default AiGuidanceDisplay;
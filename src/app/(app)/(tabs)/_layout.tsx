import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'

import { useUser } from "@clerk/clerk-expo"

const Layout = () => {
    const { user } = useUser();
  return (
    <Tabs>
        <Tabs.Screen name="index" 
        options={{headerShown:false, 
        title:"Home",
        tabBarIcon: ( {color, size}) => (
            <AntDesign name="home" size={size} color={color} />
        ),
        }} />
        <Tabs.Screen name="exercises" 
        options={{headerShown:false,
        title:"Exercises",
        tabBarIcon: ( {color, size}) => (   
            <AntDesign name="book" size={size} color={color} />
        ),
    }}
/>
        <Tabs.Screen name="workout" 
        options={{headerShown:false,
        title:"Workout",
        tabBarIcon: ( {color, size}) => (   
            <AntDesign name="plus-circle" family="anticon" size={size} color={color}  />

        ),
    }}
/> 
  <Tabs.Screen name="active-workout" 
        options={{headerShown:false,
        title:"Active Workout",
        href: null,
       tabBarStyle: { display: 'none' },
       
        }}
        />
    <Tabs.Screen name="history" 
        options={{
            title:"History",
            tabBarIcon: ( {color, size}) => (   
                 <AntDesign name="clock-circle" family="anticon" size={size} color={color} />
            ),
            headerShown:false,    
            
            
        }}
            />



        <Tabs.Screen name="profile/index"
        
        options={{headerShown:false,    
        title:"Profile",
        tabBarIcon: ( {color, size}) => (   
            <Image
            source={{
                uri: user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl,
            }}
            className="rounded-full"
            style={{width: 28,height: 28, borderRadius: 100 }}
            />
           // <AntDesign name="user" size={size} color={color} />
        
    
        ),
    }}
    />
    </Tabs>
  )
}

export default Layout;
import { adminclient,  client } from "@/lib/sanity/client";

export interface WorkoutData {
    _type: string;
    userId: string;
    date: string;
    duration: number;
    exercises: {
        _type: string;
        _key: string;
    exercise: {
        _type: string;
        _ref: string;
    };
    sets: {
        _type: string;
        _key: string;
        reps: number;
        weight: number;
        weightUnit: "lbs" | "kg";
    }[];
    }[];
}

export async function POST(request: Request) {
    const { workoutData } : { workoutData: WorkoutData} = await request.json();

    try {
        // Save to Sanity using admin client
        const result = await adminclient.create(workoutData);
        return Response.json({ message: "Workout saved succesfully", result});
    } catch (error) {
        console.error("Error saving workout:", error);
        return Response.json({ error: "Failed to save workout"}, {status: 500})
    }
}
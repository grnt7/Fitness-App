import { adminclient } from "@/lib/sanity/client";

export async function POST(request: Request) {
    const { workoutId }: { workoutId: string } = await request.json();

    try {
        await adminclient.delete(workoutId as string);

        console.log("Workout deleted successfuly:", workoutId);
         return Response.json({
            success: true,
            message: "Workout deleted succesfuly",
         });
        } catch (error) {
            console.error("Error");
            return Response.json({ error: "Failed to save workout" }, {status: 500 });
        }
    }

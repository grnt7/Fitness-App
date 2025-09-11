import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2023-01-01' }) 

const workoutQuery = `*[_type == "workout"]`

client
  .fetch(workoutQuery)
  .then(documents =>
    documents.forEach(doc => {
      let patch = client.patch(doc._id)
      let needsPatch = false

      // Check and migrate 'duration' field
      if (doc.duration && !doc.durationSeconds) {
        patch = patch.set({ durationSeconds: doc.duration }).unset(['duration'])
        needsPatch = true
      }

      // Check and initialize 'sets' fields
      const newExercises = doc.exercises?.map(exercise => {
        if (!exercise.sets) {
          needsPatch = true
          return { ...exercise, sets: [] }
        }
        return exercise
      })

      if (newExercises) {
        patch = patch.set({ exercises: newExercises })
      }

      if (needsPatch) {
        patch.commit()
          .then(() => {
            console.log(`Document ${doc._id} successfully patched.`)
          })
          .catch(err => {
            console.error(`Error patching document ${doc._id}:`, err)
          })
      }
    })
  )
  .catch(err => {
    console.error("Failed to fetch documents:", err)
  })
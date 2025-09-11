export default {
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID (Clerk)',
      type: 'string',
      description: "The user's Clerk ID",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive().integer(),
    },
    {
  name: 'duration',
  title: 'Duration (DEPRECATED)',
  type: 'number',
  hidden: true,
  readOnly: true,
},
    {
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [
        {
          name: 'workoutExercise',
          type: 'object',
          fields: [
            {
             
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule: any) => Rule.required(),
            },
            {
    name: 'sets',
    title: 'Sets',
    type: 'array',
    of: [
        {
            // CORRECT: Add a name property to the object definition
            name: 'set', 
            type: 'object',
            fields: [
                    {
                      name: 'reps',
                      title: 'Reps',
                      type: 'number',
                      validation: (Rule: any) => Rule.required().min(1).integer(),
                    },
                    {
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      validation: (Rule: any) => Rule.min(0),
                    },
                    {
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'lbs', value: 'lbs'},
                          {title: 'kg', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                      validation: (Rule: any) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      unit: 'weightUnit',
                    },
                    prepare(selection: any) {
                      const {reps, weight, unit} = selection
                      const weightText = typeof weight === 'number' ? ` • ${weight}${unit ? ' ' + unit : ''}` : ''
                      return {
                        title: `${reps ? reps + ' reps' : 'Set'}`,
                        subtitle: `${weightText}`.trim(),
                      }
                    },
                  },
                },
              ],
              validation: (Rule: any) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
              firstReps: 'sets.0.reps',
              firstWeight: 'sets.0.weight',
              firstUnit: 'sets.0.weightUnit',
            },
            prepare(selection: any) {
              const {title, sets, firstReps, firstWeight, firstUnit} = selection
              const count = Array.isArray(sets) ? sets.length : 0
              const weightText = typeof firstWeight === 'number' ? ` • ${firstWeight}${firstUnit ? ' ' + firstUnit : ''}` : ''
              return {
                title: title || 'Exercise',
                subtitle: `${count} set${count === 1 ? '' : 's'}${firstReps ? ` • ${firstReps} reps` : ''}${weightText}`.trim(),
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      userId: 'userId',
      date: 'date',
      duration: 'durationSeconds',
      exercises: 'exercises',
    },
    prepare(selection: any) {
      const {userId, date, duration, exercises} = selection
      const count = Array.isArray(exercises) ? exercises.length : 0
      const mins = typeof duration === 'number' ? Math.floor(duration / 60) : 0
      const secs = typeof duration === 'number' ? duration % 60 : 0
      const time = `${mins}m ${secs}s`
      const dateText = date ? new Date(date).toLocaleString() : 'No date'
      return {
        title: `${userId || 'User'} • ${dateText}`,
        subtitle: `${count} exercise${count === 1 ? '' : 's'} • ${time}`,
      }
    },
  },
}



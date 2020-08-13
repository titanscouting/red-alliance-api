module.exports = (app: any) => {
  app.get('/api/fetchPitConfig', async (req: any, res:any) => {
    const response = [
      {
        Pit: [
          {
            name: 'Updated on Match',
            key: 'match-updated',
            widget: 'stepper',
          },
          {
            name: 'Can do low balls?',
            key: 'low-balls',
            widget: 'segment',
            options: ['Don\'t Know', 'Yes', 'No'],
          },
          {
            name: 'Can do high balls?',
            key: 'high-balls',
            widget: 'segment',
            options: ['Don\'t Know', 'Yes', 'No'],
          },
          {
            name: 'Has wheel mechanism?',
            key: 'wheel-mechanism',
            widget: 'segment',
            options: ['Don\'t Know', 'Yes', 'No'],
          },
          {
            name: 'Demonstrated wheel success?',
            key: 'wheel-success',
            widget: 'segment',
            options: ['Don\'t Know', 'Yes', 'No'],
          },
          {
            name: 'Strategic focus',
            key: 'strategic-focus',
            widget: 'segment',
            options: ['idk', 'Offense', 'Defense', 'Hybrid'],
          },
          {
            name: 'Climb mechanism',
            key: 'climb-mechanism',
            widget: 'segment',
            options: ['Don\'t Know', 'x0', 'x1', 'x2', 'x3'],

          },
          {
            name: 'Climb requirements (space? time?)',
            key: 'climb-requirements',
            widget: 'text-area',
          },
          {
            name: 'Attitude toward Titan Robotics',
            key: 'attitude',
            widget: 'segment',
            options: ['Don\'t Know', 'Negative', 'Neutral', 'Positive', 'Love'],

          },
          {
            name: 'Other notes',
            key: 'defense-notes',
            widget: 'text-area',
          },
        ],
      },
    ];
    res.json(response);
  });
};

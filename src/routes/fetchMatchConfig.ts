module.exports = (app) => {
  app.get('/api/fetchMatchConfig', async (req: any, res:any) => {
    const response = [
      {
        Auto: [
          {
            name: 'Passed Auto Line?',
            key: 'pass-line',
            widget: 'segment',
            options: ['Don\'t Know', 'No', 'Yes'],
          },
          {
            name: 'Initial Balls Stored',
            key: 'balls-started',
            widget: 'stepper',
          },
          {
            name: 'Extra Balls Collected',
            key: 'balls-collected',
            widget: 'stepper',
          },
          {
            name: 'Balls Scored Upper',
            key: 'balls-upper-auto',
            widget: 'stepper',
          },
          {
            name: 'Balls Scored Lower',
            key: 'balls-lower-auto',
            widget: 'stepper',
          },
        ],
      },
      {
        Teleop: [
          {
            name: 'Spun Wheel?',
            key: 'spun-wheel',
            widget: 'segment',
            options: ['Don\'t know', 'No', 'Position', 'Color'],
          },
          {
            name: 'Balls Scored Upper',
            key: 'balls-upper-teleop',
            widget: 'stepper',
          },
          {
            name: 'Balls Scored Lower',
            key: 'balls-lower-teleop',
            widget: 'stepper',
          },
          {
            name: 'Did they shoot from a vulnerable location??',
            key: 'shooting-vulnerable',
            widget: 'segment',
            options: ['Don\'t know', 'No', 'Yes'],
          },
          {
            name: 'Where could they shoot from?',
            key: 'shooting-notes',
            widget: 'text-area',
          },
          {
            name: 'Did they climb?',
            key: 'climb',
            widget: 'segment',
            options: ['Don\'t know', 'No Attempt', 'Failed', 'Yes'],
          },
          {
            name: 'Did they play defense?',
            key: 'defense',
            widget: 'segment',
            options: ['Don\'t know', 'No', 'Yes'],
          },
          {
            name: 'What teams did this one play defense on?',
            key: 'defense-notes',
            widget: 'text-area',
          },
        ],
      },
      {
        Notes: [
          {
            name: 'Overall Competency',
            key: 'competency',
            widget: 'segment',
            options: ['Don\'t know', 'Awful', 'Meh', 'Good', 'Best'],
          },
          {
            name: 'Speed',
            key: 'speed',
            widget: 'segment',
            options: ['Don\'t know', 'Slow', 'Med.', 'Fast', 'Ludicrous'],
          },
          {
            name: 'Strategic Focus',
            key: 'strategic-focus',
            widget: 'segment',
            options: ['Don\'t know', 'Offense', 'Defense', 'Hybrid'],
          },
          {
            name: 'How could we use this robot in a strategy?',
            key: 'strategy-notes',
            widget: 'text-area',
          },
        ],
      },
    ];
    res.json(response);
  });
};

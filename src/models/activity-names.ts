type ActivityName = {
  value: number;
  text: string;
};

export const activityNames: ActivityName[] = [
  { value: 0, text: 'activity_names.0' },
  { value: 1, text: 'activity_names.1' },
  { value: 2, text: 'activity_names.2' },
  { value: 3, text: 'activity_names.3' },
  { value: 4, text: 'activity_names.4' },
  { value: 5, text: 'activity_names.5' },
  { value: 6, text: 'activity_names.6' },
  { value: 7, text: 'activity_names.7' },
  { value: 8, text: 'activity_names.8' },
  { value: 9, text: 'activity_names.9' },
  { value: 10, text: 'activity_names.10' },
  { value: 11, text: 'activity_names.11' },
  { value: 12, text: 'activity_names.12' },
  { value: 13, text: 'activity_names.13' },
  { value: 14, text: 'activity_names.14' },
  { value: 15, text: 'activity_names.15' },
  { value: 16, text: 'activity_names.16' },
  { value: 17, text: 'activity_names.17' },
  { value: 18, text: 'activity_names.18' },
  { value: 19, text: 'activity_names.19' },
  { value: 20, text: 'activity_names.20' },
  { value: 21, text: 'activity_names.21' },
  { value: 22, text: 'activity_names.22' },
  { value: 23, text: 'activity_names.23' },
  { value: 24, text: 'activity_names.24' },
  { value: 25, text: 'activity_names.25' },
  { value: 26, text: 'activity_names.26' },
  { value: 27, text: 'activity_names.27' },
  { value: 28, text: 'activity_names.28' },
  { value: 29, text: 'activity_names.29' },
  { value: 30, text: 'activity_names.30' },
  { value: 31, text: 'activity_names.31' },
  { value: 32, text: 'activity_names.32' },
  { value: 33, text: 'activity_names.33' },
  { value: 34, text: 'activity_names.34' },
  { value: 35, text: 'activity_names.35' },
];

export const getSelectedActivityName = (
  value?: number | null,
): ActivityName | undefined => {
  if (!value) {
    return undefined;
  }

  return activityNames.find<ActivityName>(
    (activityName): activityName is ActivityName => activityName.value === value
  );
};

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

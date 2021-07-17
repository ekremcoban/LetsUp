type ActivityName = {
  value: number;
  text: string;
  branch: string;
};

export const activityNames: ActivityName[] = [
  { value: 0, text: 'activity_names.0', branch: 'jogging' },
  { value: 1, text: 'activity_names.1', branch: 'jogging' },
  { value: 2, text: 'activity_names.2', branch: 'jogging' },
  { value: 3, text: 'activity_names.3', branch: 'jogging' },
  { value: 4, text: 'activity_names.4', branch: 'jogging' },
  { value: 5, text: 'activity_names.5', branch: 'jogging' },
  { value: 6, text: 'activity_names.6', branch: 'basketball' },
  { value: 7, text: 'activity_names.7', branch: 'basketball' },
  { value: 8, text: 'activity_names.8', branch: 'basketball' },
  { value: 9, text: 'activity_names.9', branch: 'basketball' },
  { value: 10, text: 'activity_names.10', branch: 'basketball' },
  { value: 11, text: 'activity_names.11', branch: 'basketball' },
  { value: 12, text: 'activity_names.12', branch: 'bicycle' },
  { value: 13, text: 'activity_names.13', branch: 'bicycle' },
  { value: 14, text: 'activity_names.14', branch: 'bicycle' },
  { value: 15, text: 'activity_names.15', branch: 'bicycle' },
  { value: 16, text: 'activity_names.16', branch: 'bicycle' },
  { value: 17, text: 'activity_names.17', branch: 'bicycle' },
  { value: 18, text: 'activity_names.18', branch: 'hiking' },
  { value: 19, text: 'activity_names.19', branch: 'hiking' },
  { value: 20, text: 'activity_names.20', branch: 'hiking' },
  { value: 21, text: 'activity_names.21', branch: 'hiking' },
  { value: 22, text: 'activity_names.22', branch: 'hiking' },
  { value: 23, text: 'activity_names.23', branch: 'hiking' },
  { value: 24, text: 'activity_names.24', branch: 'tennis' },
  { value: 25, text: 'activity_names.25', branch: 'tennis' },
  { value: 26, text: 'activity_names.26', branch: 'tennis' },
  { value: 27, text: 'activity_names.27', branch: 'tennis' },
  { value: 28, text: 'activity_names.28', branch: 'tennis' },
  { value: 29, text: 'activity_names.29', branch: 'tennis' },
  { value: 30, text: 'activity_names.30', branch: 'bowling' },
  { value: 31, text: 'activity_names.31', branch: 'bowling' },
  { value: 32, text: 'activity_names.32', branch: 'bowling' },
  { value: 33, text: 'activity_names.33', branch: 'bowling' },
  { value: 34, text: 'activity_names.34', branch: 'bowling' },
  { value: 35, text: 'activity_names.35', branch: 'bowling' },
  { value: 36, text: 'activity_names.36', branch: 'frisbee' },
  { value: 37, text: 'activity_names.37', branch: 'frisbee' },
  { value: 38, text: 'activity_names.38', branch: 'frisbee' },
  { value: 39, text: 'activity_names.39', branch: 'frisbee' },
  { value: 40, text: 'activity_names.40', branch: 'frisbee' },
  { value: 41, text: 'activity_names.41', branch: 'frisbee' }
];

export const getSelectedActivityName = (
  value?: number | null,
  branchName: string | undefined,
): ActivityName | undefined => {
  if (!value) {
    return undefined;
  }

  return activityNames.find<ActivityName>(
    (activityName): activityName is ActivityName => activityName.value === value && activityName.branch === branchName
  );
};

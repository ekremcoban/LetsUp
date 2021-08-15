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
  { value: 24, text: 'activity_names.24', branch: 'table_tennis' },
  { value: 25, text: 'activity_names.25', branch: 'table_tennis' },
  { value: 26, text: 'activity_names.26', branch: 'table_tennis' },
  { value: 27, text: 'activity_names.27', branch: 'table_tennis' },
  { value: 28, text: 'activity_names.28', branch: 'table_tennis' },
  { value: 29, text: 'activity_names.29', branch: 'table_tennis' },
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
  { value: 41, text: 'activity_names.41', branch: 'frisbee' },
  { value: 42, text: 'activity_names.42', branch: 'volleyball' },
  { value: 43, text: 'activity_names.43', branch: 'volleyball' },
  { value: 44, text: 'activity_names.44', branch: 'volleyball' },
  { value: 45, text: 'activity_names.45', branch: 'volleyball' },
  { value: 46, text: 'activity_names.46', branch: 'volleyball' },
  { value: 47, text: 'activity_names.47', branch: 'volleyball' },
  { value: 48, text: 'activity_names.48', branch: 'feedback' },
  { value: 49, text: 'activity_names.49', branch: 'feedback' },
  { value: 50, text: 'activity_names.50', branch: 'feedback' },
  { value: 51, text: 'activity_names.51', branch: 'feedback' }
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

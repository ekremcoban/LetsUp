export interface IActivityType {
  id: number;
  image: string;
  textKey: string;
}

export const activityTypes: IActivityType[] = [
  { id: 0, image: 'badminton', textKey: 'activity_types.badminton'},
  { id: 1, image: 'basketball', textKey: 'activity_types.basketball' },
  { id: 2, image: 'bicycle', textKey: 'activity_types.bicycle' },
  { id: 3, image: 'bowling', textKey: 'activity_types.bowling'},
  { id: 4, image: 'frisbee', textKey: 'activity_types.frisbee'},
  { id: 5, image: 'hiking', textKey: 'activity_types.hiking' },
  { id: 6, image: 'running', textKey: 'activity_types.running'},
  { id: 7, image: 'roller_skate', textKey: 'activity_types.roller_skate'},
  { id: 8, image: 'skateboard', textKey: 'activity_types.skateboard'},
  { id: 9, image: 'table_tennis', textKey: 'activity_types.table_tennis'},
  { id: 10, image: 'tennis', textKey: 'activity_types.tennis'},
  { id: 11, image: 'volleyball', textKey: 'activity_types.volleyball'},
  { id: 12, image: 'yoga', textKey: 'activity_types.yoga'},
];

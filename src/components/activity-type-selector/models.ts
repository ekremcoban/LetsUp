export interface IActivityType {
  id: number;
  image: string;
  textKey: string;
}

export const activityTypes: IActivityType[] = [
  { id: 0, image: 'basketball', textKey: 'activity_types.basketball' },
  { id: 1, image: 'bicycle', textKey: 'activity_types.bicycle' },
  { id: 2, image: 'bowling', textKey: 'activity_types.bowling'},
  { id: 3, image: 'frisbee', textKey: 'activity_types.frisbee'},
  { id: 4, image: 'hiking', textKey: 'activity_types.hiking' },
  { id: 5, image: 'jogging', textKey: 'activity_types.jogging'},
  { id: 6, image: 'tennis', textKey: 'activity_types.table_tennis'},
];

export interface IActivityType {
  id: number;
  image: string;
  textKey: string;
}

export const activityTypes: IActivityType[] = [
  { id: 0, image: 'jogging', textKey: 'activity_types.jogging' },
  { id: 1, image: 'basketball', textKey: 'activity_types.basketball' },
  { id: 2, image: 'bicycle', textKey: 'activity_types.bicycle' },
  { id: 3, image: 'hiking', textKey: 'activity_types.hiking' },
  { id: 4, image: 'tableTennis', textKey: 'activity_types.table_tennis' },
  { id: 5, image: 'bicycle', textKey: 'activity_types.bowling' },
  { id: 6, image: 'hiking', textKey: 'activity_types.frisbee' },
];

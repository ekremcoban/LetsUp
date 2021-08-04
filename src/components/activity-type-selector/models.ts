export interface IActivityType {
  id: number;
  image: string;
  textKey: string;
  warning: boolean;
}

export const activityTypes: IActivityType[] = [
  { id: 0, image: 'jogging', textKey: 'activity_types.jogging', branch: 'Jogging' },
  { id: 1, image: 'basketball', textKey: 'activity_types.basketball', branch: 'Basketball' },
  { id: 2, image: 'bicycle', textKey: 'activity_types.bicycle' , branch: 'Bicycle'},
  { id: 3, image: 'hiking', textKey: 'activity_types.hiking' , branch: 'Hiking'},
  { id: 4, image: 'tennis', textKey: 'activity_types.table_tennis' , branch: 'Tennis'},
  { id: 5, image: 'bowling', textKey: 'activity_types.bowling' , branch: 'Bowling'},
  { id: 6, image: 'frisbee', textKey: 'activity_types.frisbee' , branch: 'Frisbee'},
];

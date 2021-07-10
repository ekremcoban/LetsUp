type Gender = {
  value: number;
  text: string;
};
export const genders: Gender[] = [
  {
    value: 0,
    text: 'lists.genders.select',
  },
  {
    value: 1,
    text: 'lists.genders.female',
  },
  {
    value: 2,
    text: 'lists.genders.male',
  },
];

export const getSelectedGender = (
  value?: number | null
): Gender | undefined => {
  if (!value) {
    return undefined;
  }

  return genders.find<Gender>(
    (gender): gender is Gender => gender.value === value
  );
};

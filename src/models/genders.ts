type Gender = {
  value: string;
  text: string;
};
export const genders: Gender[] = [
  {
    value: 'F',
    text: 'lists.genders.female',
  },
  {
    value: 'M',
    text: 'lists.genders.male',
  },
];

export const getSelectedGender = (
  value?: string | null
): Gender | undefined => {
  if (!value) {
    return undefined;
  }

  return genders.find<Gender>(
    (gender): gender is Gender => gender.value === value
  );
};

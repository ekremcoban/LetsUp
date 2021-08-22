export const selectImg = (value: string) => {
  switch (value) {
    case 'basketball':
      return require(`../../assets/img/basketball.png`);
    case 'bicycle':
      return require(`../../assets/img/bicycle.png`);
    case 'hiking':
      return require(`../../assets/img/hiking.png`);
    case 'frisbee':
      return require(`../../assets/img/frisbee.png`);
    case 'jogging':
      return require(`../../assets/img/jogging.png`);
    case 'bowling':
      return require(`../../assets/img/bowling.png`);
    case 'table_tennis':
      return require(`../../assets/img/table_tennis.png`);
    case 'tennis':
      return require(`../../assets/img/tennis.png`);
    case 'volleyball':
      return require(`../../assets/img/volleyball.png`);
    case 'badminton':
      return require(`../../assets/img/badminton.png`);
    case 'meditation':
      return require(`../../assets/img/meditation.png`);
    case 'roller_skate':
      return require(`../../assets/img/roller_skate.png`);
    case 'skateboard':
      return require(`../../assets/img/skateboard.png`);
    default:
      return require(`../../assets/img/join.png`);
  }
};

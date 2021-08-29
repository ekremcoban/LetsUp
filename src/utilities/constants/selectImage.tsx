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
    case 'running':
      return require(`../../assets/img/running.png`);
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
    case 'yoga':
      return require(`../../assets/img/yoga.png`);
    case 'roller_skate':
      return require(`../../assets/img/roller_skate.png`);
    case 'skateboard':
      return require(`../../assets/img/skateboard.png`);
    default:
      return require(`../../assets/img/join.png`);
  }
};

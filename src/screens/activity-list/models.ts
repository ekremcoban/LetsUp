export interface IActivity {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
}

export const activities: IActivity[] = [
  {
    id: '1',
    image: 'kosu.png',
    title: 'Koşu',
    location: 'Üsküdar Sahil Yürüyüş Parkuru Başlangıç',
    date: '21 January 2021',
    time: '15:00',
  },
  {
    id: '2',
    image: 'dag.png',
    title: 'Trekking',
    location: 'Üsküdar Sahil Yürüyüş Parkuru',
    date: '21 February 2021',
    time: '15:00',
  },
  {
    id: '3',
    image: 'bisiklet.png',
    title: 'Bisiklet',
    location: 'Kadıköy, İstanbul',
    date: '21 April 2021',
    time: '15:00',
  },
  {
    id: '4',
    image: 'pinpon.png',
    title: 'Masa tenisi',
    location: 'Kadıköy, İstanbul',
    date: '21 November 2021',
    time: '15:00',
  },
  {
    id: '5',
    image: 'run.png',
    title: 'Koşu',
    location: 'Kadıköy, İstanbul',
    date: '21 December 2021',
    time: '15:00',
  },
  {
    id: '6',
    image: 'basketbol.png',
    title: 'Basketbol',
    location: 'Kadıköy, İstanbul',
    date: '21 August 2021',
    time: '15:00',
  },
  {
    id: '7',
    image: 'kosu.png',
    title: 'Koşu',
    location: 'Kadıköy, İstanbul',
    date: '21 June 2021',
    time: '15:00',
  },
  {
    id: '8',
    image: 'dag.png',
    title: 'Trekking',
    location: 'Kadıköy, İstanbul',
    date: '21 July 2021',
    time: '15:00',
  },
];

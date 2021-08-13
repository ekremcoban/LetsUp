import translate from 'translate-google-api';

export const convertLowerString = (phrase: string) => {
  var maxLength = 100;

  var returnString = phrase.toLowerCase();
  //Convert Characters
  returnString = returnString.replace(/ö/g, 'o');
  returnString = returnString.replace(/ç/g, 'c');
  returnString = returnString.replace(/ş/g, 's');
  returnString = returnString.replace(/ı/g, 'i');
  returnString = returnString.replace(/ğ/g, 'g');
  returnString = returnString.replace(/ü/g, 'u');

  // if there are other invalid chars, convert them into blank spaces
  returnString = returnString.replace(/[^a-z0-9\s-]/g, '');
  // convert multiple spaces and hyphens into one space
  returnString = returnString.replace(/[\s-]+/g, ' ');
  // trims current string
  returnString = returnString.replace(/^\s+|\s+$/g, '');
  // cuts string (if too long)
  if (returnString.length > maxLength)
    returnString = returnString.substring(0, maxLength);
  // add hyphens
  // returnString = returnString.replace(/\s/g, '-');

  return returnString;
};

// Google dan lokasyon arama isleminde ulke, il, ilce bilgisini bulur.
export const filteredLocation = async (place: Object) => {
  // TEST ICIN
  let result = null;
  let countryCode = null;
  let country = null;
  let city = null;
  let district = null;
  let indexAddress = place.addressComponents.length - 1;
  let findCOuntry = false;

  while (0 <= indexAddress && !findCOuntry) {
    if (place.addressComponents[indexAddress].types[0] === 'country') {
      findCOuntry = true;
      countryCode = place.addressComponents[indexAddress].shortName;
    }
    indexAddress--;
  }

  indexAddress = place.addressComponents.length;

  switch (countryCode) {
    case 'TR':
      for (let i = 0; i < indexAddress; i++) {
        if (place.addressComponents[i].types[0] === 'country') {
          const result = await translate(
            [place.addressComponents[i].name, 'Türkiye'],
            {
              q: 'tr',
              target: 'en',
            }
          );
          country = result[0];
        } else if (
          place.addressComponents[i].types[0] === 'administrative_area_level_1'
        ) {
          const result = await translate(
            [`Şehir ${place.addressComponents[i].name}`, 'Türkiye'],
            {
              q: 'tr',
              target: 'en',
            }
          );

          city = result[0].replace('City', '').trim();
        } else if (
          place.addressComponents[i].types[0] === 'administrative_area_level_2'
        ) {
          district = place.addressComponents[i].name;
        }
      }
      break;
    default:
      break;
  }

  console.log('countryCode', countryCode);
  console.log('country', country);
  console.log('city', city);
  console.log('district', district);

  result = {
    countryCode: countryCode,
    country: country,
    city: city,
    district: district,
  };

  return result;
};

// GPS lokasyon alirken
export const filteredGeoCoder = async (place: Object) => {
  let result = null;
  let country: any = null;
  let countryCode = null;
  let city: any = null;
  let district: any = null;

  let indexAddress = place.results.length - 1;
  let findCOuntry = false;

  // Ulkeye gore filtrelemek icin once ulke bulunur
  while (0 <= indexAddress && !findCOuntry) {
    if (place.results[indexAddress].types[0] === 'country') {
      findCOuntry = true;
      countryCode = place.results[indexAddress].address_components[0].short_name;
    }
    indexAddress--;
  }

  indexAddress = place.results.length - 1;

  switch (countryCode) {
    case 'TR':
      for (let i = 0; i < place.results[indexAddress].address_components.length; i++) {
        if (place.results[indexAddress].address_components[i].types[0] === 'country') {
          const result = await translate(
            [place.results[indexAddress].address_components[i].long_name, 'Türkiye'],
            {
              q: 'tr',
              target: 'en',
            }
          );
          country = result[0];

        } else if (place.results[indexAddress].address_components[i].types[0] === 'administrative_area_level_1') {
          const result = await translate(
            [`Şehir ${place.results[indexAddress].address_components[i].long_name}`, 'Türkiye'],
            {
              q: 'tr',
              target: 'en',
            }
          );

          city = result[0].replace('City', '').trim();

        } else if (
          place.results[indexAddress].address_components[i].types[0] === 'administrative_area_level_2'
        ) {
          district = place.results[indexAddress].address_components[i].long_name;

        }
      }
      break;

    default:
      break;
  }

  console.log('country', country);
  console.log('city', city);
  console.log('district', district);
  // const city = 'Ekrem'; //basic[basic.length - 2].long_name;
  // const latitude = info.coords.latitude;
  // const longitude = info.coords.longitude;
  result = {
    countryCode: countryCode,
    country: country,
    city: city,
    district: district
  }

  return result;
};

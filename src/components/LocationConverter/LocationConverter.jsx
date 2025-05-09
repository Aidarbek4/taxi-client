import React, { useEffect } from 'react';

const LocationConverter = ({ start, end, onConvert }) => {
  useEffect(() => {
    const convertLocations = async () => {
      if (!start || !end) return;

      try {
        // конвертация коорд начальной точки
        const startResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?` + 
          `format=json&lat=${start.lat}&lon=${start.lng}&accept-language=ru&limit=1`
        );
        const startData = await startResponse.json();

        // конвертация коорд конечной точки
        const endResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?` + 
          `format=json&lat=${end.lat}&lon=${end.lng}&accept-language=ru&limit=1`
        );
        const endData = await endResponse.json();

        // извлечение адреса
        const extractAddress = (data) => {
          const addr = data.address;
          let result = '';

          // получение название улицы и номер дома
          if (addr.road) {
            result = addr.road;
            if (addr.house_number) {
              result += `, ${addr.house_number}`;
            }
          }
          // если нет улицы, испол. район или микрорайон
          else if (addr.suburb) {
            result = addr.suburb;
          }
          // если нет района, испол. название населенного пункта
          else if (addr.city || addr.town || addr.village) {
            result = addr.city || addr.town || addr.village;
          }
          // в крайнем случае берем первую часть полного адреса
          else {
            result = data.display_name.split(',')[0];
          }

          return result;
        };

        const startAddress = extractAddress(startData);
        const endAddress = extractAddress(endData);

        console.log('Converted addresses:', { start: startAddress, end: endAddress });

        onConvert({
          start: startAddress,
          end: endAddress,
          coordinates: {
            start: { lat: start.lat, lng: start.lng },
            end: { lat: end.lat, lng: end.lng }
          }
        });
      } catch (error) {
        console.error('Error converting coordinates:', error);
        onConvert({
          start: `Координаты: ${start.lat.toFixed(6)}, ${start.lng.toFixed(6)}`,
          end: `Координаты: ${end.lat.toFixed(6)}, ${end.lng.toFixed(6)}`,
          coordinates: {
            start: { lat: start.lat, lng: start.lng },
            end: { lat: end.lat, lng: end.lng }
          }
        });
      }
    };

    convertLocations();
  }, [start, end, onConvert]);

  return null;
};

export default LocationConverter;
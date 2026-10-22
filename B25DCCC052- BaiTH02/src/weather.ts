import type { City } from './cities';

export interface Weather {
  current: { temp: number; humidity: number; wind: number; code: number; time: string };
  daily: { date: string; code: number; max: number; min: number }[];
}

export type Unit = 'C' | 'F';
export type Sky = 'idle' | 'clear' | 'cloudy' | 'rain' | 'storm';

export async function fetchWeather(city: City, signal: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(city.lat),
    longitude: String(city.lon),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Ho_Chi_Minh',
    forecast_days: '7',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!res.ok) throw new Error(`Máy chủ Open-Meteo trả về lỗi ${res.status}.`);
  const j = await res.json();
  const d = j.daily;
  return {
    current: {
      temp: j.current.temperature_2m,
      humidity: j.current.relative_humidity_2m,
      wind: j.current.wind_speed_10m,
      code: j.current.weather_code,
      time: j.current.time,
    },
    daily: (d.time as string[]).map((date, i) => ({
      date,
      code: d.weather_code[i],
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
    })),
  };
}

export function toUnit(celsius: number, unit: Unit): number {
  return Math.round(unit === 'C' ? celsius : (celsius * 9) / 5 + 32);
}

export function describe(code: number): { icon: string; text: string } {
  if (code === 0) return { icon: '☀️', text: 'Trời quang' };
  if (code === 1) return { icon: '🌤️', text: 'Ít mây' };
  if (code === 2) return { icon: '⛅', text: 'Có mây' };
  if (code === 3) return { icon: '☁️', text: 'Nhiều mây' };
  if (code === 45 || code === 48) return { icon: '🌫️', text: 'Sương mù' };
  if (code >= 51 && code <= 57) return { icon: '🌦️', text: 'Mưa phùn' };
  if (code >= 61 && code <= 65) return { icon: '🌧️', text: 'Mưa' };
  if (code === 66 || code === 67) return { icon: '🌧️', text: 'Mưa lạnh' };
  if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Tuyết' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', text: 'Mưa rào' };
  if (code === 85 || code === 86) return { icon: '❄️', text: 'Mưa tuyết' };
  if (code === 95) return { icon: '⛈️', text: 'Dông' };
  if (code === 96 || code === 99) return { icon: '⛈️', text: 'Dông kèm mưa đá' };
  return { icon: '🌡️', text: 'Không rõ' };
}
export function skyOf(code: number | undefined): Sky {
  if (code === undefined) return 'idle';
  if (code <= 1) return 'clear';
  if (code >= 95) return 'storm';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  return 'cloudy';
}

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

export function formatDay(iso: string): { thu: string; ngay: string } {
  const [y, m, d] = iso.split('-').map(Number);
  return { thu: THU[new Date(y, m - 1, d).getDay()], ngay: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}` };
}

export function formatTime(iso: string): string {
  const [date, time] = iso.split('T');
  const [y, m, d] = date.split('-');
  return `${time}, ${d}/${m}/${y}`;
}

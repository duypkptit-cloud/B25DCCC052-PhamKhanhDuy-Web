import { useEffect, useMemo, useState } from 'react';
import { CITIES, boDau, type City } from './cities';
import { describe, fetchWeather, formatDay, formatTime, skyOf, toUnit, type Unit, type Weather } from './weather';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Weather };

const FAV_KEY = 'baith02-favorites';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [selected, setSelected] = useState<City | null>(null);
  const [state, setState] = useState<State>({ status: 'idle' });
  const [unit, setUnit] = useState<Unit>('C');
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetchWeather(selected, controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return; // đã chuyển sang thành phố khác
        const message = err instanceof TypeError ? 'Không kết nối được tới máy chủ. Hãy kiểm tra mạng rồi thử lại.' : (err as Error).message;
        setState({ status: 'error', message });
      });
    return () => controller.abort();
  }, [selected, retry]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
    }
  }, [favorites]);

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const visible = useMemo(() => {
    const q = boDau(query.trim());
    return CITIES.filter((c) => boDau(c.name).includes(q)).sort(
      (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))
    );
  }, [query, favorites]);

  const sky = skyOf(state.status === 'ready' ? state.data.current.code : undefined);

  return (
    <div className="app" data-sky={sky}>
      <header className="top">
        <h1>Thời tiết Việt Nam</h1>
        <div className="unit" role="group" aria-label="Đơn vị nhiệt độ">
          {(['C', 'F'] as Unit[]).map((u) => (
            <button key={u} className={unit === u ? 'on' : ''} aria-pressed={unit === u} onClick={() => setUnit(u)}>
              °{u}
            </button>
          ))}
        </div>
      </header>

      <main className="layout">
        <section className="panel cities" aria-label="Danh sách thành phố">
          <input
            type="search"
            placeholder="Tìm thành phố, ví dụ: da lat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Tìm thành phố"
          />
          <ul>
            {visible.map((c) => {
              const fav = favorites.includes(c.id);
              const active = selected?.id === c.id;
              return (
                <li key={c.id} className={active ? 'active' : ''}>
                  <button className="pick" aria-current={active} onClick={() => setSelected(c)}>
                    {c.name}
                  </button>
                  <button
                    className={`star ${fav ? 'on' : ''}`}
                    aria-pressed={fav}
                    aria-label={fav ? `Bỏ ${c.name} khỏi yêu thích` : `Thêm ${c.name} vào yêu thích`}
                    onClick={() => toggleFavorite(c.id)}
                  >
                    {fav ? '★' : '☆'}
                  </button>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && <p className="note">Không có thành phố phù hợp.</p>}
        </section>

        <section className="detail" aria-live="polite">
          {state.status === 'idle' && (
            <div className="panel message">
              <h2>Chưa chọn thành phố</h2>
              <p>Chọn một thành phố trong danh sách để xem thời tiết hiện tại và dự báo 7 ngày.</p>
            </div>
          )}

          {state.status === 'loading' && (
            <div className="panel message">
              <span className="spinner" aria-hidden="true" />
              <h2>Đang tải thời tiết {selected?.name}…</h2>
            </div>
          )}

          {state.status === 'error' && (
            <div className="panel message error">
              <h2>Không tải được thời tiết {selected?.name}</h2>
              <p>{state.message}</p>
              <button className="retry" onClick={() => setRetry((n) => n + 1)}>
                Thử lại
              </button>
            </div>
          )}

          {state.status === 'ready' && selected && <Weather city={selected} data={state.data} unit={unit} />}
        </section>
      </main>

      <footer>Dữ liệu từ Open-Meteo</footer>
    </div>
  );
}

function Weather({ city, data, unit }: { city: City; data: Weather; unit: Unit }) {
  const { current, daily } = data;
  const info = describe(current.code);
  return (
    <>
      <div className="panel now">
        <h2>{city.name}</h2>
        <div className="now-main">
          <span className="icon" role="img" aria-label={info.text}>
            {info.icon}
          </span>
          <span className="temp">
            {toUnit(current.temp, unit)}°{unit}
          </span>
        </div>
        <p className="desc">{info.text}</p>
        <dl className="facts">
          <div>
            <dt>Độ ẩm</dt>
            <dd>{current.humidity}%</dd>
          </div>
          <div>
            <dt>Tốc độ gió</dt>
            <dd>{current.wind} km/h</dd>
          </div>
          <div>
            <dt>Cập nhật lúc</dt>
            <dd>{formatTime(current.time)}</dd>
          </div>
        </dl>
      </div>

      <div className="panel forecast">
        <h3>Dự báo 7 ngày</h3>
        <ul>
          {daily.map((d) => {
            const day = formatDay(d.date);
            const w = describe(d.code);
            return (
              <li key={d.date}>
                <span className="day">
                  <strong>{day.thu}</strong> <span>{day.ngay}</span>
                </span>
                <span className="icon" role="img" aria-label={w.text} title={w.text}>
                  {w.icon}
                </span>
                <span className="range">
                  <b>{toUnit(d.max, unit)}°</b> / {toUnit(d.min, unit)}°
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

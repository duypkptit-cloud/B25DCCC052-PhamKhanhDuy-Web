import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const API = 'https://jsonplaceholder.typicode.com';

interface Post {
  id: number;
  title: string;
  body: string;
  isLocal?: boolean;
}

function getLocalPosts(): Post[] {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(API + '/posts')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch(() => setError('Không tải được dữ liệu, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const all = [...getLocalPosts(), ...posts];
  const list = all.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  const totalPage = Math.ceil(list.length / 10) || 1;
  const shown = list.slice((page - 1) * 10, page * 10);

  return (
    <div>
      <h1>Bài viết</h1>
      <input
        placeholder="Tìm theo tiêu đề..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {loading && <p>Đang tải...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && list.length === 0 && <p>Không có bài viết nào.</p>}

      <div className="post-list">
        {shown.map((p) => (
          <div className="post" key={p.id}>
            <h3><Link to={'/posts/' + p.id}>{p.title}</Link></h3>
            {p.isLocal && <small className="badge">Bài của bạn</small>}
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="pager">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Trang trước</button>
        <span>Trang {page} / {totalPage}</span>
        <button disabled={page === totalPage} onClick={() => setPage(page + 1)}>Trang sau</button>
      </div>
    </div>
  );
}

export function PostDetail({ user }: { user: string | null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const localPost = getLocalPosts().find((p) => String(p.id) === id);

  useEffect(() => {
    if (localPost) return;
    Promise.all([
      fetch(`${API}/posts/${id}`).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch(`${API}/posts/${id}/comments`).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    ])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
      })
      .catch(() => setError('Không tải được bài viết, vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleDelete() {
    if (window.confirm('Bạn có chắc muốn xoá bài viết này?')) {
      const rest = getLocalPosts().filter((p) => String(p.id) !== id);
      localStorage.setItem('posts', JSON.stringify(rest));
      navigate('/');
    }
  }

  // bài tự viết thì không cần gọi API
  if (localPost) {
    return (
      <div>
        <Link to="/">← Quay lại</Link>
        <h1>{localPost.title}</h1>
        <small className="badge">Bài của bạn</small>
        <p className="body-text">{localPost.body}</p>
        {user && <button className="danger" onClick={handleDelete}>Xoá bài viết</button>}
      </div>
    );
  }

  return (
    <div>
      <Link to="/">← Quay lại</Link>
      {loading && <p>Đang tải...</p>}
      {error && <p className="error">{error}</p>}
      {post && (
        <>
          <h1>{post.title}</h1>
          <p className="body-text">{post.body}</p>
          <h3>Bình luận ({comments.length})</h3>
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <b>{c.name}</b> <small>{c.email}</small>
              <p>{c.body}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      onLogin(username);
      navigate('/');
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu.');
    }
  }

  return (
    <div>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <label>Tên đăng nhập</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export function WritePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError('Tiêu đề phải có ít nhất 5 ký tự.');
      return;
    }
    if (body.trim().length < 20) {
      setError('Nội dung phải có ít nhất 20 ký tự.');
      return;
    }
    const newPost = { id: Date.now(), title: title.trim(), body: body.trim(), isLocal: true };
    localStorage.setItem('posts', JSON.stringify([newPost, ...getLocalPosts()]));
    navigate('/');
  }

  return (
    <div>
      <h1>Viết bài mới</h1>
      <form onSubmit={handleSubmit}>
        <label>Tiêu đề</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Nội dung</label>
        <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng bài</button>
      </form>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="container">
      <h1>404</h1>
      <p>Không tìm thấy trang bạn cần.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/books/search')
            .then((res) => {
                if (!res.ok) throw new Error('検索に失敗しました');
                return res.json();
            })
            .then((data) => {
                setBooks(data.books || []);
                setQuery(data.query || '');
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <h1>📚 「{query}」に関する本</h1>
            {loading && <p>読み込み中...</p>}
            {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
            {!loading && !error && books.length === 0 && <p>該当する本が見つかりませんでした。</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {books.map((book) => (
                    <li key={book.id} style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 24 }}>
                        {book.thumbnail && (
                            <img src={book.thumbnail} alt={book.title} style={{ width: 80, objectFit: 'contain', flexShrink: 0 }} />
                        )}
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>
                                {book.infoLink ? (
                                    <a href={book.infoLink} target="_blank" rel="noreferrer">{book.title}</a>
                                ) : (
                                    book.title
                                )}
                            </h2>
                            {book.authors && book.authors.length > 0 && (
                                <p style={{ margin: '0 0 4px', color: '#555' }}>著者: {book.authors.join(', ')}</p>
                            )}
                            {book.description && (
                                <p style={{ margin: 0, fontSize: 14, color: '#333' }}>
                                    {book.description.length > 200 ? book.description.slice(0, 200) + '…' : book.description}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));

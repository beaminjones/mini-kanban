import { useState } from 'react'
import { api } from '../api'

export default function BoardList({ boards, onSelect, onRefresh, error }) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    try {
      await api.boards.create(name.trim())
      setName('')
      onRefresh()
    } catch (e) {
      alert(e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={styles.container} className="board-list-container">
      <h1 style={styles.title} className="board-list-title">Mini-Kanban</h1>
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleCreate} style={styles.form} className="board-list-form">
        <input
          type="text"
          placeholder="Nome do quadro"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          disabled={creating}
        />
        <button type="submit" style={styles.btn} className="btn-primary" disabled={creating}>
          {creating ? 'Criando...' : 'Novo quadro'}
        </button>
      </form>

      <div style={styles.list}>
        {boards.length === 0 ? (
          <p style={styles.empty}>Nenhum quadro. Crie um acima.</p>
        ) : (
          boards.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              style={styles.boardItem}
              className="board-item"
            >
              {b.name}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 520,
    margin: '0 auto',
    padding: 48,
  },
  title: {
    marginBottom: 32,
    fontSize: 32,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #f1f5f9, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  error: {
    padding: 14,
    background: 'rgba(248, 113, 113, 0.15)',
    borderRadius: 10,
    marginBottom: 20,
    color: '#f87171',
    fontSize: 14,
    border: '1px solid rgba(248, 113, 113, 0.3)',
  },
  form: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#f1f5f9',
    fontSize: 15,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btn: {
    padding: '14px 24px',
    borderRadius: 10,
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
    transition: 'all 0.2s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  boardItem: {
    padding: 18,
    borderRadius: 12,
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#f1f5f9',
    fontSize: 16,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: 32,
    fontSize: 15,
  },
}

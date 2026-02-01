import { useState } from 'react'

export default function Card({ card, onDelete, onUpdate, onStartEdit, onCancelEdit, isEditing, isDragging }) {
  const [showMenu, setShowMenu] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Excluir este cartão?')) {
      onDelete?.(card.id)
    }
    setShowMenu(false)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    setTitle(card.title)
    setDescription(card.description || '')
    onStartEdit?.()
    setShowMenu(false)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    const t = title.trim()
    if (t) {
      onUpdate?.(card.id, { title: t, description: description.trim() || null })
      onCancelEdit?.()
    }
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    setTitle(card.title)
    setDescription(card.description || '')
    onCancelEdit?.()
  }

  if (isEditing) {
    return (
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          style={styles.editInput}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          style={styles.editTextarea}
          rows={2}
        />
        <div style={styles.editActions}>
          <button onClick={handleSave} style={styles.saveBtn}>Salvar</button>
          <button onClick={handleCancel} style={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.card,
        opacity: isDragging ? 0.8 : 1,
        cursor: onDelete ? 'grab' : 'default',
      }}
      className="card-item"
    >
      <div style={styles.header}>
        <span style={styles.title}>{card.title}</span>
        {(onDelete || onUpdate) && (
          <div style={styles.menuWrap}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              style={styles.menuBtn}
            >
              ⋮
            </button>
            {showMenu && (
              <div style={styles.menu}>
                {onUpdate && (
                  <button onClick={handleEdit} style={styles.menuItemEdit}>
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button onClick={handleDelete} style={styles.menuItem}>
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {card.description && (
        <p style={styles.description}>{card.description}</p>
      )}
    </div>
  )
}

const styles = {
  card: {
    padding: 14,
    background: '#0f172a',
    borderRadius: 12,
    border: '1px solid #334155',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    flex: 1,
    color: '#f1f5f9',
  },
  description: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 1.5,
  },
  menuWrap: {
    position: 'relative',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '2px 6px',
    fontSize: 18,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: 6,
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'left',
    borderRadius: 6,
  },
  menuItemEdit: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    color: '#f1f5f9',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'left',
    borderRadius: 6,
  },
  editInput: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 8,
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 14,
  },
  editTextarea: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 8,
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 13,
    resize: 'vertical',
  },
  editActions: {
    display: 'flex',
    gap: 10,
  },
  saveBtn: {
    padding: '10px 16px',
    background: '#6366f1',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  cancelBtn: {
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 14,
  },
}

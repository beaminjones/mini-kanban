import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { api } from '../api'
import KanbanColumn from './KanbanColumn'
import Card from './Card'

export default function KanbanBoard({ board, onBack, onRefresh, error }) {
  const [columns, setColumns] = useState(board?.columns || [])
  const [activeCard, setActiveCard] = useState(null)
  const [moveColumnId, setMoveColumnId] = useState(null)

  useEffect(() => {
    setColumns(board?.columns || [])
  }, [board])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const handleDragStart = (e) => {
    const { active } = e
    const card = findCard(active.id)
    setActiveCard(card)
  }

  const handleDragEnd = async (e) => {
    const { active, over } = e
    setActiveCard(null)
    setMoveColumnId(null)

    if (!over) return
    const card = findCard(active.id)
    if (!card) return

    const overId = String(over.id)
    if (overId.startsWith('column-')) {
      const colId = overId.replace('column-', '')
      if (colId !== card.column_id) {
        await moveCard(card.id, colId)
      }
    }
  }

  const handleDragOver = (e) => {
    const { over } = e
    if (!over) {
      setMoveColumnId(null)
      return
    }
    const overId = String(over.id)
    if (overId.startsWith('column-')) {
      setMoveColumnId(overId.replace('column-', ''))
    } else {
      setMoveColumnId(null)
    }
  }

  const findCard = (id) => {
    for (const col of columns) {
      const card = col.cards?.find((c) => c.id === id)
      if (card) return card
    }
    return null
  }

  const moveCard = async (cardId, newColumnId) => {
    try {
      await api.cards.move(cardId, newColumnId)
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleAddCard = async (columnId, title, description) => {
    try {
      await api.cards.create(columnId, { title, description })
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await api.cards.delete(cardId)
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleUpdateCard = async (cardId, { title, description }) => {
    try {
      await api.cards.update(cardId, { title, description })
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleAddColumn = async (name) => {
    try {
      await api.columns.create(board.id, name)
      onRefresh()
    } catch (e) {
      alert(e.message)
    }
  }

  if (!board) return null

  return (
    <div style={styles.wrapper} className="kanban-wrapper">
      <header style={styles.header} className="kanban-header">
        <button onClick={onBack} style={styles.backBtn} className="back-btn">
          ← Voltar
        </button>
        <h1 style={styles.title} className="kanban-title">{board.name}</h1>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div style={styles.columns} className="kanban-columns">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
              isDropTarget={moveColumnId === col.id}
            />
          ))}
          <AddColumnForm onSubmit={handleAddColumn} />
        </div>

        <DragOverlay>
          {activeCard ? (
            <div style={styles.dragCard}>
              <Card card={activeCard} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function AddColumnForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
      setName('')
      setOpen(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={styles.addColumnBtn}
        className="add-btn add-column-btn"
      >
        + Nova coluna
      </button>
    )
  }

  return (
    <div style={styles.column} className="kanban-column">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          placeholder="Nome da coluna"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => !name.trim() && setOpen(false)}
          style={styles.columnInput}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={styles.smallBtn}>
            Adicionar
          </button>
          <button
            type="button"
            onClick={() => { setName(''); setOpen(false); }}
            style={styles.smallBtnSecondary}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '20px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    padding: '10px 18px',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#f1f5f9',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s',
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: '#f1f5f9',
  },
  error: {
    padding: 14,
    background: 'rgba(248, 113, 113, 0.15)',
    borderRadius: 10,
    marginBottom: 20,
    color: '#f87171',
    border: '1px solid rgba(248, 113, 113, 0.3)',
  },
  columns: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingBottom: 16,
  },
  column: {
    minWidth: 280,
    padding: 18,
    background: '#1e293b',
    borderRadius: 14,
    border: '1px solid #334155',
  },
  columnInput: {
    width: '100%',
    padding: '12px 16px',
    marginBottom: 10,
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 15,
  },
  addColumnBtn: {
    minWidth: 220,
    padding: 18,
    background: 'transparent',
    border: '2px dashed #334155',
    borderRadius: 14,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 15,
    transition: 'all 0.2s',
  },
  smallBtn: {
    padding: '10px 18px',
    background: '#6366f1',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  smallBtnSecondary: {
    padding: '10px 18px',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 14,
  },
  dragCard: {
    opacity: 0.95,
    transform: 'rotate(2deg)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
}

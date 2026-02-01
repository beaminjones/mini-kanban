import { useDroppable, useDraggable } from '@dnd-kit/core'
import { useState } from 'react'
import Card from './Card'

export default function KanbanColumn({ column, onAddCard, onDeleteCard, onUpdateCard, isDropTarget }) {
  const [showForm, setShowForm] = useState(false)
  const [editingCardId, setEditingCardId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddCard(column.id, title.trim(), description.trim() || null)
      setTitle('')
      setDescription('')
      setShowForm(false)
    }
  }

  const highlight = isOver || isDropTarget

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.column,
        borderColor: highlight ? '#6366f1' : '#334155',
      }}
      className="kanban-column"
    >
      <h3 style={styles.columnTitle}>{column.name}</h3>

      <div style={styles.cards}>
        {(column.cards || []).map((card) => (
          editingCardId === card.id ? (
            <Card
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onUpdate={(id, data) => {
                onUpdateCard(id, data)
                setEditingCardId(null)
              }}
              onCancelEdit={() => setEditingCardId(null)}
              isEditing
            />
          ) : (
            <DraggableCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
              onStartEdit={() => setEditingCardId(card.id)}
            />
          )
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            autoFocus
            type="text"
            placeholder="Título do cartão"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows={2}
          />
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitBtn}>
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle(''); setDescription(''); }}
              style={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={styles.addBtn}
          className="add-btn"
        >
          + Adicionar cartão
        </button>
      )}
    </div>
  )
}

function DraggableCard({ card, onDelete, onUpdate, onStartEdit }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card card={card} onDelete={onDelete} onUpdate={onUpdate} onStartEdit={onStartEdit} />
    </div>
  )
}

const styles = {
  column: {
    minWidth: 280,
    maxWidth: 280,
    padding: 18,
    background: '#1e293b',
    borderRadius: 14,
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 4,
    color: '#f1f5f9',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    minHeight: 40,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 14,
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 14,
    resize: 'vertical',
  },
  formActions: {
    display: 'flex',
    gap: 10,
  },
  submitBtn: {
    padding: '10px 18px',
    background: '#6366f1',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  cancelBtn: {
    padding: '10px 18px',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: 10,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 14,
  },
  addBtn: {
    padding: '12px',
    background: 'transparent',
    border: '1px dashed #334155',
    borderRadius: 10,
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'center',
    transition: 'all 0.2s',
  },
}

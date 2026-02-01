import { useState, useEffect } from 'react'
import { api } from './api'
import BoardList from './components/BoardList'
import KanbanBoard from './components/KanbanBoard'

export default function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [boardDetail, setBoardDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBoards = async () => {
    try {
      const data = await api.boards.list()
      setBoards(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const selectBoard = async (board) => {
    setSelectedBoard(board)
    setError(null)
    try {
      const data = await api.boards.get(board.id)
      setBoardDetail(data)
    } catch (e) {
      setError(e.message)
    }
  }

  const refreshBoard = async () => {
    if (selectedBoard) {
      try {
        const data = await api.boards.get(selectedBoard.id)
        setBoardDetail(data)
        setError(null)
      } catch (e) {
        setError(e.message)
      }
    }
  }

  useEffect(() => {
    loadBoards()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 16 }}>
        Carregando...
      </div>
    )
  }

  if (!selectedBoard) {
    return (
      <BoardList
        boards={boards}
        onSelect={selectBoard}
        onRefresh={loadBoards}
        error={error}
      />
    )
  }

  return (
    <KanbanBoard
      board={boardDetail}
      onBack={() => {
        setSelectedBoard(null)
        setBoardDetail(null)
      }}
      onRefresh={refreshBoard}
      error={error}
    />
  )
}

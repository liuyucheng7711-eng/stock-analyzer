import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Checkbox, Space, Tag, Empty, Modal, Row, Col, Select, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ClearOutlined, CheckCircleOutlined, DeleteOutlined as TrashIcon } from '@ant-design/icons';
import '../styles/TodoList.css';

const PRIORITY_LEVELS = [
  { label: 'Low', value: 'low', color: '#52c41a' },
  { label: 'Medium', value: 'medium', color: '#faad14' },
  { label: 'High', value: 'high', color: '#ff4d4f' },
];

const CATEGORIES = [
  { label: 'Work', value: 'work', color: '#1890ff' },
  { label: 'Personal', value: 'personal', color: '#722ed1' },
  { label: 'Shopping', value: 'shopping', color: '#eb2f96' },
  { label: 'Health', value: 'health', color: '#13c2c2' },
  { label: 'Other', value: 'other', color: '#faad14' },
];

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [searchText, setSearchText] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        priority: selectedPriority,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };
      setTodos([newTodo, ...todos]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    Modal.confirm({
      title: 'Delete Todo',
      content: 'Are you sure you want to delete this todo?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setTodos(todos.filter(todo => todo.id !== id));
      },
    });
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.text);
  };

  const saveEdit = (id) => {
    if (editingValue.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editingValue } : todo
      ));
      setEditingId(null);
      setEditingValue('');
    }
  };

  const clearCompleted = () => {
    Modal.confirm({
      title: 'Clear Completed',
      content: 'Are you sure you want to delete all completed todos?',
      okText: 'Clear',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setTodos(todos.filter(todo => !todo.completed));
      },
    });
  };

  const getPriorityColor = (priority) => {
    return PRIORITY_LEVELS.find(p => p.value === priority)?.color || '#faad14';
  };

  const getCategoryColor = (category) => {
    return CATEGORIES.find(c => c.value === category)?.color || '#faad14';
  };

  const getCategoryLabel = (category) => {
    return CATEGORIES.find(c => c.value === category)?.label || category;
  };

  // Filter todos
  let filteredTodos = todos;

  if (filterStatus === 'completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  } else if (filterStatus === 'pending') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (filterPriority !== 'all') {
    filteredTodos = filteredTodos.filter(todo => todo.priority === filterPriority);
  }

  if (filterCategory !== 'all') {
    filteredTodos = filteredTodos.filter(todo => todo.category === filterCategory);
  }

  if (searchText) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Calculate stats
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h1>📝 Todo List</h1>
        <p>Manage your tasks efficiently with local storage persistence</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card high-priority">
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-label">High Priority</div>
          </Card>
        </Col>
      </Row>

      {/* Add Todo Section */}
      <Card className="add-todo-card">
        <div className="add-todo-section">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={10}>
              <Input
                placeholder="Enter a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={addTodo}
                size="large"
                maxLength={100}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={selectedPriority}
                onChange={setSelectedPriority}
                options={PRIORITY_LEVELS.map(p => ({
                  label: p.label,
                  value: p.value,
                }))}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={CATEGORIES.map(c => ({
                  label: c.label,
                  value: c.value,
                }))}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} md={2}>
              <Button
                type="primary"
                size="large"
                onClick={addTodo}
                icon={<PlusOutlined />}
                block
                style={{ height: '40px' }}
              >
                Add
              </Button>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Search and Filter Section */}
      <Card className="filter-card">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'All Tasks', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
              ]}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              value={filterPriority}
              onChange={setFilterPriority}
              options={[
                { label: 'All Priorities', value: 'all' },
                ...PRIORITY_LEVELS.map(p => ({ label: p.label, value: p.value })),
              ]}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { label: 'All Categories', value: 'all' },
                ...CATEGORIES.map(c => ({ label: c.label, value: c.value })),
              ]}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Todo List */}
      <Card className="todo-list-card">
        {filteredTodos.length === 0 ? (
          <Empty
            description={todos.length === 0 ? "No tasks yet. Create one!" : "No tasks match your filters"}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <List
            dataSource={filteredTodos}
            renderItem={(todo) => (
              <List.Item
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  {editingId === todo.id ? (
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onPressEnter={() => saveEdit(todo.id)}
                      onBlur={() => saveEdit(todo.id)}
                      autoFocus
                      style={{ marginLeft: '12px', maxWidth: '400px' }}
                    />
                  ) : (
                    <span
                      className="todo-text"
                      onClick={() => toggleTodo(todo.id)}
                      style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : '#333',
                        marginLeft: '12px',
                        flex: 1,
                        cursor: 'pointer',
                      }}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                <Space>
                  <Tag color={getPriorityColor(todo.priority)}>
                    {PRIORITY_LEVELS.find(p => p.value === todo.priority)?.label}
                  </Tag>
                  <Tag color={getCategoryColor(todo.category)}>
                    {getCategoryLabel(todo.category)}
                  </Tag>
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() => startEdit(todo)}
                      style={{ cursor: 'pointer', color: '#1890ff' }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteOutlined
                      onClick={() => deleteTodo(todo.id)}
                      style={{ cursor: 'pointer', color: '#ff4d4f' }}
                    />
                  </Tooltip>
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Action Buttons */}
      {todos.length > 0 && (
        <Row gutter={[12, 12]} className="action-buttons">
          <Col xs={24} sm={12}>
            <Button
              danger
              size="large"
              onClick={clearCompleted}
              icon={<ClearOutlined />}
              block
              disabled={stats.completed === 0}
            >
              Clear Completed ({stats.completed})
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button
              size="large"
              onClick={() => {
                localStorage.removeItem('todos');
                setTodos([]);
              }}
              icon={<TrashIcon />}
              block
            >
              Delete All Tasks
            </Button>
          </Col>
        </Row>
      )}

      {/* Info Section */}
      <Card className="info-card">
        <h3>💡 Features:</h3>
        <ul>
          <li>✅ Create, edit, and delete tasks</li>
          <li>✅ Assign priority levels (Low, Medium, High)</li>
          <li>✅ Categorize tasks (Work, Personal, Shopping, etc.)</li>
          <li>✅ Filter by status, priority, and category</li>
          <li>✅ Search tasks by name</li>
          <li>✅ Mark tasks as completed</li>
          <li>✅ All data saved to browser local storage</li>
          <li>✅ Real-time statistics dashboard</li>
          <li>✅ Fully responsive design</li>
        </ul>
      </Card>
    </div>
  );
}

export default TodoList;
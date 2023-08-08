import './App.scss';

import notes from './data/notes.json'
import SearchInput from './components/input/search-input';
import Popup from './components/popup';
import React from 'react';
import Select from 'react-select';
import Note from './components/note';
import Undo from './components/undo';

import useDarkScheme from './hooks/useDarkScheme.jsx';

import crossIcon from './img/icons/cross.svg'
import Empty from './components/empty';


const options = [
  { value: 'all', label: 'All' },
  { value: 'complete', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
];

function App() {
  const { darkScheme, changeScheme } = useDarkScheme();

  const [selectedOption, setSelectedOption] = React.useState(options[0]);
  const [textTodo, setTextTodo] = React.useState('');
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [activeUndo, setActiveUndo] = React.useState(false);
  const [timer, setTimer] = React.useState(5);

  const [filteredNotes, setFilteredNotes] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState(true);

  const [noteEditing, setNoteEditing] = React.useState();

  
  const [todos, setTodos] = React.useState(() => {
    const storedNotes = localStorage.getItem('notesArr');
    const initialNotes = storedNotes ? JSON.parse(storedNotes) : [...notes];
    return initialNotes;
  });  
  const [archivedTodos, setArchivedTodos] = React.useState([]);

  const [searching, setSearching] = React.useState('');

  const inputRef = React.useRef();
  const timerRef = React.useRef();

  React.useEffect(() => {
    let savedNotes = localStorage.getItem('notesArr');
    if (savedNotes) {
      setTodos(JSON.parse(localStorage.getItem('notesArr')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updNotes = () => {
    localStorage.setItem('notesArr', JSON.stringify(todos));
  }

  React.useEffect(() => {
    localStorage.setItem('notesArr', JSON.stringify(todos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);  
  React.useEffect(() =>{ 
    if (todos.length === 0 || renderedNotes.length === 0) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
    updNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, filteredNotes])

  const openPopup = () => {
    setPopupOpen(!popupOpen);
    inputRef.current.focus();
  }

  const cancelForm = (e) => {
    setPopupOpen(!popupOpen);
    e.preventDefault()
  }
  const closePopup = (e) => {
    if (e.target.id === 'popup-card') {
      setPopupOpen(!popupOpen);
    }
  }
  const clickToEsc = () => {
    setPopupOpen(!popupOpen);
  }

  const listenInput = (e) => {
    setTextTodo(e.target.value)
  }
  const publicNote = (e) => {
    if (textTodo !== '') {
      setTodos([{text: textTodo, checked: 'incomplete'}, ...todos]);
      setTextTodo('');
      inputRef.current.value = '';
      setSelectedOption(options[0])
    }

    setPopupOpen(!popupOpen);
    e.preventDefault()
  }
  
  const startTimer = () => {
    setTimer(timer => 5);
    timerRef.current = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000)
  }

  React.useEffect(() => {
    if (timer <= 0) {
      handleUndo();
      clearInterval(timerRef.current)
      setTimeout(() => {
        setTimer(timer => 5);
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer])

  const clickToRm = (i) => {
    let newNotes;
    newNotes = [...todos];
    setArchivedTodos([...todos]);
    newNotes.splice(i, 1);
    setTodos(newNotes);
    setNoteEditing('');

    if (activeUndo === true) {
      setTimer(timer => 5);
      handleUndo();
      clearInterval(timerRef.current)
      setTimeout(() => {
        setTimer(timer => 5);
        handleUndo();
        startTimer(timer);
      }, 300)
    } else {
      handleUndo();
      startTimer(timer);
    }
  }
  const handleUndo = () => {
    setActiveUndo(activeUndo => !activeUndo);
  }

  const clickToUndo = () => {
    handleUndo();
    clearInterval(timerRef.current)
    setTodos(archivedTodos);
  }

  const clickToEdit = (i, text) => {
    todos[i].text = text;
    updNotes();
  }

  const refreshFiltering = () => {
    setFilteredNotes(
      todos.filter(obj => {
        if (selectedOption.value === 'all') {
          return true;
        } else if (obj.checked === selectedOption.value) {
          return true;
        }
        return false
      }).filter(obj => {
        if (obj.text.toLowerCase().includes(searching.toLowerCase())) {
          return true;
        }
        return false;
      })
    )
  }

  const clickToCheck = (i) => {
    if (filteredNotes[i].checked === 'complete') {
      filteredNotes[i].checked = 'incomplete'
    } else {
      filteredNotes[i].checked = 'complete';
    }
    updNotes();
  }

  React.useEffect(() => {
    refreshFiltering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, selectedOption, searching])

  const renderedNotes = filteredNotes.map((obj, i) => 
    <Note 
      key={`${obj.text}${i}`}
      value={obj.text} 
      status={obj.checked}
      index={i} 
      check={clickToCheck}
      rmNote={clickToRm} 
      edit={clickToEdit} 
      noteEd={noteEditing}
      setNoteEd={setNoteEditing}
      list={todos}
      category={selectedOption}
      emptyCheck={setIsEmpty}
      refresh={refreshFiltering}
    />
  )

  return (
    <div className={`wrapper ${darkScheme ? 'dark' : ''}`}>
      <header className="header">
        <div className="header__container">
          <h1 className="header__title">TODO LIST</h1>
          <div className='header__nav-panel'>
            <SearchInput searchText={setSearching} text={searching} />

            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              value={selectedOption}
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <button className='change-scheme-btn' onClick={() => changeScheme()}>
              {darkScheme && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1576 1.15764C12.1576 0.518299 11.6394 0 11 0C10.3606 0 9.84235 0.518299 9.84235 1.15764V1.73887C9.84235 2.37822 10.3606 2.89651 11 2.89651C11.6394 2.89651 12.1576 2.37822 12.1576 1.73887V1.15764ZM18.7782 4.85893C19.2302 4.40683 19.2302 3.67386 18.7782 3.22177C18.3261 2.76969 17.5931 2.76969 17.141 3.22177L16.73 3.63282C16.2779 4.08492 16.2779 4.81789 16.73 5.26998C17.182 5.72206 17.915 5.72206 18.3671 5.26998L18.7782 4.85893ZM4.85889 3.22184C4.40681 2.76976 3.67383 2.76976 3.22175 3.22184C2.76967 3.67393 2.76967 4.4069 3.22175 4.859L3.63273 5.26998C4.08483 5.72206 4.8178 5.72206 5.26989 5.26998C5.72197 4.81789 5.72197 4.08492 5.26989 3.63282L4.85889 3.22184ZM1.15764 9.84235C0.518299 9.84235 0 10.3606 0 11C0 11.6394 0.518299 12.1576 1.15764 12.1576H1.73884C2.37819 12.1576 2.89648 11.6394 2.89648 11C2.89648 10.3606 2.37819 9.84235 1.73884 9.84235H1.15764ZM20.2611 9.84235C19.6217 9.84235 19.1035 10.3606 19.1035 11C19.1035 11.6394 19.6217 12.1576 20.2611 12.1576H20.8424C21.4817 12.1576 22 11.6394 22 11C22 10.3606 21.4817 9.84235 20.8424 9.84235H20.2611ZM5.26989 18.3672C5.72197 17.9151 5.72197 17.1821 5.26989 16.7301C4.8178 16.2779 4.08483 16.2779 3.63273 16.7301L3.22177 17.141C2.76968 17.5931 2.76968 18.3261 3.22176 18.7782C3.67385 19.2302 4.40682 19.2302 4.85892 18.7782L5.26989 18.3672ZM18.3671 16.7301C17.915 16.2779 17.182 16.2779 16.73 16.7301C16.2779 17.1821 16.2779 17.9151 16.73 18.3672L17.1409 18.7782C17.5931 19.2303 18.326 19.2303 18.7782 18.7782C19.2302 18.3261 19.2302 17.5932 18.7782 17.141L18.3671 16.7301ZM12.1576 20.2611C12.1576 19.6217 11.6394 19.1035 11 19.1035C10.3606 19.1035 9.84235 19.6217 9.84235 20.2611V20.8424C9.84235 21.4817 10.3606 22 11 22C11.6394 22 12.1576 21.4817 12.1576 20.8424V20.2611ZM6.36943 11C6.36943 8.4426 8.4426 6.36943 11 6.36943C13.5573 6.36943 15.6305 8.4426 15.6305 11C15.6305 13.5573 13.5573 15.6305 11 15.6305C8.4426 15.6305 6.36943 13.5573 6.36943 11ZM11 4.05415C7.1639 4.05415 4.05415 7.1639 4.05415 11C4.05415 14.8361 7.1639 17.9458 11 17.9458C14.8361 17.9458 17.9458 14.8361 17.9458 11C17.9458 7.1639 14.8361 4.05415 11 4.05415Z" fill="#F7F7F7"/>
                </svg>
              )}
              {!darkScheme && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1249 0.548798C11.3387 0.917354 11.321 1.3762 11.0791 1.72705C10.3455 2.79152 9.91599 4.08062 9.91599 5.47334C9.91599 9.12428 12.8757 12.084 16.5266 12.084C17.9194 12.084 19.2085 11.6545 20.2729 10.9208C20.6238 10.6791 21.0826 10.6613 21.4512 10.8751C21.8197 11.089 22.0319 11.4962 21.9961 11.9208C21.5191 17.567 16.7867 22 11.0178 22C4.93282 22 0 17.0672 0 10.9822C0 5.21328 4.43301 0.480873 10.0792 0.00392422C10.5038 -0.0319387 10.911 0.180242 11.1249 0.548798ZM8.17985 2.63461C4.70452 3.81573 2.20355 7.10732 2.20355 10.9822C2.20355 15.8502 6.14981 19.7964 11.0178 19.7964C14.8927 19.7964 18.1843 17.2955 19.3654 13.8202C18.4741 14.1232 17.5191 14.2875 16.5266 14.2875C11.6587 14.2875 7.71244 10.3413 7.71244 5.47334C7.71244 4.48086 7.87682 3.52582 8.17985 2.63461Z" fill="#F7F7F7"/>
                </svg>
              )}
            </button>

            <button className="add-note-btn" onClick={() => openPopup()}>
                <span>New note</span>
                <img src={crossIcon} alt="" />
            </button>
          </div>
        </div>
      </header>
      <main className="main">
        <section className="main__list list">
          <div className="list__container">
            <div className="list__container-small">
              {renderedNotes}

              {isEmpty && <Empty scheme={darkScheme} />}

              <Undo show={activeUndo} tRef={timerRef} timer={timer} undo={clickToUndo} />
            </div>
          </div>
        </section>

        <Popup marker={popupOpen} cancelClick={cancelForm} closePopup={closePopup} esc={clickToEsc} listenInput={listenInput} publicNote={publicNote} uRef={inputRef} />

      </main>
    </div>
  );
}

export default App;

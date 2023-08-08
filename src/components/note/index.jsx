import React from 'react';
import './note.scss';

function Note(props) {
  const [checkedNote, setCheckedNote] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(props.value);
  const [currentText, setCurrentText] = React.useState(props.value);

  const editRef = React.useRef();
  const textRef = React.useRef();

  React.useEffect(() => {
    if (isEditing) {
      editRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  React.useEffect(() => {
    if (props.status === 'complete')  {
      setCheckedNote(!checkedNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheck = () => {
    setCheckedNote(!checkedNote);
    props.check(props.index);
    window.setTimeout(() => {
      props.refresh();
    }, 1000)
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editText !== '') {
        setCurrentText(editText);
        props.edit(props.index, editText);
      }
    }
    setIsEditing(!isEditing);
    props.setNoteEd('');
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  const rmEditing = () => {
    setIsEditing(!isEditing);
    setEditText(currentText);
    props.setNoteEd('');
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    }
  }

  const startEditing = (i) => {
    props.setNoteEd(i);
  }

  React.useEffect(() => {
    if (props.index === props.noteEd) {
      setIsEditing(true)
    } else {
      setIsEditing(false)
      setEditText(currentText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noteEd])
  

  return (
    <div  className={`note ${checkedNote ? 'note_checked' : ''}`}>
      <div className='note__checkbox' onClick={handleCheck}></div>
      <div
        className='note__text'
        onClick={handleCheck}
        style={{ display: isEditing ? 'none' : 'flex' }}
        ref={textRef}
      >
        {currentText}
      </div>
      <input
        type='text'
        className='note__input'
        ref={editRef}
        value={editText}
        style={{ display: isEditing ? 'flex' : 'none' }}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKey(e)}
        onBlur={e => e.target.focus()}
      />
      <div className={`note-actions ${isEditing ? 'visible' : ''}`}>
        <button className='note-actions__button note-actions__button_edit' onClick={() => handleEdit()} style={{ display: isEditing ? 'flex' : 'none' }} ></button>
        <button className='note-actions__button note-actions__button_edit' onClick={() => startEditing(props.index)} style={{ display: isEditing ? 'none' : 'flex' }} >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736'
              stroke='#CDCDCD'
            />
          </svg>
        </button>
        <button className='note-actions__button note-actions__button_rm' onClick={() => props.rmNote(props.index)} style={{ display: isEditing ? 'none' : 'flex' }} >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z'
              stroke='#CDCDCD'
            />
            <path d='M14.625 3.75H3.375' stroke='#CDCDCD' />
            <path d='M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z' stroke='#CDCDCD' />
            <path d='M10.5 9V12.75' stroke='#CDCDCD' />
            <path d='M7.5 9V12.75' stroke='#CDCDCD' />
          </svg>
        </button>
        <button className='note-actions__button note-actions__button_rm' onClick={() => rmEditing()} style={{ display: isEditing ? 'flex' : 'none' }} ></button>
      </div>
    </div>
  );
}

export default Note;

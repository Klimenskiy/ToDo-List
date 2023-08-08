import './popup.scss';
import React from 'react';
import TextArea from '../../components/input/text-area';


function Popup(props) {
  const handleKey = (e) => {
    if (e.key === 'Enter') {
      props.publicNote()
    }
  }

  return (
    <div className={`popup ${props.marker ? `opened` : ''}`} onClick={props.closePopup} id='popup-card'>
      <div className="popup__card">
        <h2 className="popup__title">New Note</h2>
        <form className="popup__form" onSubmit={props.publicNote}>
            <TextArea listenI={props.listenInput} uRef={props.uRef} onKeyDown={(e) => handleKey()}/>

            <div className="popup__buttons">
                <div type='submit' className="popup__button popup__button_stroke" onClick={props.cancelClick}>Cancel</div>
                <button type='submit' className="popup__button popup__button_filled">Apply</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Popup;

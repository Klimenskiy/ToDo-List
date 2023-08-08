import './input.scss';

function TextArea(props) {
  return (
    <div className='field'>
        <input className='field__input field__input_p' placeholder='New note...' onChange={props.listenI} ref={props.uRef} />
    </div>
  );
}

export default TextArea;

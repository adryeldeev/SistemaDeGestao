import PropTypes from 'prop-types';
import { InputFieldStyle } from './InputFieldStyled';

const InputField = ({ type, value, onChange, placeholder, id, label, ref }) => {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <InputFieldStyle
        id={id}
        type={type}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
      />
    </div>
  );
};

// Adicionando validações de props
InputField.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]), 
};


InputField.defaultProps = {
  type: 'text',
  value: undefined, 
  onChange: null, 
  placeholder: '',
  label: null,
  inputRef: null, 
};

export default InputField;

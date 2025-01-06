import PropTypes from 'prop-types'
import { ButtonField } from './ButtonStyled'

const Button = ({text,onClick }) => {
  return (
        <ButtonField onClick={onClick}> {text}</ButtonField>
  )
}

Button.propTypes={
text: PropTypes.string,
onClick: PropTypes.func,
}

Button.defaultProps = {
text: 'Button',
onClick: () => console.log('Button clicked'),
}

export default Button